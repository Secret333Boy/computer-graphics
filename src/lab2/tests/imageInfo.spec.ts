import { ImageInfo } from '../interfaces/ImageInfo';

describe('ImageInfo', () => {
  const info: ImageInfo = { width: 100, height: 100, maxColor: 255 };

  it('width property is a number', () => {
    expect(typeof info.width).toBe('number');
  });

  it('height property is a number', () => {
    expect(typeof info.height).toBe('number');
  });

  it('maxColor property is a number', () => {
    expect(typeof info.maxColor).toBe('number');
  });
});
