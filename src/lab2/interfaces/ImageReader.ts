import { ImageBuffer } from '../ImageBuffer';
import { ReadStream } from 'fs';
import { ImageFormat } from './ImageFormat';

export interface ImageReader {
  readonly format: ImageFormat;
  read: (stream: ReadStream) => Promise<ImageBuffer | null>;
}
