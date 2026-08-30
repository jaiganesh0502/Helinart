$destDir = "c:\Users\ZAYN\full stack\assets\images"
if (!(Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

$brainDir = "C:\Users\ZAYN\.gemini\antigravity-ide\brain\2b08b3d9-5730-448f-a136-01c90e7eba03"

Get-ChildItem -Path $brainDir -Filter "helinart_hero_nail_art_*.jpg" | Select-Object -First 1 | ForEach-Object { Copy-Item $_.FullName "$destDir\hero-showcase.jpg" -Force }
Get-ChildItem -Path $brainDir -Filter "service_gel_extensions_*.jpg" | Select-Object -First 1 | ForEach-Object { Copy-Item $_.FullName "$destDir\service-gel.jpg" -Force }
Get-ChildItem -Path $brainDir -Filter "service_acrylic_extensions_*.jpg" | Select-Object -First 1 | ForEach-Object { Copy-Item $_.FullName "$destDir\service-acrylic.jpg" -Force }
Get-ChildItem -Path $brainDir -Filter "service_chrome_cateye_*.jpg" | Select-Object -First 1 | ForEach-Object { Copy-Item $_.FullName "$destDir\service-chrome.jpg" -Force }
Get-ChildItem -Path $brainDir -Filter "service_bridal_custom_*.jpg" | Select-Object -First 1 | ForEach-Object { 
    Copy-Item $_.FullName "$destDir\service-bridal.jpg" -Force
    Copy-Item $_.FullName "$destDir\bridal-campaign.jpg" -Force
}

Get-ChildItem -Path $brainDir -Filter "design_sakura_chrome_*.jpg" | Select-Object -First 1 | ForEach-Object { Copy-Item $_.FullName "$destDir\design-sakura-chrome.jpg" -Force }
Get-ChildItem -Path $brainDir -Filter "design_crystal_french_*.jpg" | Select-Object -First 1 | ForEach-Object { Copy-Item $_.FullName "$destDir\design-crystal-french.jpg" -Force }
Get-ChildItem -Path $brainDir -Filter "design_vanilla_glaze_*.jpg" | Select-Object -First 1 | ForEach-Object { Copy-Item $_.FullName "$destDir\design-vanilla-glaze.jpg" -Force }
Get-ChildItem -Path $brainDir -Filter "design_golden_empress_*.jpg" | Select-Object -First 1 | ForEach-Object { Copy-Item $_.FullName "$destDir\design-golden-empress.jpg" -Force }
Get-ChildItem -Path $brainDir -Filter "design_3d_floral_*.jpg" | Select-Object -First 1 | ForEach-Object { Copy-Item $_.FullName "$destDir\design-3d-floral.jpg" -Force }
Get-ChildItem -Path $brainDir -Filter "design_navy_luxe_*.jpg" | Select-Object -First 1 | ForEach-Object { Copy-Item $_.FullName "$destDir\design-navy-luxe.jpg" -Force }

Get-ChildItem -Path $brainDir -Filter "artist_sarah_portrait_*.jpg" | Select-Object -First 1 | ForEach-Object { Copy-Item $_.FullName "$destDir\artist-sarah.jpg" -Force }
Get-ChildItem -Path $brainDir -Filter "artist_elena_portrait_*.jpg" | Select-Object -First 1 | ForEach-Object { 
    Copy-Item $_.FullName "$destDir\artist-elena.jpg" -Force
    Copy-Item $_.FullName "$destDir\artist-chloe.jpg" -Force 
}

# Crop additional nail arts from uploaded screenshots using System.Drawing
Add-Type -AssemblyName System.Drawing

function Crop-Image($sourcePath, $x, $y, $w, $h, $outputPath) {
    if (Test-Path $sourcePath) {
        $src = [System.Drawing.Image]::FromFile($sourcePath)
        $bmp = New-Object System.Drawing.Bitmap($w, $h)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        
        $srcRect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
        $dstRect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
        
        $g.DrawImage($src, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
        $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
        
        $g.Dispose()
        $bmp.Dispose()
        $src.Dispose()
    }
}

$uDir = "$brainDir\.user_uploaded"

# Sheet 1: media_1788118535761.png (Width ~ 1000, Height ~ 500)
$s1 = "$uDir\media_1788118535761.png"
if (Test-Path $s1) {
    $img1 = [System.Drawing.Image]::FromFile($s1)
    $w1 = $img1.Width
    $h1 = $img1.Height
    $img1.Dispose()
    
    # 3 cols, 2 rows approx
    $colW = [int]($w1 / 3)
    $rowH = [int]($h1 / 2)
    
    Crop-Image $s1 0 0 $colW $rowH "$destDir\design-daisy-floral.jpg"
    Crop-Image $s1 ($colW) 0 $colW $rowH "$destDir\design-fruit-pop.jpg"
    Crop-Image $s1 ($colW*2) 0 ($w1 - $colW*2) $rowH "$destDir\design-botanical-art.jpg"
    Crop-Image $s1 0 ($rowH) $colW ($h1 - $rowH) "$destDir\design-pop-art.jpg"
    Crop-Image $s1 ($colW) ($rowH) $colW ($h1 - $rowH) "$destDir\design-pink-petal-3d.jpg"
    Crop-Image $s1 ($colW*2) ($rowH) ($w1 - $colW*2) ($h1 - $rowH) "$destDir\design-peppermint-glitter.jpg"
}

# Sheet 2: media_1788118563119.png (Salon scene + blue marble + purple floral)
$s2 = "$uDir\media_1788118563119.png"
if (Test-Path $s2) {
    $img2 = [System.Drawing.Image]::FromFile($s2)
    $w2 = $img2.Width
    $h2 = $img2.Height
    $img2.Dispose()
    
    $colW = [int]($w2 / 3)
    $rowH = [int]($h2 / 2)
    
    Crop-Image $s2 0 0 $colW $rowH "$destDir\salon-art-craft.jpg"
    Crop-Image $s2 ($colW) 0 $colW $rowH "$destDir\design-watercolor-floral.jpg"
    Crop-Image $s2 ($colW*2) 0 ($w2 - $colW*2) $rowH "$destDir\design-blue-marble.jpg"
    Crop-Image $s2 ($colW) ($rowH) $colW ($h2 - $rowH) "$destDir\design-cozy-knit.jpg"
    Crop-Image $s2 ($colW*2) ($rowH) ($w2 - $colW*2) ($h2 - $rowH) "$destDir\design-purple-floral.jpg"
}

# Sheet 5: media_1788118633661.png (Gold foil + crystal lace + starburst)
$s5 = "$uDir\media_1788118633661.png"
if (Test-Path $s5) {
    $img5 = [System.Drawing.Image]::FromFile($s5)
    $w5 = $img5.Width
    $h5 = $img5.Height
    $img5.Dispose()
    
    $colW = [int]($w5 / 3)
    $rowH = [int]($h5 / 3)
    
    Crop-Image $s5 0 0 $colW $rowH "$destDir\design-oriental-blossom.jpg"
    Crop-Image $s5 ($colW) 0 $colW $rowH "$destDir\design-gold-leaf-luxe.jpg"
    Crop-Image $s5 ($colW*2) 0 ($w5 - $colW*2) $rowH "$destDir\design-crystal-lace.jpg"
    Crop-Image $s5 ($colW) ($rowH) $colW $rowH "$destDir\design-starburst-french.jpg"
    Crop-Image $s5 ($colW*2) ($rowH) ($w5 - $colW*2) $rowH "$destDir\design-swarovski-bridal.jpg"
}

Write-Host "All assets prepared in $destDir"
Get-ChildItem -Path $destDir | Select-Object Name, Length
