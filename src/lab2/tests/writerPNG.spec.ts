import { PassThrough } from 'stream';
import { ImageBuffer } from '../ImageBuffer';
import WriterPNG from '../plugins/png/WriterPNG.writer';

describe('WriterPNG', () => {
  it('should write the image buffer to a PNG stream', () => {
    // Arrange
    const pixels = new PassThrough({ objectMode: true });
    const imageInfo = {
      width: 2,
      height: 2,
      maxColor: 255,
    };
    const imageBuffer = new ImageBuffer(imageInfo, pixels);
    const writer = new WriterPNG();
    const expectedOutputBase64 =
      'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAAklEQVR42v0bdY4AAAAQSURBVGNgYGD4/x+EgQQDACHsBPzqVcqwAAAAAElFTkSuQmCC';
    const expectedResult = Buffer.from(expectedOutputBase64, 'base64');

    pixels.push({ r: 0, g: 0, b: 0 });
    pixels.push({ r: 255, g: 255, b: 0 });
    pixels.push({ r: 255, g: 255, b: 255 });
    pixels.push({ r: 0, g: 0, b: 0 });
    pixels.push(null);

    // Act
    const resultPromise = new Promise<Buffer>((resolve) => {
      const chunks: Buffer[] = [];
      const stream = writer.write(imageBuffer);
      stream.on('data', (chunk) => {
        chunks.push(chunk);
      });
      stream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
    });

    // Assert
    return expect(resultPromise).resolves.toEqual(expectedResult);
  });
});
