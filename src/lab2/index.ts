import { PassThrough } from 'stream';
import { ImageBuffer } from './ImageBuffer';
import { WriterPPM } from './plugins/ppm/WriterPPM';
import { createWriteStream } from 'fs';
import path from 'path';

const pixels = new PassThrough({ objectMode: true });
pixels.push({ r: 0, g: 0, b: 0 });
pixels.push({ r: 255, g: 255, b: 255 });
pixels.push({ r: 255, g: 255, b: 255 });
pixels.push({ r: 0, g: 0, b: 0 });
const imageBuffer = new ImageBuffer(
  {
    height: 2,
    width: 2,
    maxColor: 255,
  },
  pixels
);
const stream = new WriterPPM().write(imageBuffer);
const fileStream = createWriteStream(path.resolve(__dirname, 'file.ppm'));
stream.pipe(fileStream);