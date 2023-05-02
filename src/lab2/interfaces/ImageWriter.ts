import { Readable } from 'stream';
import { ImageBuffer } from '../ImageBuffer';

export interface ImageWriter {
  readonly format: string;
  write: (imageBuffer: ImageBuffer) => Readable;
}
