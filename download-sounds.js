import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create sounds directory if it doesn't exist
const soundsDir = path.join(__dirname, 'public', 'sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
  console.log('✅ Created public/sounds directory');
}

// Sound files to download
const sounds = [
  {
    url: 'https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3',
    filename: 'pop.mp3',
    name: 'Pop (Check)'
  },
  {
    url: 'https://codeskulptor-demos.commondatastorage.googleapis.com/pang/arrow.mp3',
    filename: 'arrow.mp3',
    name: 'Click (Tap)'
  },
  {
    url: 'https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/bonus.mp3',
    filename: 'bonus.mp3',
    name: 'Success (Celebration)'
  }
];

// Download function
function downloadFile(url, filepath, name) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${name}`);
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirects
        file.close();
        fs.unlinkSync(filepath);
        downloadFile(response.headers.location, filepath, name)
          .then(resolve)
          .catch(reject);
      } else {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`Failed to download ${name}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
  });
}

// Download all sounds
async function downloadAllSounds() {
  console.log('🎵 Starting sound downloads...\n');
  
  for (const sound of sounds) {
    const filepath = path.join(soundsDir, sound.filename);
    
    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`⏭️  Skipped (already exists): ${sound.name}`);
      continue;
    }
    
    try {
      await downloadFile(sound.url, filepath, sound.name);
    } catch (error) {
      console.error(`❌ Error downloading ${sound.name}:`, error.message);
    }
  }
  
  console.log('\n✨ Download complete!');
}

// Run the download
downloadAllSounds().catch(console.error);

