import { PassThrough } from 'stream';
import { ReaderPNG } from '../plugins/png/ReaderPNG.reader';
import { Pixel } from '../interfaces/Pixel';
import { ImageInfo } from '../interfaces/ImageInfo';

describe('ReaderPNG', () => {
  it('should read a simple PNG image to an Image Buffer', async () => {
    // Arrange
    const imageDataBase64 =
      'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAAklEQVR42v0bdY4AAAAQSURBVGNgYGD4/x+EgQQDACHsBPzqVcqwAAAAAElFTkSuQmCC';
    const reader = new ReaderPNG();
    // convert string to readable stream
    const stream = new PassThrough();
    stream.end(Buffer.from(imageDataBase64, 'base64'));

    // Act
    const imageBuffer = await reader.read(stream);
    const resultPromise = new Promise<Pixel[]>((resolve) => {
      const chunks: Pixel[] = [];
      imageBuffer?.pixels.on('data', (chunk) => {
        chunks.push(chunk);
      });
      imageBuffer?.pixels.on('end', () => {
        resolve(chunks);
      });
    });

    // Assert
    const expectedImageInfo: ImageInfo = {
      width: 2,
      height: 2,
      maxColor: 255,
      hasAlpha: false,
      isGrayscale: false,
    };
    const expectedPixels = [
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 0 },
      { r: 255, g: 255, b: 255 },
      { r: 0, g: 0, b: 0 },
    ];
    expect(imageBuffer).not.toBeNull();
    expect(imageBuffer?.imageInfo).toEqual(expectedImageInfo);
    return expect(resultPromise).resolves.toEqual(expectedPixels);
  });
});
