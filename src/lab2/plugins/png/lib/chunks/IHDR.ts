import { ImageInfo } from '../../../../interfaces/ImageInfo';
import { Chunk } from './Chunk';

export enum COLOR_TYPE {
  GRAYSCALE = 0,
  TRUECOLOR = 2,
  INDEXED_COLOR = 3,
  GRAYSCALE_WITH_ALPHA = 4,
  TRUECOLOR_WITH_ALPHA = 6,
}

const COLOR_TYPE_TO_BPP = {
  [COLOR_TYPE.GRAYSCALE]: 1,
  [COLOR_TYPE.TRUECOLOR]: 3,
  [COLOR_TYPE.INDEXED_COLOR]: 1,
  [COLOR_TYPE.GRAYSCALE_WITH_ALPHA]: 2,
  [COLOR_TYPE.TRUECOLOR_WITH_ALPHA]: 4,
};

export const colorTypeToBpp = (
  colorType: COLOR_TYPE,
  bitDepth: number
): number => {
  return COLOR_TYPE_TO_BPP[colorType] * Math.floor(bitDepth / 8);
};

export const COLOR_TYPE_TO_NAME = {
  [COLOR_TYPE.GRAYSCALE]: 'grayscale',
  [COLOR_TYPE.TRUECOLOR]: 'truecolor',
  [COLOR_TYPE.INDEXED_COLOR]: 'indexed color',
  [COLOR_TYPE.GRAYSCALE_WITH_ALPHA]: 'grayscale with alpha',
  [COLOR_TYPE.TRUECOLOR_WITH_ALPHA]: 'truecolor with alpha',
};

export const imageInfoToColorType = (info: ImageInfo): COLOR_TYPE => {
  if (info.isGrayscale) {
    if (info.hasAlpha) {
      return COLOR_TYPE.GRAYSCALE_WITH_ALPHA;
    } else {
      return COLOR_TYPE.GRAYSCALE;
    }
  } else {
    if (info.hasAlpha) {
      return COLOR_TYPE.TRUECOLOR_WITH_ALPHA;
    } else {
      return COLOR_TYPE.TRUECOLOR;
    }
  }
};

export const imageInfoToBitDepth = (info: ImageInfo): number => {
  if (info.maxColor <= 255) {
    return 8;
  } else {
    return 16;
  }
};

export enum INTERLACE_METHOD {
  NONE = 0,
  ADAM7 = 1,
}

export class IHDRChunk extends Chunk {
  constructor(
    public width: number,
    public height: number,
    public bitDepth: number,
    public colorType: COLOR_TYPE,
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
