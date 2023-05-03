import { PassThrough, Readable, Transform } from 'stream';
import { ImageBuffer } from '../../ImageBuffer';
import { ImageWriter } from '../../interfaces/ImageWriter';
import { ImageFormat } from '../../interfaces/ImageFormat';
import {
  BitmapFileHeader,
  BitmapFileInfoSize,
  BitmapFileInfoV3,
} from './types';
import { Pixel } from '../../interfaces/Pixel';
import InverseStream from './lib/InverseStream';

export class WriterBMP implements ImageWriter {
  public readonly format = ImageFormat.BMP;
  public write(imageBuffer: ImageBuffer): Readable {
    const {
      imageInfo: { height, width, maxColor },
      pixels,
    } = imageBuffer;

    const stream = new PassThrough();

    const transformStream = new Transform({
      transform(chunk: Pixel, _encoding, callback) {
        const { r, g, b } = chunk;

        callback(
          null,
          Buffer.from([
            (b * 255) / maxColor,
            (g * 255) / maxColor,
            (r * 255) / maxColor,
          ])
        );
      },
      objectMode: true,
    });

    const bitmapFileHeader: BitmapFileHeader = {
      bfType: 'BM',
      bfSize: 3 * height * width + 54,
      bfReserved1: 0,
      bfReserved2: 0,
      bfOffBits: 54,
    };

    const bitmapInfo: BitmapFileInfoV3 = {
      bcSize: BitmapFileInfoSize.V3,
      bcHeight: height,
      bcWidth: width,
      bcPlanes: 1,
      bcBitCount: 24,
      biCompression: 0,
      biSizeImage: 0,
      biXPelsPerMeter: 0,
      biYPelsPerMeter: 0,
      biClrUsed: 0,
      biClrImportant: 0,
    };

    // write BitmapFileHeader
    stream.push(Buffer.from(bitmapFileHeader.bfType));
    this.writeUInt32(stream, bitmapFileHeader.bfSize);
    this.writeUInt16(stream, bitmapFileHeader.bfReserved1);
    this.writeUInt16(stream, bitmapFileHeader.bfReserved2);
    this.writeUInt32(stream, bitmapFileHeader.bfOffBits);

    //write BitmapFileInfoCore
    this.writeUInt32(stream, bitmapInfo.bcSize);
    this.writeInt32(stream, bitmapInfo.bcWidth);
    this.writeInt32(stream, bitmapInfo.bcHeight);
    this.writeUInt16(stream, bitmapInfo.bcPlanes);
    this.writeUInt16(stream, bitmapInfo.bcBitCount);
    this.writeUInt32(stream, bitmapInfo.biCompression);
    this.writeUInt32(stream, bitmapInfo.biSizeImage);
    this.writeInt32(stream, bitmapInfo.biXPelsPerMeter);
    this.writeInt32(stream, bitmapInfo.biYPelsPerMeter);
    this.writeUInt32(stream, bitmapInfo.biClrUsed);
    this.writeUInt32(stream, bitmapInfo.biClrImportant);

    //write image data
    const inverseStream = new InverseStream(width, height);

    pixels.pipe(inverseStream).pipe(transformStream).pipe(stream);

    return stream;
  }

  private writeUInt16(stream: PassThrough, num: number) {
    const buffer = Buffer.alloc(2);
    buffer.writeUInt16LE(num);
    stream.push(buffer);
  }

  private writeUInt32(stream: PassThrough, num: number) {
    const buffer = Buffer.alloc(4);
    buffer.writeUInt32LE(num);
    stream.push(buffer);
  }

  private writeInt32(stream: PassThrough, num: number) {
    const buffer = Buffer.alloc(4);
    buffer.writeInt32LE(num);
    stream.push(buffer);
  }
}

export default new WriterBMP();
