import { PassThrough, Readable, Transform, Writable } from 'stream';
import { ImageBuffer } from '../../ImageBuffer';
import { Pixel } from '../../interfaces/Pixel';

// unfortunately, for png at least scanlines have to be fully buffered
export const pixelStreamToScanlineStream = (
  imageBuffer: ImageBuffer
): Readable => {
  let scanline: Pixel[] = [];
  const transformStream = new Transform({
    transform(chunk: Pixel, _, callback) {
      scanline.push(chunk);
      if (scanline.length === imageBuffer.imageInfo.width) {
        this.push(scanline);
        scanline = [];
      }
      callback();
    },
    objectMode: true,
  });
  return imageBuffer.pixels.pipe(transformStream);
};

export const scanlineToBuffer = (scanline: Pixel[]): Buffer => {
  const buffer = Buffer.alloc(scanline.length * 3);
  for (let i = 0; i < scanline.length; i++) {
    buffer[i * 3] = scanline[i].r;
    buffer[i * 3 + 1] = scanline[i].g;
    buffer[i * 3 + 2] = scanline[i].b;
  }
  return buffer;
};

export const scanlineStreamToBufferStream = (
  scanlineStream: Readable
): Readable => {
  const transformStream = new Transform({
    transform(chunk: Pixel[], _, callback) {
      this.push(scanlineToBuffer(chunk));
      callback();
    },
    // yes, we're interested in buffers as objects here, so as to remember scanline boundaries
    objectMode: true,
  });
  return scanlineStream.pipe(transformStream);
};

// basically turns off object mode
export const mergeScanlineStream = (scanlines: Readable): Readable => {
  const concatStream = new PassThrough();
  return scanlines.pipe(concatStream);
};

export const logPassthrough = (prefix: string) =>
  new Transform({
    transform: (chunk: Buffer, _, callback) => {
      console.log(prefix, chunk);
      callback(null, chunk);
    },
  });

export const readNBytes = (n: number, stream: Readable): Promise<Buffer> => {
  console.log('reading', n, 'bytes');
  return new Promise((resolve) => {
    let buffer = Buffer.alloc(0);
    let chunk: Buffer;
    while ((chunk = stream.read(n - buffer.length)) !== null) {
      buffer = Buffer.concat([buffer, chunk]);
      if (buffer.length === n) {
        resolve(buffer);
        return;
      }
    }
    stream.on('readable', () => {
      let chunk: Buffer;
      while ((chunk = stream.read(n - buffer.length)) !== null) {
        buffer = Buffer.concat([buffer, chunk]);
        if (buffer.length === n) {
          resolve(buffer);
          return;
        }
      }
    });
  });
};
