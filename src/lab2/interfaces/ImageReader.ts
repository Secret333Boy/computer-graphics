import { Readable } from 'stream';
import { ImageBuffer } from '../ImageBuffer';
import { ReadStream } from 'fs';

export interface ImageReader {
  readonly format: string;
  read: (stream: Readable) => Promise<ImageBuffer | null>;
}
