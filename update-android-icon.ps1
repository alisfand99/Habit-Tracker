# PowerShell script to update Android app icon with logo.png
# This script copies logo.png to all Android mipmap directories

$logoPath = "public\logo.png"
$androidResPath = "android\app\src\main\res"

if (-not (Test-Path $logoPath)) {
    Write-Host "❌ Error: logo.png not found at $logoPath" -ForegroundColor Red
    exit 1
}

Write-Host "🔄 Updating Android app icons..." -ForegroundColor Cyan

# Mipmap directories
$mipmapDirs = @(
    "mipmap-hdpi",
    "mipmap-mdpi",
    "mipmap-xhdpi",
    "mipmap-xxhdpi",
    "mipmap-xxxhdpi"
)

# Icon sizes for each density
$sizes = @{
    "mipmap-mdpi" = 48
    "mipmap-hdpi" = 72
    "mipmap-xhdpi" = 96
    "mipmap-xxhdpi" = 144
    "mipmap-xxxhdpi" = 192
}

foreach ($dir in $mipmapDirs) {
    $targetDir = Join-Path $androidResPath $dir
    if (-not (Test-Path $targetDir)) {
        Write-Host "⚠️  Directory not found: $targetDir" -ForegroundColor Yellow
        continue
    }
    
    $iconPath = Join-Path $targetDir "ic_launcher.png"
    $roundIconPath = Join-Path $targetDir "ic_launcher_round.png"
    
    # Copy logo to both icon files
    Copy-Item -Path $logoPath -Destination $iconPath -Force
    Copy-Item -Path $logoPath -Destination $roundIconPath -Force
    
    Write-Host "✅ Updated icons in $dir" -ForegroundColor Green
}

Write-Host "`n✨ Android icons updated successfully!" -ForegroundColor Green
Write-Host "📝 Note: For best results, resize logo.png to appropriate sizes:" -ForegroundColor Yellow
Write-Host "   - mdpi: 48x48" -ForegroundColor Yellow
Write-Host "   - hdpi: 72x72" -ForegroundColor Yellow
Write-Host "   - xhdpi: 96x96" -ForegroundColor Yellow
Write-Host "   - xxhdpi: 144x144" -ForegroundColor Yellow
Write-Host "   - xxxhdpi: 192x192" -ForegroundColor Yellow


