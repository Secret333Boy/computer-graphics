export type Filter = (
  data: Buffer,
  bpp: number,
  prevScanline?: Buffer
) => Buffer;
export type FilterDecoder = Filter;
export enum FilterType {
  None = 0,
  Sub = 1,
  Up = 2,
  Average = 3,
  Paeth = 4,
}

export const prependFilterType = (
  filterType: FilterType,
  data: Buffer
): Buffer => {
  const result = Buffer.alloc(data.length + 1);
  result[0] = filterType;
  data.copy(result, 1);
  return result;
};

export const filterEncoders: Record<FilterType, Filter> = {
  [FilterType.None]: (data) => data,
  [FilterType.Sub]: (data, bpp) => {
    const result = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i++) {
      if (i < bpp) {
        result[i] = data[i];
      } else {
        result[i] = (data[i] - data[i - bpp]) % 256;
      }
    }
    return result;
  },
  [FilterType.Up]: (data, _bpp, prevScanline) => {
    const result = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i++) {
      if (prevScanline) {
        result[i] = (data[i] - prevScanline[i]) % 256;
      } else {
        result[i] = data[i];
      }
    }
    return result;
  },
  [FilterType.Average]: (data, bpp, prevScanline) => {
    const result = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i++) {
      const left = i < bpp ? 0 : data[i - bpp];
      const up = prevScanline ? prevScanline[i] : 0;
      result[i] = (data[i] - Math.floor((left + up) / 2)) % 256;
    }
    return result;
  },
  [FilterType.Paeth]: (data, bpp, prevScanline) => {
    const result = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i++) {
      const left = i < bpp ? 0 : data[i - bpp];
      const up = prevScanline ? prevScanline[i] : 0;
      const upLeft = prevScanline && i >= bpp ? prevScanline[i - bpp] : 0;
      const p = paethPredictor(left, up, upLeft);
      result[i] = (data[i] - p) % 256;
    }
    return result;
  },
};

export const filterDecoders: Record<FilterType, FilterDecoder> = {
  [FilterType.None]: (data) => data,
  [FilterType.Sub]: (data, bpp) => {
    const result = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i++) {
      if (i < bpp) {
        result[i] = data[i];
      } else {
        result[i] = (data[i] + result[i - bpp]) % 256;
      }
    }
    return result;
  },
  [FilterType.Up]: (data, _bpp, prevScanline) => {
    const result = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i++) {
      if (prevScanline) {
        result[i] = (data[i] + prevScanline[i]) % 256;
      } else {
        result[i] = data[i];
      }
    }
    return result;
  },
  [FilterType.Average]: (data, bpp, prevScanline) => {
    const result = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i++) {
      const left = i < bpp ? 0 : result[i - bpp];
      const up = prevScanline ? prevScanline[i] : 0;
      result[i] = (data[i] + Math.floor((left + up) / 2)) % 256;
    }
    return result;
  },
  [FilterType.Paeth]: (data, bpp, prevScanline) => {
    const result = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i++) {
      const left = i < bpp ? 0 : result[i - bpp];
      const up = prevScanline ? prevScanline[i] : 0;
      const upLeft = prevScanline && i >= bpp ? prevScanline[i - bpp] : 0;
      const p = paethPredictor(left, up, upLeft);
      result[i] = (data[i] + p) % 256;
    }
    return result;
  },
};

const paethPredictor = (a: number, b: number, c: number) => {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) {
    return a;
  } else if (pb <= pc) {
    return b;
  } else {
    return c;
  }
};
