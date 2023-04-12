import { ImageBuffer } from '../../ImageBuffer';
import { PassThrough, Transform } from 'stream';
import { Pixel } from '../../interfaces/Pixel';
import { ImageWriter } from '../../interfaces/ImageWriter';

export class WriterPPM implements ImageWriter {
  public readonly format = 'ppm';

  write(imageBuffer: ImageBuffer) {
    const stream = new PassThrough();
    const { height, width, maxColor } = imageBuffer.imageInfo;
    stream.push(`P3 ${width} ${height} ${maxColor}\n`);
    const transformStream = new Transform({
      transform: (chunk: Pixel, _, callback) => {
        callback(null, `${chunk.r} ${chunk.g} ${chunk.b}\n`);
      },
      objectMode: true,
    });
    imageBuffer.pixels.pipe(transformStream);
    transformStream.pipe(stream);
    return stream;
  }
}
