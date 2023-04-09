import { PassThrough, Readable, Writable } from 'stream';
import { ImageBuffer } from '../../ImageBuffer';
import { ImageReader } from '../../interfaces/ImageReader';
import { readNBytes } from '../helpers';
import { magic } from './lib/chunks/Magic';
import { Chunk } from './lib/chunks/Chunk';
import { IHDRChunk } from './lib/chunks/IHDR';
import { IDATChunk, unwrapIDATChunks } from './lib/chunks/IDAT';

export default class ReaderPNG implements ImageReader {
  async read(stream: Readable): Promise<ImageBuffer | null> {
    if (!(await this.isPng(stream))) {
      return null;
    }
    const pixelStream = new PassThrough({
      objectMode: true,
    });
    const IDATChunksStream = new PassThrough({
      objectMode: true,
    });
    const imageBuffer = new ImageBuffer(
      { width: 0, height: 0, maxColor: 255 },
      pixelStream
    );
    while (stream.readable) {
      const chunk = await Chunk.chunkFromStream(stream);
      console.log(chunk.type);
      const handler = this.chunkHandlers[chunk.type];
      handler(imageBuffer, chunk, pixelStream, IDATChunksStream);
    }
    return imageBuffer;
  }
  private async isPng(stream: Readable): Promise<boolean> {
    const buffer = await readNBytes(magic.length, stream);
    return buffer.equals(magic);
  }
  public readonly format = 'png';

  private chunkHandlers: Record<
    string,
    (
      imageBuffer: ImageBuffer,
      chunk: Chunk,
      stream: Writable,
      IDATChunksStream: Writable
    ) => void
  > = {
    IHDR: (imageBuffer: ImageBuffer, chunk: Chunk) => {
      const ihdrChunk = IHDRChunk.fromChunk(chunk);
      imageBuffer.imageInfo.width = ihdrChunk.width;
      imageBuffer.imageInfo.height = ihdrChunk.height;
    },
    IDAT: (
      imageBuffer: ImageBuffer,
      chunk: Chunk,
      stream: Writable,
      IDATChunksStream
    ) => {
      IDATChunksStream.write(IDATChunk.fromChunk(chunk));
    },
  };

  private flushIDATChunks(IDATChunksStream: Readable, stream: Writable) {
    const chunkStreamToCompressedStream = unwrapIDATChunks(IDATChunksStream);
    
  }
}
