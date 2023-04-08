import { Chunk } from './Chunk';
import zlib from 'zlib';
import { FilterType, filterEncoders, prependFilterType } from './Filter';
import {
  mergeScanlineStream,
  pixelStreamToScanlineStream,
  scanlineStreamToBufferStream,
} from '../../../helpers';
import { ImageBuffer } from '../../../../ImageBuffer';
import { Readable, Transform } from 'stream';

export class IDATChunk extends Chunk {
  constructor(data: Buffer) {
    super('IDAT', data);
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
