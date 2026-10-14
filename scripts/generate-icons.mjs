import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
const sourceIcon = path.join(iconsDir, 'icon-512x512.png');

async function generateIcons() {
  // Generate 192x192
  await sharp(sourceIcon)
    .resize(192, 192)
    .png()
    .toFile(path.join(iconsDir, 'icon-192x192.png'));
  console.log('✅ Generated icon-192x192.png');

  // Resize source to proper 512x512 PNG
  await sharp(sourceIcon)
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'icon-512x512-temp.png'));
  
  // Replace original with proper PNG
  const fs = await import('fs');
  fs.renameSync(
    path.join(iconsDir, 'icon-512x512-temp.png'),
    path.join(iconsDir, 'icon-512x512.png')
  );
  console.log('✅ Generated icon-512x512.png');

  // Generate 512x512 maskable (with 10% safe zone padding)
  const maskableSize = 512;
  const padding = Math.round(maskableSize * 0.1);
  const innerSize = maskableSize - (padding * 2);

  const resizedInner = await sharp(sourceIcon)
    .resize(innerSize, innerSize)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: maskableSize,
      height: maskableSize,
      channels: 4,
      background: { r: 22, g: 163, b: 74, alpha: 1 } // Green #16a34a
    }
  })
    .composite([{
      input: resizedInner,
      top: padding,
      left: padding
    }])
    .png()
    .toFile(path.join(iconsDir, 'icon-512x512-maskable.png'));
  console.log('✅ Generated icon-512x512-maskable.png');

  // Generate apple-touch-icon (180x180)
  await sharp(sourceIcon)
    .resize(180, 180)
    .png()
    .toFile(path.join(iconsDir, 'apple-touch-icon.png'));
  console.log('✅ Generated apple-touch-icon.png');

  // Generate favicon (32x32)
  await sharp(sourceIcon)
    .resize(32, 32)
    .png()
    .toFile(path.join(iconsDir, 'favicon-32x32.png'));
  console.log('✅ Generated favicon-32x32.png');

  // Generate favicon (16x16)
  await sharp(sourceIcon)
    .resize(16, 16)
    .png()
    .toFile(path.join(iconsDir, 'favicon-16x16.png'));
  console.log('✅ Generated favicon-16x16.png');

  console.log('\n🎉 All icons generated successfully!');
}

generateIcons().catch(console.error);
