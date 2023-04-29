import { ReadStream } from 'fs';
import { PassThrough } from 'stream';
import { ImageBuffer } from '../../ImageBuffer';
import { ImageReader } from '../../interfaces/ImageReader';
import { ImageFormat } from '../../interfaces/ImageFormat';
import { Pixel } from '../../interfaces/Pixel';
import {
  BMPBit,
  BitmapFileInfoSize,
  BitmapFileHeader,
  BitmapFileInfo,
  CommonBitmapFileInfoCore,
  Compression,
  CommonBitmapFileInfoV3,
  CommonBitmapFileInfoV4,
} from './types';

export default class ReaderBMP implements ImageReader {
  public readonly format = ImageFormat.BMP;

  public static readonly possibleBits: BMPBit[] = [
    1, 2, 4, 8, 16, 24, 32, 48, 64,
  ];

  public static readonly maxColorMap: Record<BMPBit, number> = {
    1: 255,
    2: 255,
    4: 255,
    8: 255,
    16: 31,
    24: 255,
    32: 255,
    48: 65535,
    64: 65535,
  };

  public async read(stream: ReadStream): Promise<ImageBuffer | null> {
    try {
      stream.pause();

      const BITMAPFILEHEADER = await this.retrieveBitmapFileHeader(stream);
      const BITMAPINFO = await this.retrieveBitmapInfo(stream);

      console.log(BITMAPFILEHEADER);
      console.log(BITMAPINFO);

      // TODO: handle color table

      const bytesRead = 14 + BITMAPINFO.bcSize;

      stream.read(bytesRead - BITMAPFILEHEADER.bfOffBits);
      stream.resume();

      const pixelBytes: number[] = [];
      const bytesToSplice = Math.ceil(BITMAPINFO.bcBitCount / 8);

      const pixelChunkStream = new PassThrough({
        transform(chunk: Buffer, _encoding, callback) {
          for (const byte of chunk) {
            pixelBytes.push(byte);

            if (pixelBytes.length === bytesToSplice) {
              this.push(Buffer.from(pixelBytes.splice(0, bytesToSplice)));
            }
          }
          callback();
        },

        flush(callback) {
          if (pixelBytes.length === 0) {
            callback();
          } else {
            callback(
              pixelBytes.length === bytesToSplice
                ? null
                : new Error('Invalid last chunk length: ' + pixelBytes.length),
              Buffer.from(pixelBytes)
            );
          }
        },
      });

      const pixelStream = new PassThrough({
        transform(chunk: Buffer, _encoding, callback) {
          switch (BITMAPINFO.bcBitCount) {
            case 1:
              break;
            case 2:
              break;
            case 4:
              break;
            case 8:
              break;
            case 16:
              break;
            case 24:
              this.push({
                r: chunk.readUInt8(2),
                g: chunk.readUInt8(1),
                b: chunk.readUInt8(),
              } as Pixel);
              break;
            case 32:
              this.push({
                r: chunk.readUInt8(3),
                g: chunk.readUInt8(2),
                b: chunk.readUInt8(1),
              } as Pixel);
              break;
            case 48:
              this.push({
                r: chunk.readUInt16LE(3),
                g: chunk.readUInt16LE(2),
                b: chunk.readUInt16LE(1),
              } as Pixel);
              break;
            case 64:
              this.push({
                r: chunk.readUInt16LE(3),
                g: chunk.readUInt16LE(2),
                b: chunk.readUInt16LE(1),
                a: chunk.readUInt16LE(),
              } as Pixel);
              break;
          }

          callback();
        },
        objectMode: true,
      });

      const lines: Pixel[][] = [];
      let currentLine: Pixel[] = [];

      const realHeight =
        BITMAPINFO.bcSize === BitmapFileInfoSize.CORE
          ? BITMAPINFO.bcHeight
          : BITMAPINFO.biSizeImage === 0
          ? BITMAPINFO.bcHeight
          : BITMAPINFO.biSizeImage /
            ((BITMAPINFO.bcWidth * BITMAPINFO.bcBitCount) / 8);

      const inverseStream = new PassThrough({
        transform(chunk: Pixel, _encoding, callback) {
          currentLine.push(chunk);
          if (currentLine.length === BITMAPINFO.bcWidth) {
            lines.push(currentLine);
            currentLine = [];
          }
          callback();
        },
        flush(callback) {
          for (let i = lines.length - 1; i >= 0; i--) {
            for (const pixel of lines[i]) {
              this.push(pixel);
            }
          }

          for (let i = 0; i < realHeight - lines.length; i++) {
            for (let i = 0; i < BITMAPINFO.bcWidth; i++) {
              this.push({ r: 0, g: 0, b: 0 } as Pixel);
            }
          }

          callback();
        },
        objectMode: true,
      });

      stream.pipe(pixelChunkStream).pipe(pixelStream).pipe(inverseStream);

      return new ImageBuffer(
        {
          width: BITMAPINFO.bcWidth,
          height: realHeight,
          maxColor: ReaderBMP.maxColorMap[BITMAPINFO.bcBitCount],
        },
        inverseStream
      );
    } catch (e) {
      console.error('Unable to read BMP: ' + e);
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

        const bfType = bfTypeBuffer.toString();
        if (bfType !== 'BM') {
          reject('BMP file signature is invalid');
          return;
        }

        const bfSizeBuffer: Buffer | null = stream.read(4);
        if (!bfSizeBuffer) {
          reject('No bfSize read');
          return;
        }

        const bfSize = bfSizeBuffer.readUInt32LE();

        const bfReserved1Buffer: Buffer | null = stream.read(2);
        if (!bfReserved1Buffer) {
          reject('No bfReserved1 read');
          return;
        }

        const bfReserved1 = bfReserved1Buffer.readUInt16LE();
        if (bfReserved1 !== 0) {
          reject('bfReserved1 has invalid value');
          return;
        }

        const bfReserved2Buffer: Buffer | null = stream.read(2);
        if (!bfReserved2Buffer) {
          reject('No bfReserved2 read');
          return;
        }

        const bfReserved2 = bfReserved2Buffer.readUInt16LE();
        if (bfReserved2 !== 0) {
          reject('bfReserved1 has invalid value');
          return;
        }

        const bfOffBitsBuffer: Buffer | null = stream.read(4);
        if (!bfOffBitsBuffer) {
          reject('No bfOffBits read');
          return;
        }

        const bfOffBits = bfOffBitsBuffer.readUInt32LE();

        resolve({ bfType, bfSize, bfReserved1, bfReserved2, bfOffBits });
      });
    });
  }

  public retrieveBitmapInfo(stream: ReadStream): Promise<BitmapFileInfo> {
    return new Promise((resolve, reject) => {
      stream.once('readable', () => {
        const bcSizeBuffer: Buffer | null = stream.read(4);
        if (!bcSizeBuffer) {
          reject('No bcSize read');
          return;
        }

        const bcSizeNumber = bcSizeBuffer.readUInt32LE();
        let bcSize: BitmapFileInfoSize;

        switch (bcSizeNumber) {
          case BitmapFileInfoSize.CORE:
          case BitmapFileInfoSize.V3:
          case BitmapFileInfoSize.V4:
          case BitmapFileInfoSize.V5:
            bcSize = bcSizeNumber;
            break;

          default:
            reject('Unexpected bcSize:' + bcSizeNumber);
            return;
        }

        const bcWidthBuffer: Buffer | null = stream.read(
          bcSize === BitmapFileInfoSize.CORE ? 2 : 4
        );
        if (!bcWidthBuffer) {
          reject('No bcWidth read');
          return;
        }
        const bcWidth =
          bcSize === BitmapFileInfoSize.CORE
            ? bcWidthBuffer.readUInt16LE()
            : bcWidthBuffer.readInt32LE();

        const bcHeightBuffer: Buffer | null = stream.read(
          bcSize === BitmapFileInfoSize.CORE ? 2 : 4
        );
        if (!bcHeightBuffer) {
          reject('No bcHeight read');
          return;
        }
        const bcHeight =
          bcSize === BitmapFileInfoSize.CORE
            ? bcWidthBuffer.readUInt16LE()
            : bcWidthBuffer.readInt32LE();

        const bcPlanesBuffer: Buffer | null = stream.read(2);
        if (!bcPlanesBuffer) {
          reject('No bcPlanes read');
          return;
        }
        const bcPlanes = bcPlanesBuffer.readUInt16LE();
        if (bcPlanes !== 1) {
          reject(`Invalid bcPlanes (expected 1, got ${bcPlanes})`);
          return;
        }

        const bcBitCountBuffer: Buffer | null = stream.read(2);
        if (!bcBitCountBuffer) {
          reject('No bcBitCount read');
          return;
        }
        const bcBitCountNumber = bcBitCountBuffer.readUInt16LE();
        if (!ReaderBMP.possibleBits.includes(bcBitCountNumber as BMPBit)) {
          reject('Invalid bcBitCount: ' + bcBitCountNumber);
          return;
        }
        const bcBitCount: BMPBit = bcBitCountNumber as BMPBit;

        const commonBitmapFileInfoCore: CommonBitmapFileInfoCore = {
          bcWidth,
          bcHeight,
          bcPlanes,
          bcBitCount,
        };

        if (bcSize === BitmapFileInfoSize.CORE) {
          resolve({ ...commonBitmapFileInfoCore, bcSize });
          return;
        }

        const biCompressionBuffer: Buffer | null = stream.read(4);
        if (!biCompressionBuffer) {
          reject('No biCompression read');
          return;
        }
        const biCompressionNumber = biCompressionBuffer.readInt32LE();
        if (!Object.values(Compression).includes(biCompressionNumber)) {
          reject('Invalid biCompression: ' + biCompressionNumber);
          return;
        }
        const biCompression: Compression = biCompressionNumber;

        const biSizeImageBuffer: Buffer | null = stream.read(4);
        if (!biSizeImageBuffer) {
          reject('No biSizeImage read');
          return;
        }
        const biSizeImage = biSizeImageBuffer.readUInt32LE();

        const biXPelsPerMeterBuffer: Buffer | null = stream.read(4);
        if (!biXPelsPerMeterBuffer) {
          reject('No biXPelsPerMeter read');
          return;
        }
        const biXPelsPerMeter = biXPelsPerMeterBuffer.readUInt32LE();

        const biYPelsPerMeterBuffer: Buffer | null = stream.read(4);
        if (!biYPelsPerMeterBuffer) {
          reject('No biYPelsPerMeter read');
          return;
        }
        const biYPelsPerMeter = biYPelsPerMeterBuffer.readUInt32LE();

        const biClrUsedBuffer: Buffer | null = stream.read(4);
        if (!biClrUsedBuffer) {
          reject('No biClrUsed read');
          return;
        }
        const biClrUsed = biClrUsedBuffer.readUInt32LE();

        const biClrImportantBuffer: Buffer | null = stream.read(4);
        if (!biClrImportantBuffer) {
          reject('No biClrImportant read');
          return;
        }
        const biClrImportant = biClrImportantBuffer.readUInt32LE();

        const commonBitmapFileInfoV3: CommonBitmapFileInfoV3 = {
          ...commonBitmapFileInfoCore,
          biCompression,
          biSizeImage,
          biXPelsPerMeter,
          biYPelsPerMeter,
          biClrUsed,
          biClrImportant,
        };

        if (bcSize === BitmapFileInfoSize.V3) {
          resolve({ ...commonBitmapFileInfoV3, bcSize });
          return;
        }

        const bV4RedMaskBuffer: Buffer | null = stream.read(4);
        if (!bV4RedMaskBuffer) {
          reject('No bV4RedMask read');
          return;
        }
        const bV4RedMask = bV4RedMaskBuffer.toString('hex');

        const bV4GreenMaskBuffer: Buffer | null = stream.read(4);
        if (!bV4GreenMaskBuffer) {
          reject('No bV4GreenMask read');
          return;
        }
        const bV4GreenMask = bV4GreenMaskBuffer.toString('hex');

        const bV4BlueMaskBuffer: Buffer | null = stream.read(4);
        if (!bV4BlueMaskBuffer) {
          reject('No bV4BlueMask read');
          return;
        }
        const bV4BlueMask = bV4BlueMaskBuffer.toString('hex');

        const bV4AlphaMaskBuffer: Buffer | null = stream.read(4);
        if (!bV4AlphaMaskBuffer) {
          reject('No bV4AlphaMask read');
          return;
        }
        const bV4AlphaMask = bV4AlphaMaskBuffer.toString('hex');

        const bV4CSTypeBuffer: Buffer | null = stream.read(4);
        if (!bV4CSTypeBuffer) {
          reject('No bV4CSType read');
          return;
        }
        const bV4CSType = bV4CSTypeBuffer.toString('hex');

        const bV4EndpointsBuffer: Buffer | null = stream.read(36);
        if (!bV4EndpointsBuffer) {
          reject('No bV4Endpoints read');
          return;
        }
        const bV4Endpoints = bV4EndpointsBuffer.toString('hex');

        const bV4GammaRedBuffer: Buffer | null = stream.read(4);
        if (!bV4GammaRedBuffer) {
          reject('No bV4GammaRed read');
          return;
        }
        const bV4GammaRed = bV4GammaRedBuffer.toString('hex');

        const bV4GammaGreenBuffer: Buffer | null = stream.read(4);
        if (!bV4GammaGreenBuffer) {
          reject('No bV4GammaGreen read');
          return;
        }
        const bV4GammaGreen = bV4GammaGreenBuffer.toString('hex');

        const bV4GammaBlueBuffer: Buffer | null = stream.read(4);
        if (!bV4GammaBlueBuffer) {
          reject('No bV4GammaBlue read');
          return;
        }
        const bV4GammaBlue = bV4GammaBlueBuffer.toString('hex');

        const commonBitmapFileInfoV4: CommonBitmapFileInfoV4 = {
          ...commonBitmapFileInfoV3,
          bV4RedMask,
          bV4GreenMask,
          bV4BlueMask,
          bV4AlphaMask,
          bV4CSType,
          bV4Endpoints,
          bV4GammaRed,
          bV4GammaGreen,
          bV4GammaBlue,
        };

        if (bcSize === BitmapFileInfoSize.V4) {
          resolve({ ...commonBitmapFileInfoV4, bcSize });
          return;
        }

        const bV5IntentBuffer: Buffer | null = stream.read(4);
        if (!bV5IntentBuffer) {
          reject('No bV5Intent read');
          return;
        }
        const bV5Intent = bV5IntentBuffer.toString('hex');

        const bV5ProfileDataBuffer: Buffer | null = stream.read(4);
        if (!bV5ProfileDataBuffer) {
          reject('No bV5ProfileData read');
          return;
        }
        const bV5ProfileData = bV5ProfileDataBuffer.toString('hex');

        const bV5ProfileSizeBuffer: Buffer | null = stream.read(4);
        if (!bV5ProfileSizeBuffer) {
          reject('No bV5ProfileSize read');
          return;
        }
        const bV5ProfileSize = bV5ProfileSizeBuffer.toString('hex');

        const bV5ReservedBuffer: Buffer | null = stream.read(4);
        if (!bV5ReservedBuffer) {
          reject('No bV5Reserved read');
          return;
        }
        const bV5Reserved = bV5ReservedBuffer.toString('hex');

        resolve({
          ...commonBitmapFileInfoV4,
          bV5Intent,
          bV5ProfileData,
          bV5ProfileSize,
          bV5Reserved,
          bcSize,
        });
      });
    });
  }
}
