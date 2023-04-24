import { createReadStream, createWriteStream } from 'fs';
import path from 'path';
import ReaderPNG from './plugins/png/ReaderPNG.reader';
import { logPassthrough } from './plugins/helpers';
import WriterPNG from './plugins/png/WriterPNG.writer';
import { ImageProcessorLoader } from './ImageProcessorLoader';
import { ImageProcessorsMap } from './ImageProcessorsMap';
import { argv } from 'process';
import { PassThrough } from 'stream';
import { ImageBuffer } from './ImageBuffer';

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
// const stream = new WriterPNG().write(imageBuffer);
// const fileStream = createWriteStream(path.resolve(__dirname, 'file.png'));
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

const main = async () => {
  const loadingPath = argv[3];
  const imageProcessorLoader = new ImageProcessorLoader();
  const processors = await imageProcessorLoader.dynamicallyLoad(loadingPath);
  const imageMap = new ImageProcessorsMap();
  console.log(processors);
  imageMap.fillMaps(processors.readers, processors.writers);
};
main();
