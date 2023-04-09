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
    public width: number,
    public height: number,
    public bitDepth: number,
    public colorType: number,
    public interlaceMethod: number,
    buffer?: Buffer,
    crc?: number
  ) {
    const data = buffer || Buffer.alloc(13);
    if (!buffer) {
      data.writeUInt32BE(width, 0);
      data.writeUInt32BE(height, 4);
      data.writeUInt8(bitDepth, 8);
      data.writeUInt8(colorType, 9);
      data.writeUInt8(0, 10);
      data.writeUInt8(0, 11);
      data.writeUInt8(interlaceMethod, 12);
    }
    super('IHDR', data, data.length, crc);
  }

  public static fromChunk(chunk: Chunk): IHDRChunk {
    if (chunk.type !== 'IHDR') {
      throw new Error('Not an IHDR chunk');
    }
    const width = chunk.data.readUInt32BE(0);
    const height = chunk.data.readUInt32BE(4);
    const bitDepth = chunk.data.readUInt8(8);
    const colorType = chunk.data.readUInt8(9);
    const interlaceMethod = chunk.data.readUInt8(12);
    return new IHDRChunk(
      width,
      height,
      bitDepth,
      colorType,
      interlaceMethod,
      chunk.data
    );
  }
}
