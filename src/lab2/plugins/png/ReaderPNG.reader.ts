import { PassThrough, Readable, Transform, Writable } from 'stream';
import { ImageBuffer } from '../../ImageBuffer';
import { ImageReader } from '../../interfaces/ImageReader';
import { readNBytes } from '../helpers';
import { magic } from './lib/chunks/Magic';
import { Chunk } from './lib/chunks/Chunk';
import { IHDRChunk } from './lib/chunks/IHDR';
import {
  IDATChunk,
  byteStreamIntoPixelStream,
  decompressStream,
  filteredScanlinesIntoUnfilteredByteStream,
  filteredStreamIntoFilteredScanlineStream,
  unwrapIDATChunks,
} from './lib/chunks/IDAT';

export default class ReaderPNG implements ImageReader {
  async read(stream: Readable): Promise<ImageBuffer | null> {
    if (!(await this.isPng(stream))) {
      return null;
    }
    const pixelStream = new PassThrough({
      objectMode: true,
    });
    const imageBuffer = new ImageBuffer(
      { width: 0, height: 0, maxColor: 255 },
      pixelStream
    );
    while (stream.readable) {
      const chunk = await Chunk.chunkFromStream(stream);
      console.log(`Read chunk of type ${chunk.type} and size ${chunk.length}`);
      const handler = this.chunkHandlers[chunk.type];
      if (handler) {
        const shouldContinue = await handler(imageBuffer, chunk, pixelStream);
        if (!shouldContinue) {
          break;
        }
      } else {
        console.warn(`Unknown chunk type encountered ${chunk.type}`);
      }
    }
    return imageBuffer;
  }
  private async isPng(stream: Readable): Promise<boolean> {
    const buffer = await readNBytes(magic.length, stream);
    return buffer.equals(magic);
  }
  public readonly format = 'png';

  private IDATChunkStream: Writable | null = null;

  private chunkHandlers: Record<
    string,
    (
      imageBuffer: ImageBuffer,
      chunk: Chunk,
      stream: Writable
    ) => Promise<boolean>
  > = {
    IHDR: async (imageBuffer: ImageBuffer, chunk: Chunk) => {
      const ihdrChunk = IHDRChunk.fromChunk(chunk);
      imageBuffer.imageInfo.width = ihdrChunk.width;
      imageBuffer.imageInfo.height = ihdrChunk.height;
      return true;
    },
    IDAT: async (imageBuffer: ImageBuffer, chunk: Chunk, stream: Writable) => {
      if (!this.IDATChunkStream) {
        const IDATChunksStream = new Transform({
          objectMode: true,
          transform: (chunk: IDATChunk, _, callback) => {
            callback(null, chunk);
          },
        });
        const unwrappedIDATChunksStream = unwrapIDATChunks(IDATChunksStream);
        const decompressedIDATChunksStream = decompressStream(
          unwrappedIDATChunksStream
        );
        const filteredScanlines = filteredStreamIntoFilteredScanlineStream(
          decompressedIDATChunksStream,
          imageBuffer.imageInfo.width * 3
        );
        const unfilteredBytes =
          filteredScanlinesIntoUnfilteredByteStream(filteredScanlines);
        const pixels = byteStreamIntoPixelStream(unfilteredBytes, 3);
        pixels.pipe(stream);
        this.IDATChunkStream = IDATChunksStream;
      }
      this.IDATChunkStream.write(IDATChunk.fromChunk(chunk));
      return true;
    },
    IEND: async () => {
      this.IDATChunkStream?.end();
      return false;
    },
  };
}
