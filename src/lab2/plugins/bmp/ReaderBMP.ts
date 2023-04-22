import { ReadStream } from 'fs';
import { Readable } from 'stream';
import { ImageBuffer } from '../../ImageBuffer';
import { ImageReader } from '../../interfaces/ImageReader';
import { ImageFormat } from '../../interfaces/ImageFormat';

interface BitmapFileHeader {
  bfType: string;
  bfSize: string;
  bfReserved1: string;
  bfReserved2: string;
  bfOffBits: string;
}

export default class ReaderBMP implements ImageReader {
  public readonly format = ImageFormat.BMP;

  public async read(stream: ReadStream): Promise<ImageBuffer | null> {
    try {
      stream.pause();

      const BITMAPFILEHEADER = await this.retrieveBitmapFileHeader(stream);

      console.log(BITMAPFILEHEADER);
      console.log(stream);

      return new ImageBuffer(
        { height: 0, width: 0, maxColor: 0 },
        new Readable()
      );
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public retrieveBitmapFileHeader(
    stream: ReadStream
  ): Promise<BitmapFileHeader> {
    return new Promise((resolve, reject) => {
      stream.once('readable', () => {
        const bfTypeBuffer: Buffer | null = stream.read(2);
        if (!bfTypeBuffer) {
          reject('No bfType read');
          return;
        }

        const bfType = bfTypeBuffer.toString('hex');
        if (bfType !== '424d') reject('BMP file signature is invalid');

        const bfSizeBuffer: Buffer | null = stream.read(4);
        if (!bfSizeBuffer) {
          reject('No bfSize read');
          return;
        }

        const bfSize = bfSizeBuffer.toString('hex');

        const bfReserved1Buffer: Buffer | null = stream.read(2);
        if (!bfReserved1Buffer) {
          reject('No bfReserved1 read');
          return;
        }

        const bfReserved1 = bfReserved1Buffer.toString('hex');
        if (bfReserved1 !== '0000') reject('bfReserved1 has invalid value');

        const bfReserved2Buffer: Buffer | null = stream.read(2);
        if (!bfReserved2Buffer) {
          reject('No bfReserved2 read');
          return;
        }

        const bfReserved2 = bfReserved2Buffer.toString('hex');
        if (bfReserved2 !== '0000') reject('bfReserved1 has invalid value');

        const bfOffBitsBuffer: Buffer | null = stream.read(4);
        if (!bfOffBitsBuffer) {
          reject('No bfOffBits read');
          return;
        }

        const bfOffBits = bfOffBitsBuffer.toString('hex');

        resolve({ bfType, bfSize, bfReserved1, bfReserved2, bfOffBits });
      });
    });
  }
}
