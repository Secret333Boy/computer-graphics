import { ImageBuffer } from './ImageBuffer';
import { ImageProcessorsMap } from './ImageProcessorsMap';
import { Readable } from 'stream';

export class ImageConvertor {
  public constructor(private readonly processorsMap: ImageProcessorsMap) {}

  public async convert(stream: Readable, imageType: string): Promise<Readable> {
    const writer = this.processorsMap.writersMap[imageType];
    if (!writer) throw new Error('This output format is not supported');

    let imageBuffer: ImageBuffer | null = null;
    for (const reader of this.processorsMap.imageReaders) {
      imageBuffer = await reader.read(stream);
      if (imageBuffer) break;
    }

    if (!imageBuffer) throw new Error('This input format is not supported');

    return writer.write(imageBuffer);
  }
}
