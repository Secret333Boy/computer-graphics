import { PassThrough } from 'stream';
import { ImageBuffer } from './ImageBuffer';
import { createReadStream, createWriteStream } from 'fs';
import path from 'path';
import WriterPNG from './plugins/png/WriterPNG.writer';
import ReaderPNG from './plugins/png/ReaderPNG.reader';
import { logPassthrough } from './plugins/helpers';

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

const readStream = createReadStream(path.resolve(__dirname, 'file.png'));
new ReaderPNG().read(readStream).then((imageBuffer) => {
  if (imageBuffer === null) {
    console.log('Wrong format');
    return;
  }
  console.log(imageBuffer.imageInfo);
  const passthrough = logPassthrough('');
  imageBuffer.pixels.pipe(passthrough);
});
