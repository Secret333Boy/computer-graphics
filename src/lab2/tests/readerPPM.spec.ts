import path from 'path';
import { ReaderPPM } from '../../lab2/plugins/ppm/ReaderPPM';
import { ReadStream, createReadStream } from 'fs';

describe('Reader PPM', () => {
  it('should read PPM image file and return header one', async () => {
    const ppmFilePath = path.resolve(__dirname, 'test.ppm');
    const reader = new ReaderPPM();
    const stream = createReadStream(ppmFilePath) as ReadStream;

    const imageBuffer = await reader.read(stream);
    if (imageBuffer !== null) {
      expect(imageBuffer.imageInfo).toEqual({
        width: 2,
        height: 2,
        maxColor: 255,
      });
    }
  });

  it('should read PPM image file and return header two', async () => {
    const ppmFilePath = path.resolve(__dirname, 'test2.ppm');
    const reader = new ReaderPPM();
    const stream = createReadStream(ppmFilePath) as ReadStream;

    const imageBuffer = await reader.read(stream);
    if (imageBuffer !== null) {
      expect(imageBuffer.imageInfo).toEqual({
        width: 4,
        height: 5,
        maxColor: 255,
      });
    }
  });
});
