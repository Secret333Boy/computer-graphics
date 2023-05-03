import { Readable } from 'stream';
import { ImageBuffer } from '../ImageBuffer';
import { ImageFormat } from './ImageFormat';

export interface ImageReader {
  readonly format: string;
  read: (stream: Readable) => Promise<ImageBuffer | null>;
}
