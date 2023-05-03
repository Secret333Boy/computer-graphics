import { Readable } from 'stream';
import { ImageBuffer } from '../ImageBuffer';

export interface ImageReader {
  readonly format: string;
  read: (stream: Readable) => Promise<ImageBuffer | null>;
}
