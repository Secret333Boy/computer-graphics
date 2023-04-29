import { PassThrough } from 'stream';
import { ImageBuffer } from './ImageBuffer';
import { WriterPPM } from './plugins/ppm/WriterPPM';
import { createReadStream, createWriteStream } from 'fs';
import path from 'path';
import ReaderBMP from './plugins/bmp/ReaderBMP';
import WriterBMP from './plugins/bmp/WriterBMP';

//ppm
// const pixels = new PassThrough({ objectMode: true });
// pixels.push({ r: 0, g: 0, b: 0 });
// pixels.push({ r: 255, g: 255, b: 255 });
// pixels.push({ r: 255, g: 255, b: 255 });
// pixels.push({ r: 0, g: 0, b: 0 });
// const imageBuffer = new ImageBuffer(
//   {
//     height: 2,
//     width: 2,
//     maxColor: 255,
//   },
//   pixels
// );
// const stream = new WriterPPM().write(imageBuffer);
// const fileStream = createWriteStream(path.resolve(__dirname, 'file.ppm'));
// stream.pipe(fileStream);

//bmp
const readerBMP = new ReaderBMP();
const writerBMP = new WriterBMP();
const writerPPM = new WriterPPM();

const stream = createReadStream(path.resolve(__dirname, './file.bmp'), {
  highWaterMark: 192,
});

// (async () => {
//   const imageBuffer = await readerBMP.read(stream);

//   if (!imageBuffer) throw new Error('No buffer');

//   const writeStream = createWriteStream(
//     path.resolve(__dirname, './result.ppm')
//   );

//   writerPPM.write(imageBuffer).pipe(writeStream);
// })();

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

const fileStream = createWriteStream(path.resolve(__dirname, 'file.bmp'));
writerBMP.write(imageBuffer).pipe(fileStream);
