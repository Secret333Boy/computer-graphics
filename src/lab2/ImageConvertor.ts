import { ReadStream } from 'fs';
import { ImageBuffer } from './ImageBuffer';
import { ImageReader } from './interfaces/ImageReader';
import { ImageWriter } from './interfaces/ImageWriter';
import { Readable } from 'stream';

export class ImageConvertor {
  private readonly imageReaders: ImageReader[] = [];

  private readonly writersMap: Record<string, ImageWriter> = {
    // "png": ...
  };

  public async convert(stream: Readable, imageType: string): Promise<Readable> {
    const writer = this.writersMap[imageType];
    if (!writer) throw new Error('This output format is not supported');

    let imageBuffer: ImageBuffer | null = null;
    for (const reader of this.imageReaders) {
      imageBuffer = await reader.read(stream);
      if (imageBuffer) break;
    }

    if (!imageBuffer) throw new Error('This input format is not supported');

    return writer.write(imageBuffer);
  }
}
