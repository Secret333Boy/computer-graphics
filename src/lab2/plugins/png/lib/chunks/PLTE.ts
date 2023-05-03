import { Pixel } from '../../../../interfaces/Pixel';
import { Chunk } from './Chunk';

export class PLTEChunk extends Chunk {
  constructor(colors: Pixel[]) {
    const data = Buffer.alloc(colors.length * 3);
    for (let i = 0; i < colors.length; i++) {
      data.writeUInt8(colors[i].r, i * 3);
      data.writeUInt8(colors[i].g, i * 3 + 1);
      data.writeUInt8(colors[i].b, i * 3 + 2);
    }
    super('PLTE', data);
  }
}
