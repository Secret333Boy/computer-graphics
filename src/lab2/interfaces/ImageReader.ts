import { ImageBuffer } from '../ImageBuffer';
import { ReadStream } from 'fs';

export interface ImageReader {
  readonly format: string;
  read: (stream: ReadStream) => Promise<ImageBuffer | null>;
}
