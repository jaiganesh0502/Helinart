Add-Type -AssemblyName System.Drawing
$uDir = "C:\Users\ZAYN\.gemini\antigravity-ide\brain\2b08b3d9-5730-448f-a136-01c90e7eba03\.user_uploaded"

Get-ChildItem -Path $uDir | ForEach-Object {
    $img = [System.Drawing.Image]::FromFile($_.FullName)
    Write-Host "$($_.Name): Width=$($img.Width), Height=$($img.Height)"
    $img.Dispose()
}
