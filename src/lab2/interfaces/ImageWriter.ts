import { Readable } from 'stream';
import { ImageBuffer } from '../ImageBuffer';
import { ImageFormat } from './ImageFormat';

export interface ImageWriter {
  readonly format: ImageFormat;
  write: (imageBuffer: ImageBuffer) => Readable;
}
