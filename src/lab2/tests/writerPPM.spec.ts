import { PassThrough } from 'stream';
import { ImageBuffer } from '../ImageBuffer';
import { WriterPPM } from '../plugins/ppm/WriterPPM.writer';
import { Pixel } from '../interfaces/Pixel';

describe('WriterPPM', () => {
  describe('write', () => {
    it('should write the image buffer to a PPM stream', () => {
      // Arrange
      const pixels = new PassThrough({ objectMode: true });
      const imageInfo = {
        width: 2,
        height: 2,
        maxColor: 255,
      };
      const imageBuffer = new ImageBuffer(imageInfo, pixels);
      const writer = new WriterPPM();
      const expectedOutput =
        'P3 2 2 255\n255 0 0\n0 255 0\n0 0 255\n255 255 255\n';
      const expectedResult = Buffer.from(expectedOutput, 'ascii');

      // Act
      pixels.push({ r: 255, g: 0, b: 0 } as Pixel);
      pixels.push({ r: 0, g: 255, b: 0 } as Pixel);
      pixels.push({ r: 0, g: 0, b: 255 } as Pixel);
      pixels.push({ r: 255, g: 255, b: 255 } as Pixel);
      pixels.push(null);

      const resultPromise = new Promise<Buffer>((resolve) => {
        const chunks: Buffer[] = [];
        const stream = writer.write(imageBuffer);
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
      });

      // Assert
      return expect(resultPromise).resolves.toEqual(expectedResult);
    });
  });
});
