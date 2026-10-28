import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Android icon sizes needed
const iconSizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

const logoPath = path.join(__dirname, 'public', 'logo.png');
const androidResPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');

console.log('📱 Generating Android icons from logo.png...\n');

// Check if logo exists
if (!fs.existsSync(logoPath)) {
  console.error('❌ logo.png not found in public directory!');
  process.exit(1);
}

// Check if sharp is available (for image processing)
let sharp;
try {
  sharp = (await import('sharp')).default;
} catch (e) {
  console.log('⚠️  sharp package not found. Installing...');
  console.log('Please run: npm install --save-dev sharp');
  console.log('\nAlternatively, you can manually replace the icon files in:');
  console.log('android/app/src/main/res/mipmap-*/ic_launcher*.png');
  console.log('\nRequired sizes:');
  Object.entries(iconSizes).forEach(([folder, size]) => {
    console.log(`  ${folder}: ${size}x${size}px`);
  });
  process.exit(1);
}

// Create foreground icons (just the logo on transparent background)
async function generateIcons() {
  try {
    const logoBuffer = fs.readFileSync(logoPath);
    
    for (const [folder, size] of Object.entries(iconSizes)) {
      const folderPath = path.join(androidResPath, folder);
      
      // Ensure directory exists
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      
      // Generate foreground icon (logo centered on transparent background)
      const foregroundPath = path.join(folderPath, 'ic_launcher_foreground.png');
      await sharp(logoBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toFile(foregroundPath);
      
      console.log(`✅ Generated ${folder}/ic_launcher_foreground.png (${size}x${size})`);
      
      // Generate full launcher icon (logo centered on colored background for older Android versions)
      const logoSize = Math.floor(size * 0.8); // Logo takes 80% of icon space
      const logoOffset = Math.floor((size - logoSize) / 2);
      
      const resizedLogo = await sharp(logoBuffer)
        .resize(logoSize, logoSize, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toBuffer();
      
      const launcherPath = path.join(folderPath, 'ic_launcher.png');
      await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 99, g: 102, b: 241, alpha: 1 } // Indigo-600 background
        }
      })
        .composite([{
          input: resizedLogo,
          top: logoOffset,
          left: logoOffset
        }])
        .toFile(launcherPath);
      
      console.log(`✅ Generated ${folder}/ic_launcher.png (${size}x${size})`);
      
      // Generate round icon (same as regular for now)
      const roundPath = path.join(folderPath, 'ic_launcher_round.png');
      await sharp(launcherPath)
        .toFile(roundPath);
      
      console.log(`✅ Generated ${folder}/ic_launcher_round.png (${size}x${size})`);
    }
    
    console.log('\n✨ Android icons generated successfully!');
    console.log('📝 Note: You may need to rebuild the Android app for changes to take effect.');
    
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    process.exit(1);
  }
}

generateIcons();

