import { ImageBuffer } from '../ImageBuffer';
import { Readable } from 'stream';
import { ImageInfo } from '../interfaces/ImageInfo';

describe('ImageBuffer', () => {
  const info: ImageInfo = { width: 100, height: 100, maxColor: 255 };
  const pixels = new Readable();

  it('creates a new instance with the correct properties', () => {
    const imageBuffer = new ImageBuffer(info, pixels);

    expect(imageBuffer).toBeInstanceOf(ImageBuffer);
    expect(imageBuffer.imageInfo).toEqual(info);
    expect(imageBuffer.pixels).toBe(pixels);
  });
});
