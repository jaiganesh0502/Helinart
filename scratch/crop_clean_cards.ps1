Add-Type -AssemblyName System.Drawing

function Crop-Image-Precise($sourcePath, $x, $y, $w, $h, $outputPath) {
    if (Test-Path $sourcePath) {
        $src = [System.Drawing.Image]::FromFile($sourcePath)
        
        # Clamp bounds
        if ($x + $w -gt $src.Width) { $w = $src.Width - $x }
        if ($y + $h -gt $src.Height) { $h = $src.Height - $y }
        
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
        Write-Host "Created $outputPath ($w x $h)"
    }
}

$uDir = "C:\Users\ZAYN\.gemini\antigravity-ide\brain\2b08b3d9-5730-448f-a136-01c90e7eba03\.user_uploaded"
$destDir = "c:\Users\ZAYN\full stack\assets\images"

# 1. Clean Gold Leaf & Flakes (from media_1788118607581.png row 1 right, exactly on the hands, zero browser UI)
$s4 = "$uDir\media_1788118607581.png"
Crop-Image-Precise $s4 682 170 315 190 "$destDir\design-gold-leaf-luxe.jpg"

# 2. Clean Celestial Starburst French (from media_1788118633661.png row 2 middle, exactly on the hands, zero borders)
$s5 = "$uDir\media_1788118633661.png"
Crop-Image-Precise $s5 350 295 345 190 "$destDir\design-starburst-french.jpg"

# 3. Clean 3D Pink Petals (from media_1788118535761.png bottom center, 100% clean image)
$s1 = "$uDir\media_1788118535761.png"
Crop-Image-Precise $s1 341 255 341 255 "$destDir\design-pink-petal-3d.jpg"

# 4. Clean Swarovski Crystal Bridal (from media_1788118633661.png row 2 right)
Crop-Image-Precise $s5 702 295 292 190 "$destDir\design-swarovski-bridal.jpg"

# 5. Clean Rose Watercolor Floral (from media_1788118563119.png top center)
$s2 = "$uDir\media_1788118563119.png"
Crop-Image-Precise $s2 341 0 341 222 "$destDir\design-watercolor-floral.jpg"
