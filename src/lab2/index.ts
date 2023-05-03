import { createReadStream, createWriteStream } from 'fs';
import path from 'path';
import WriterPPM from './plugins/ppm/WriterPPM.writer';
import ReaderBMP from './plugins/bmp/bmp.reader';
import WriterBMP from './plugins/bmp/bmp.writer';

// PPM

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

// const reader = new ReaderPPM();
// const inputStream = createReadStream('/home/liubazamula/projects/image.ppm');

// reader
//   .read(inputStream)
//   .then((imageBuffer) => {
//     if (imageBuffer) {
//       console.log(imageBuffer);
//       stream.pipe(fileStream);
//     } else {
//       console.error('Unable to read image file');
//     }
//   })
//   .catch((error) => {
//     console.error(error);
//   });

//bmp
const readerBMP = new ReaderBMP();
const writerBMP = new WriterBMP();
const writerPPM = new WriterPPM();

const stream = createReadStream(path.resolve(__dirname, './file.bmp'), {
  highWaterMark: 192,
});
(async () => {
  const imageBuffer = await readerBMP.read(stream);

  if (!imageBuffer) throw new Error('No imageBuffer');

  const writeStream = createWriteStream(
    path.resolve(__dirname, './result.ppm')
  );

  writerPPM.write(imageBuffer).pipe(writeStream);
})();

// const pixels = new PassThrough({ objectMode: true });
// const width = 200;
// const height = 200;

// for (let i = 0; i < width; i++) {
//   for (let j = 0; j < height; j++) {
//     pixels.push(
//       (i + j) % 2 === 0 ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 }
//     );
//   }
// }

// pixels.end();
// const imageBuffer = new ImageBuffer(
//   {
//     height,
//     width,
//     maxColor: 255,
//   },
//   pixels
// );

// const fileStream = createWriteStream(path.resolve(__dirname, 'file.bmp'));
// writerBMP.write(imageBuffer).pipe(fileStream);
// const stream = new WriterPNG().write(imageBuffer);
// const fileStream = createWriteStream(path.resolve(__dirname, 'file.png'));
// stream.pipe(fileStream);

// png

// const pixels = new PassThrough({ objectMode: true });
// pixels.push({ r: 0, g: 0, b: 0 });
// pixels.push({ r: 255, g: 255, b: 0 });
// pixels.push({ r: 255, g: 255, b: 255 });
// pixels.push({ r: 0, g: 0, b: 0 });
// pixels.push(null);
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
// const readStream = createReadStream(
//   path.resolve(__dirname, 'plugins/png/samples/cubes.png')
// );
// const writeStream = createWriteStream(path.resolve(__dirname, 'file.png'));
// const writerPng = new WriterPNG();
// new ReaderPNG().read(readStream).then((imageBuffer) => {
//   if (imageBuffer === null) {
//     console.log('Wrong format');
//     return;
//   }
//   console.log(imageBuffer.imageInfo);
//   // const passthrough = logPassthrough('');
//   // imageBuffer.pixels.pipe(passthrough);
//   writerPng.write(imageBuffer).pipe(writeStream);
// });

// const main = async () => {
//   const loadingPath = argv[3];
//   const imageProcessorLoader = new ImageProcessorLoader();
//   const processors = await imageProcessorLoader.dynamicallyLoad(loadingPath);
//   const imageMap = new ImageProcessorsMap();
//   console.log(processors);
//   imageMap.fillMaps(processors.readers, processors.writers);
// };
// main();
