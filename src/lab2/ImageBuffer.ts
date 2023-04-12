import { ImageInfo } from './interfaces/ImageInfo';
import { Readable } from 'stream';

export class ImageBuffer {
  public readonly imageInfo: ImageInfo;
  public readonly pixels: Readable;

  constructor(imageInfo: ImageInfo, pixels: Readable) {
    this.imageInfo = imageInfo;
    this.pixels = pixels;
  }
}
