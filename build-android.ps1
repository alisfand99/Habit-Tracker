# اسکریپت ساخت APK اندروید
# استفاده: .\build-android.ps1

Write-Host "🚀 شروع ساخت APK اندروید..." -ForegroundColor Cyan

# بررسی Java
Write-Host "`n📦 بررسی Java..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    Write-Host "✓ Java پیدا شد: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Java پیدا نشد! لطفاً Java JDK را نصب کنید." -ForegroundColor Red
    Write-Host "دانلود از: https://adoptium.net/" -ForegroundColor Yellow
    exit 1
}

# بررسی Android SDK
Write-Host "`n📦 بررسی Android SDK..." -ForegroundColor Yellow
if ($env:ANDROID_HOME) {
    Write-Host "✓ ANDROID_HOME تنظیم شده: $env:ANDROID_HOME" -ForegroundColor Green
} else {
    Write-Host "⚠ ANDROID_HOME تنظیم نشده است." -ForegroundColor Yellow
    Write-Host "اگر Android Studio نصب دارید، می‌توانید از Android Studio استفاده کنید." -ForegroundColor Yellow
}

# Build کردن پروژه وب
Write-Host "`n🔨 Build کردن پروژه وب..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Build ناموفق بود!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Build موفق بود!" -ForegroundColor Green

# Sync با Capacitor
Write-Host "`n🔄 Sync با Capacitor..." -ForegroundColor Yellow
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Sync ناموفق بود!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Sync موفق بود!" -ForegroundColor Green

# ساخت APK
Write-Host "`n📱 ساخت APK..." -ForegroundColor Yellow
Set-Location android
.\gradlew.bat assembleDebug
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ ساخت APK ناموفق بود!" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..

Write-Host "`n✅ APK با موفقیت ساخته شد!" -ForegroundColor Green
Write-Host "📍 مسیر APK: android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor Cyan
Write-Host "`n💡 برای نصب روی دستگاه:" -ForegroundColor Yellow
Write-Host "   1. فایل APK را به دستگاه اندروید منتقل کنید" -ForegroundColor White
Write-Host "   2. روی فایل کلیک کنید و نصب را انجام دهید" -ForegroundColor White
Write-Host "   3. یا از Android Studio استفاده کنید: npm run cap:open:android" -ForegroundColor White


