import { ImageBuffer } from './ImageBuffer';
import { ImageProcessorsMap } from './ImageProcessorsMap';
import { Readable } from 'stream';

export type StreamInfo = {
  getStream: () => Readable;
  disposeStream: (stream: Readable) => void;
};

export class ImageConvertor {
  public constructor(private readonly processorsMap: ImageProcessorsMap) {}

  public async convert(
    streamInfo: StreamInfo,
    imageType: string
  ): Promise<{ stream: Readable; buffer: ImageBuffer }> {
    const writer = this.processorsMap.writersMap[imageType];
    if (!writer) throw new Error('This output format is not supported');
    let imageBuffer: ImageBuffer | null = null;
    let stream: Readable | null = null;
    for (const reader of this.processorsMap.imageReaders) {
      stream = streamInfo.getStream();
      imageBuffer = await reader.read(stream);
      if (imageBuffer) break;
      else {
        streamInfo.disposeStream(stream);
      }
    }

    if (!imageBuffer) {
      stream && streamInfo.disposeStream(stream);
      throw new Error('This input format is not supported');
    }

    return { stream: writer.write(imageBuffer), buffer: imageBuffer };
  }
}
