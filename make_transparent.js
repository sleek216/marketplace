const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const processImage = (fileName, threshold = 195) => {
  const inputPath = path.join(__dirname, 'public/landingpage', fileName);
  if (!fs.existsSync(inputPath)) {
    console.error('File does not exist:', inputPath);
    return Promise.resolve();
  }
  return sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
    .then(({ data, info }) => {
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r > threshold && g > threshold && b > threshold) {
          data[i + 3] = 0;
        }
      }
      return sharp(data, {
        raw: {
          width: info.width,
          height: info.height,
          channels: 4
        }
      })
      .png()
      .toFile(inputPath + '.tmp');
    })
    .then(() => {
      fs.renameSync(inputPath + '.tmp', inputPath);
      console.log(`Successfully processed ${fileName}!`);
    });
};

Promise.all([
  processImage('iphone_mockup_center.png', 190),
  processImage('seller_store_3d.png', 210)
]).catch(err => console.error(err));
