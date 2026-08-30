Add-Type -AssemblyName System.Drawing

function Crop-Image-Clean($sourcePath, $x, $y, $w, $h, $outputPath) {
    if (Test-Path $sourcePath) {
        $src = [System.Drawing.Image]::FromFile($sourcePath)
        
        # Clamp
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
        Write-Host "Created clean $outputPath ($w x $h)"
    }
}

$uDir = "C:\Users\ZAYN\.gemini\antigravity-ide\brain\2b08b3d9-5730-448f-a136-01c90e7eba03\.user_uploaded"
$destDir = "c:\Users\ZAYN\full stack\assets\images"

# 1. 100% Border-Free Gold Leaf & Flakes (Card 7)
Crop-Image-Clean "$uDir\media_1788118607581.png" 698 174 290 180 "$destDir\design-gold-leaf-luxe.jpg"

# 2. 100% Border-Free Celestial Starburst French (Card 8)
Crop-Image-Clean "$uDir\media_1788118633661.png" 354 298 335 180 "$destDir\design-starburst-french.jpg"

# 3. 100% Border-Free 3D Pink Petal Sculpted
Crop-Image-Clean "$uDir\media_1788118535761.png" 358 260 305 240 "$destDir\design-pink-petal-3d.jpg"

# 4. 100% Border-Free Rose Watercolor Floral
Crop-Image-Clean "$uDir\media_1788118563119.png" 355 10 315 205 "$destDir\design-watercolor-floral.jpg"

# 5. 100% Border-Free Swarovski Crystal Bridal
Crop-Image-Clean "$uDir\media_1788118633661.png" 708 298 275 180 "$destDir\design-swarovski-bridal.jpg"

# 6. 100% Border-Free Daisy Floral
Crop-Image-Clean "$uDir\media_1788118535761.png" 15 15 315 225 "$destDir\design-daisy-floral.jpg"

# 7. 100% Border-Free Ocean Blue Ink Marble
Crop-Image-Clean "$uDir\media_1788118563119.png" 698 10 310 205 "$destDir\design-blue-marble.jpg"
