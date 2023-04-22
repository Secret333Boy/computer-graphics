import { Readable } from 'stream';
import { ImageBuffer } from '../../ImageBuffer';
import { ImageWriter } from '../../interfaces/ImageWriter';
import { ImageFormat } from '../../interfaces/ImageFormat';

export default class WriterBMP implements ImageWriter {
  public readonly format = ImageFormat.BMP;
  public write(imageBuffer: ImageBuffer): Readable {
    return new Readable();
  }
}
