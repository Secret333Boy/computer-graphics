import { Chunk } from './Chunk';
import zlib from 'zlib';
import {
  FilterType,
  filterDecoders,
  filterEncoders,
  prependFilterType,
} from './Filter';
import {
  mergeScanlineStream,
  pixelStreamToScanlineStream,
  scanlineStreamToBufferStream,
} from '../../../helpers';
import { ImageBuffer } from '../../../../ImageBuffer';
import { Readable, Transform } from 'stream';
import { ImageInfo } from '../../../../interfaces/ImageInfo';
import { COLOR_TYPE, imageInfoToColorType } from './IHDR';
import { Pixel } from '../../../../interfaces/Pixel';

export class IDATChunk extends Chunk {
  constructor(data: Buffer, crc?: number) {
    super('IDAT', data, data.length, crc);
  }

  public static fromChunk(chunk: Chunk): IDATChunk {
    return new IDATChunk(chunk.data, chunk.crc);
  }
}

export const pixelStreamToFilteredStream = (
  image: ImageBuffer,
  filterType: FilterType,
  bpp: number
): Readable => {
  const scanlineBufferStream = scanlineStreamToBufferStream(
    pixelStreamToScanlineStream(image),
    image.imageInfo
  );
  let prevScanline: Buffer | undefined;
  const filteredStream = new Transform({
    transform: (scanline: Buffer, _, callback) => {
      const filteredScanline = prependFilterType(
        filterType,
        filterEncoders[filterType](scanline, bpp, prevScanline)
      );
      prevScanline = scanline;
      callback(null, filteredScanline);
    },
  });
  return mergeScanlineStream(scanlineBufferStream.pipe(filteredStream));
};

export const compressFilteredStream = (filteredStream: Readable): Readable => {
  return filteredStream.pipe(
    zlib.createDeflate({
      level: zlib.constants.Z_BEST_COMPRESSION,
    })
  );
};

export const generateIDATChunks = (
  image: ImageBuffer,
  filterType: FilterType,
  bpp: number
): Readable => {
  const filteredStream = pixelStreamToFilteredStream(image, filterType, bpp);
  const compressedStream = compressFilteredStream(filteredStream);
  const chunkStream = new Transform({
    transform: (chunk: Buffer, _, callback) => {
      callback(null, new IDATChunk(chunk).toBuffer());
    },
  });
  return compressedStream.pipe(chunkStream);
};

export const unwrapIDATChunks = (idatChunks: Readable): Readable => {
  const concatStream = new Transform({
    transform: (chunk: IDATChunk, _, callback) => {
      callback(null, chunk.data);
    },
    objectMode: true,
  });
  return idatChunks.pipe(concatStream);
};

export const decompressStream = (compressedStream: Readable): Readable => {
  return compressedStream.pipe(zlib.createInflate());
};

export const filteredStreamIntoFilteredScanlineStream = (
  filteredStream: Readable,
  scanlineSizeInBytesExceptFilter: number,
  scanlineNumber: number
): Readable => {
  let scanlineBuffer: Buffer = Buffer.alloc(0);
  let scanlineBytes = 0;
  const scanlineSizeWithFilter = scanlineSizeInBytesExceptFilter + 1;
  const transform = new Transform({
    transform: (chunk: Buffer, _, callback) => {
      while (chunk.length > 0) {
        const chunkOfThisScanline = chunk.subarray(
          0,
          scanlineSizeWithFilter - scanlineBytes
        );
        const chunkOfNextScanlines = chunk.subarray(
          scanlineSizeWithFilter - scanlineBytes
        );
        scanlineBuffer = Buffer.concat([scanlineBuffer, chunkOfThisScanline]);
        scanlineBytes = scanlineBuffer.length;
        if (scanlineBytes === scanlineSizeWithFilter) {
          transform.push(scanlineBuffer);
          scanlineBuffer = Buffer.alloc(0);
          scanlineBytes = 0;
        }
        chunk = chunkOfNextScanlines;
      }
      callback();
    },
    highWaterMark: scanlineNumber,
    objectMode: true,
  });
  return filteredStream.pipe(transform);
};

export const filteredScanlinesIntoUnfilteredByteStream = (
  filteredScanlineStream: Readable,
  scanlineNum: number,
  bpp: number
): Readable => {
  let prevScanline: Buffer | undefined;
  const unfilteredScanlineStream = new Transform({
    transform: (chunk: Buffer, _, callback) => {
      const filterType: FilterType = chunk[0];
      const scanlineWithoutFilter = chunk.subarray(1);
      const unfilteredScanline = filterDecoders[filterType](
        scanlineWithoutFilter,
        bpp,
        prevScanline
      );
      prevScanline = unfilteredScanline;
      callback(null, unfilteredScanline);
    },
    objectMode: true,
    highWaterMark: scanlineNum,
  });
  return filteredScanlineStream.pipe(unfilteredScanlineStream);
};

export const byteStreamIntoPixelStream = (
  byteStream: Readable,
  imageInfo: ImageInfo,
  bpp: number
): Readable => {
  let pixel: number[] = [];
  const colorType = imageInfoToColorType(imageInfo);
  const pixelStream = new Transform({
    transform(chunk: Buffer, _, callback) {
      for (let i = 0; i < chunk.length; i++) {
        pixel.push(chunk[i]);
        if (pixel.length === bpp) {
          const pixelObj: Pixel = {
            r: 0,
            g: 0,
            b: 0,
          };
          if (imageInfo.isGrayscale) {
            pixelObj.r = pixelObj.g = pixelObj.b = pixel[0];
          } else {
            pixelObj.r = pixel[0];
            pixelObj.g = pixel[1];
            pixelObj.b = pixel[2];
          }
          if (imageInfo.hasAlpha) {
            pixelObj.a = pixel[3];
          }
          this.push(pixelObj);
          pixel = [];
        }
      }
      callback();
    },
    objectMode: true,
  });
  return byteStream.pipe(pixelStream);
};
