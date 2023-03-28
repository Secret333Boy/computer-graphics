import { ImageBuffer } from '../ImageBuffer';

export interface ImageWriter {
  readonly format: string;
  write: (imageBuffer: ImageBuffer) => ReadableStream<string>;
}
