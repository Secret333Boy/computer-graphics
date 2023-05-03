import { Transform } from 'stream';
import { Pixel } from '../../../interfaces/Pixel';

export default class InverseStream extends Transform {
  constructor(width: number, height: number) {
    const lines: Pixel[][] = [];
    let currentLine: Pixel[] = [];

    super({
      transform(chunk: Pixel, _encoding, callback) {
        currentLine.push(chunk);
        if (currentLine.length === width) {
          lines.push(currentLine);
          currentLine = [];
        }

        callback();
      },
      flush(callback) {
        for (let i = lines.length - 1; i >= 0; i--) {
          for (const pixel of lines[i]) {
            this.push(pixel);
          }
        }

        for (let i = 0; i < height - lines.length; i++) {
          for (let i = 0; i < width; i++) {
            this.push({ r: 0, g: 0, b: 0 } as Pixel);
          }
        }

        callback();
      },
      objectMode: true,
    });
  }
}
