import { PassThrough, Readable, Transform } from 'stream';
import { ImageBuffer } from '../../ImageBuffer';
import { Pixel } from '../../interfaces/Pixel';
import { ImageInfo } from '../../interfaces/ImageInfo';
import {
  colorTypeToBpp,
  imageInfoToBitDepth,
  imageInfoToColorType,
} from '../png/lib/chunks/IHDR';

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

export const scanlineToBuffer = (
  scanline: Pixel[],
  imageInfo: ImageInfo
): Buffer => {
  const bitDepth = imageInfoToBitDepth(imageInfo);
  const bytesPerSample = bitDepth / 8;
  const colorType = imageInfoToColorType(imageInfo);
  const bpp = colorTypeToBpp(colorType, bitDepth);
  const maxColor = Math.pow(2, bitDepth) - 1;
  const buffer = Buffer.alloc(scanline.length * bpp);
  // if maxColor in imageBuffer is twice as high as our allowed maxColor, we shall divide each sample by 2
  const divideEachSampleBy = imageInfo.maxColor / maxColor;
  for (let i = 0; i < scanline.length; i++) {
    const dividedSample: Pixel = {
      r: Math.floor(scanline[i].r / divideEachSampleBy),
      g: Math.floor(scanline[i].g / divideEachSampleBy),
      b: Math.floor(scanline[i].b / divideEachSampleBy),
      a:
        scanline[i].a !== undefined
          ? Math.floor((scanline[i].a as number) / divideEachSampleBy)
          : undefined,
    };
    if (imageInfo.isGrayscale) {
      buffer.writeUIntBE(dividedSample.r, i * bpp, bytesPerSample);
    } else {
      buffer.writeUIntBE(dividedSample.r, i * bpp, bytesPerSample);
      buffer.writeUIntBE(
        dividedSample.g,
        i * bpp + bytesPerSample,
        bytesPerSample
      );
      buffer.writeUIntBE(
        dividedSample.b,
        i * bpp + bytesPerSample * 2,
        bytesPerSample
      );
    }
    if (imageInfo.hasAlpha) {
      buffer.writeUIntBE(
        dividedSample.a ?? maxColor,
        i * bpp + bytesPerSample * 3,
        bytesPerSample
      );
    }
  }
  return buffer;
};

export const scanlineStreamToBufferStream = (
  scanlineStream: Readable,
  imageInfo: ImageInfo
): Readable => {
  const transformStream = new Transform({
    transform(chunk: Pixel[], _, callback) {
      this.push(scanlineToBuffer(chunk, imageInfo));
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

export const logPassthrough = (prefix: string, highWaterMark?: number) =>
  new Transform({
    transform: (chunk: Buffer, _, callback) => {
      console.log(prefix, chunk);
      callback();
    },
    highWaterMark,
    objectMode: true,
  });

export const readNBytes = (n: number, stream: Readable): Promise<Buffer> => {
  return new Promise((resolve) => {
    let buffer = Buffer.alloc(0);
    if (n === 0) resolve(buffer);
    let chunk: Buffer;
    const onReadable = () => {
      let chunk: Buffer;
      while ((chunk = stream.read(n - buffer.length)) !== null) {
        buffer = Buffer.concat([buffer, chunk]);
        if (buffer.length === n) {
          stream.removeListener('readable', onReadable);
          resolve(buffer);
          return;
        }
      }
    };
    while ((chunk = stream.read(n - buffer.length)) !== null) {
      buffer = Buffer.concat([buffer, chunk]);
      if (buffer.length === n) {
        resolve(buffer);
        return;
      }
    }
    stream.on('readable', onReadable);
    stream.on('end', () => {
      resolve(buffer);
    });
  });
};
