import { ImageBuffer } from '../../ImageBuffer';
import { ImageFormat } from '../../interfaces/ImageFormat';
import { ImageReader } from '../../interfaces/ImageReader';
import { PassThrough, Readable } from 'stream';

export class ReaderPPM implements ImageReader {
  public readonly format = ImageFormat.PPM;

  public async read(stream: Readable): Promise<ImageBuffer | null> {
    try {
      const data = await new Promise<string>((resolve, reject) => {
        let buffer = '';
        stream.on('data', (chunk) => (buffer += chunk));
        stream.on('end', () => resolve(buffer));
        stream.on('error', reject);
      });

      const lines = data.trim().split('\n');
      const header = lines[0].trim().split(/\s+/);
      if (header[0].trim() !== 'P3') {
        throw new Error('Invalid PPM file format');
      }
      const maxColor = parseInt(header[3]);

      const pixels = lines.slice(1).flatMap((line) => {
        return line
          .trim()
          .split(/\s+/)
          .map((val) => parseInt(val));
      });

      const imageInfo = {
        width: parseInt(header[1]),
        height: parseInt(header[2]),
        maxColor,
      };

      const pixelStream = new PassThrough({ objectMode: true });

      const pixelObjects = Array.from(
        { length: pixels.length / 3 },
        (_, i) => ({
          r: pixels[i * 3],
          g: pixels[i * 3 + 1],
          b: pixels[i * 3 + 2],
        })
      );

      for (const pixel of pixelObjects) {
        pixelStream.push(pixel);
      }

      pixelStream.push(null);

      return new ImageBuffer(imageInfo, pixelStream);
    } catch (e) {
      console.error('Unable to read PPM: ' + e);
      return null;
    }
  }
}

export default new ReaderPPM();
