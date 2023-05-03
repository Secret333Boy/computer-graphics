import { Readable } from 'stream';
import { ImageBuffer } from '../ImageBuffer';
import { ImageFormat } from './ImageFormat';

export interface ImageReader {
  readonly format: ImageFormat;
  read: (stream: Readable) => Promise<ImageBuffer | null>;
}
