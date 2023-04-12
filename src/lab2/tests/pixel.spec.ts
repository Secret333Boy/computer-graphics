import { Pixel } from '../interfaces/Pixel';

describe('Pixel interface', () => {
  it('should have the required properties', () => {
    const pixel: Pixel = {
      r: 255,
      g: 0,
      b: 127,
    };
    expect(pixel).toHaveProperty('r');
    expect(pixel).toHaveProperty('g');
    expect(pixel).toHaveProperty('b');
  });

  it('should have the required property types', () => {
    const pixel: Pixel = {
      r: 255,
      g: 0,
      b: 127,
    };
    expect(pixel.r).toEqual(expect.any(Number));
    expect(pixel.g).toEqual(expect.any(Number));
    expect(pixel.b).toEqual(expect.any(Number));
  });
});
