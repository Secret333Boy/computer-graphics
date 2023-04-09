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
  filterType: FilterType
): Readable => {
  const scanlineBufferStream = scanlineStreamToBufferStream(
    pixelStreamToScanlineStream(image)
  );
  let prevScanline: Buffer | undefined;
  const filteredStream = new Transform({
    transform: (scanline: Buffer, _, callback) => {
      const filteredScanline = prependFilterType(
        filterType,
        filterEncoders[filterType](scanline, 3, prevScanline)
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
  filterType: FilterType
): Readable => {
  const filteredStream = pixelStreamToFilteredStream(image, filterType);
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
  });
  return idatChunks.pipe(concatStream);
};

export const decompressStream = (compressedStream: Readable): Readable => {
  return compressedStream.pipe(zlib.createInflate());
};

export const mergedStreamToScanlineBufferStream = (
  mergedStream: Readable,
  
): Readable => {
  const scanlineBufferStream = new Transform({
    transform: (chunk: Buffer, _, callback) => {
      callback(null, chunk.slice(1));
    },
    objectMode: true,
  });
  return mergedStream.pipe(scanlineBufferStream);
};
