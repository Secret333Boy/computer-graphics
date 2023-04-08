import { Chunk } from './Chunk';

export enum COLOR_TYPE {
  GRAYSCALE = 0,
  TRUECOLOR = 2,
  INDEXED_COLOR = 3,
  GRAYSCALE_WITH_ALPHA = 4,
  TRUECOLOR_WITH_ALPHA = 6,
}

export enum INTERLACE_METHOD {
  NONE = 0,
  ADAM7 = 1,
}

export class IHDRChunk extends Chunk {
  constructor(
    width: number,
    height: number,
    bitDepth: number,
    colorType: number,
    interlaceMethod: number
  ) {
    const data = Buffer.alloc(13);
    data.writeUInt32BE(width, 0);
    data.writeUInt32BE(height, 4);
    data.writeUInt8(bitDepth, 8);
    data.writeUInt8(colorType, 9);
    data.writeUInt8(0, 10);
    data.writeUInt8(0, 11);
    data.writeUInt8(interlaceMethod, 12);
    super('IHDR', data);
  }
}
