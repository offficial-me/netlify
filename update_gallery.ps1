$mediaFiles = Get-ChildItem -Path ".\" -File -Recurse | Where-Object { $_.Extension -match "\.(jpg|jpeg|png|gif|mp4|webm|webp)$" }

$groupedFiles = @{}

foreach ($file in $mediaFiles) {
    $relativePath = $file.FullName.Substring($PWD.Path.Length + 1).Replace('\', '/')
    $parentFolder = if ($file.DirectoryName -eq $PWD.Path) { "sexy gym guy's leaked videos" } else { $file.Directory.Name }
    
    $type = "image"
    if ($file.Extension -match "\.(mp4|webm)$") {
        $type = "video"
    }
    
    $fileObj = @{
        src = $relativePath
        type = $type
    }
    
    if (-not $groupedFiles.ContainsKey($parentFolder)) {
        $groupedFiles[$parentFolder] = @()
    }
    $groupedFiles[$parentFolder] += $fileObj
}

$jsonArray = @()
foreach ($key in $groupedFiles.Keys) {
    $jsonArray += @{
        folder = $key
        files = $groupedFiles[$key]
    }
}

$json = ""
if ($jsonArray.Count -eq 1) {
    $json = "[" + ($jsonArray | ConvertTo-Json -Depth 10) + "]"
} elseif ($jsonArray.Count -eq 0) {
    $json = "[]"
} else {
    $json = $jsonArray | ConvertTo-Json -Depth 10
}

$jsContent = "window.MEDIA_DATA = $json;"
$jsContent | Out-File -FilePath "media.js" -Encoding utf8
Write-Host "media.js has been updated for folder-based viewing!"
Start-Sleep -Seconds 3
