import { ImageInfo } from './interfaces/ImageInfo';
import { Pixel } from './interfaces/Pixel';

export class ImageBuffer {
  public readonly imageInfo: ImageInfo;
  public readonly pixels: ReadableStream<Pixel>;

  constructor(imageInfo: ImageInfo, pixels: ReadableStream<Pixel>) {
    this.imageInfo = imageInfo;
    this.pixels = pixels;
  }
}
