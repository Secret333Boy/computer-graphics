import { PassThrough, Writable } from 'stream';
import { ImageBuffer } from '../../ImageBuffer';
import { ImageWriter } from '../../interfaces/ImageWriter';
import { COLOR_TYPE, IHDRChunk, INTERLACE_METHOD } from './lib/chunks/IHDR';
import { generateIDATChunks } from './lib/chunks/IDAT';
import { FilterType } from './lib/chunks/Filter';

export default class WriterPNG implements ImageWriter {
  public readonly format = 'png';
  write(imageBuffer: ImageBuffer) {
    const stream = new PassThrough();
    this.writeHeader(stream);
    this.writeIHDR(stream, imageBuffer);
    this.writeIDATs(stream, imageBuffer);
    return stream;
  }

  private writeHeader(stream: Writable) {
    stream.write(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }

  private writeIHDR(stream: Writable, imageBuffer: ImageBuffer) {
    const { width, height } = imageBuffer.imageInfo;
    const bitDepth = 8;
    const colorType = COLOR_TYPE.TRUECOLOR;
    const interlaceMethod = INTERLACE_METHOD.NONE;
    const chunk = new IHDRChunk(
      width,
      height,
      bitDepth,
      colorType,
      interlaceMethod
    );
    chunk.write(stream);
  }

  private async writeIDATs(stream: Writable, imageBuffer: ImageBuffer) {
    const idatChunkStream = generateIDATChunks(imageBuffer, FilterType.None);
    await new Promise((resolve, reject) => {
      idatChunkStream.on('error', reject);
      idatChunkStream.on('end', resolve);
      idatChunkStream.pipe(stream, { end: false });
    });
  }
}
