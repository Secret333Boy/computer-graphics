import { ImageReader } from './interfaces/ImageReader';
import { ImageWriter } from './interfaces/ImageWriter';

export class ImageProcessorsMap {
  public imageReaders: ImageReader[] = [];

  public writersMap: Record<string, ImageWriter> = {
    // "png": ...
  };

  public fillMaps(imageReaders: ImageReader[], imageWrites: ImageWriter[]) {
    this.imageReaders = imageReaders;
    this.writersMap = imageWrites.reduce<Record<string, ImageWriter>>(
      (acc, writer) => {
        acc[writer.format] = writer;
        return acc;
      },
      {}
    );
  }
}
