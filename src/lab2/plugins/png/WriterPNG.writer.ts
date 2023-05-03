import { PassThrough, Writable } from 'stream';
import { ImageBuffer } from '../../ImageBuffer';
import { ImageWriter } from '../../interfaces/ImageWriter';
import {
  IHDRChunk,
  INTERLACE_METHOD,
  colorTypeToBpp,
  imageInfoToBitDepth,
  imageInfoToColorType,
} from './lib/chunks/IHDR';
import { generateIDATChunks } from './lib/chunks/IDAT';
import { FilterType } from './lib/chunks/Filter';
import { IENDChunk } from './lib/chunks/IEND';
import { magic } from './lib/chunks/Magic';
import { ImageFormat } from '../../interfaces/ImageFormat';

export class WriterPNG implements ImageWriter {
  public readonly format = ImageFormat.PNG;
  write(imageBuffer: ImageBuffer) {
    const stream = new PassThrough();
    this.writeHeader(stream);
    this.writeIHDR(stream, imageBuffer);
    this.writeIDATs(stream, imageBuffer)
      .then(() => {
        this.writeIEND(stream);
        stream.end();
      })
      .catch((err) => {
        throw err;
      });
    return stream;
  }

  private writeHeader(stream: Writable) {
    stream.write(magic);
  }

  private writeIHDR(stream: Writable, imageBuffer: ImageBuffer) {
    const { width, height } = imageBuffer.imageInfo;
    const bitDepth = imageInfoToBitDepth(imageBuffer.imageInfo);
    const colorType = imageInfoToColorType(imageBuffer.imageInfo);
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

  private async writeIDATs(
    stream: Writable,
    imageBuffer: ImageBuffer
  ): Promise<void> {
    const idatChunkStream = generateIDATChunks(
      imageBuffer,
      FilterType.None,
      colorTypeToBpp(
        imageInfoToColorType(imageBuffer.imageInfo),
        imageInfoToBitDepth(imageBuffer.imageInfo)
      )
    );
    return new Promise((resolve, reject) => {
      idatChunkStream.on('end', () => {
        resolve();
      });
      idatChunkStream.on('error', (err) => reject(err));
      idatChunkStream.pipe(stream, {
        end: false,
      });
    });
  }

  private writeIEND(stream: Writable) {
    const chunk = new IENDChunk();
    chunk.write(stream);
  }
}

export default new WriterPNG();
