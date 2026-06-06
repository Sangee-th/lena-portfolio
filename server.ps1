$port = 3000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Server running at http://localhost:$port/"
$folder = "C:\Users\SANGEETH\Downloads\Lena"

# Clean up listener on script exit
Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action {
    $listener.Stop()
    $listener.Close()
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/") { $urlPath = "/index.html" }
        
        # Format file path (remove leading slash)
        $cleanPath = $urlPath.TrimStart('/')
        $filePath = [System.IO.Path]::Combine($folder, $cleanPath)
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            # Content Type Mapping
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            switch ($ext) {
                ".css" { $response.ContentType = "text/css" }
                ".js"  { $response.ContentType = "application/javascript" }
                ".png" { $response.ContentType = "image/png" }
                ".pdf" { $response.ContentType = "application/pdf" }
                default { $response.ContentType = "text/html" }
            }
            
            # $response.ContentLength64 = $bytes.Length  # Disabled to avoid length mismatch
            $response.SendChunked = $true
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errorBytes = [System.Text.Encoding]::UTF8.GetBytes("404 File Not Found: $urlPath")
            $response.ContentLength64 = $errorBytes.Length
            $response.OutputStream.Write($errorBytes, 0, $errorBytes.Length)
        }
        $response.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
