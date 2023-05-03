import {
  FilterType,
  filterDecoders,
  filterEncoders,
  prependFilterType,
  removeFilterType,
} from '../plugins/png/lib/chunks/Filter';

describe('Filter', () => {
  it('should correctly prepend filter type', () => {
    const buf = Buffer.from([1, 2, 3, 4, 5]);
    const result = prependFilterType(1, buf);
    expect(result).toEqual(Buffer.from([1, 1, 2, 3, 4, 5]));
  });

  it('should correctly remove filter type', () => {
    const buf = Buffer.from([1, 2, 3, 4, 5]);
    const result = removeFilterType(buf);
    expect(result).toEqual(Buffer.from([2, 3, 4, 5]));
  });

  describe('Encoders', () => {
    it('should correctly encode for None', () => {
      const buf = Buffer.from([1, 2, 3, 4, 5, 6]);
      const result = filterEncoders[FilterType.None](buf, 3, undefined);
      expect(result).toEqual(buf);
    });

    it('should correctly encode for Sub', () => {
      const buf = Buffer.from([1, 2, 3, 4, 5, 6]);
      const result = filterEncoders[FilterType.Sub](buf, 3, undefined);
      expect(result).toEqual(Buffer.from([1, 2, 3, 3, 3, 3]));
    });

    it('should correctly encode for Up', () => {
      const buf = Buffer.from([1, 2, 3, 4, 5, 6]);
      const prevScanline = Buffer.from([1, 2, 3, 4, 5, 6]);
      const result = filterEncoders[FilterType.Up](buf, 3, prevScanline);
      expect(result).toEqual(Buffer.from([0, 0, 0, 0, 0, 0]));
    });

    it('should correctly encode for Average', () => {
      const buf = Buffer.from([1, 2, 3, 4, 5, 6]);
      const prevScanline = Buffer.from([1, 2, 3, 4, 5, 6]);
      const result = filterEncoders[FilterType.Average](buf, 3, prevScanline);
      expect(result).toEqual(Buffer.from([1, 1, 2, 2, 2, 2]));
    });

    it('should correctly encode for Paeth', () => {
      const buf = Buffer.from([1, 2, 3, 4, 5, 6]);
      const prevScanline = Buffer.from([1, 2, 3, 4, 5, 6]);
      const result = filterEncoders[FilterType.Paeth](buf, 3, prevScanline);
      expect(result).toEqual(Buffer.from([0, 0, 0, 0, 0, 0]));
    });
  });

  describe('Decoders', () => {
    it('should correctly decode for None', () => {
      const buf = Buffer.from([1, 2, 3, 4, 5, 6]);
      const result = filterDecoders[FilterType.None](buf, 3, undefined);
      expect(result).toEqual(buf);
    });

    it('should correctly decode for Sub', () => {
      const buf = Buffer.from([1, 2, 3, 3, 3, 3]);
      const result = filterDecoders[FilterType.Sub](buf, 3, undefined);
      expect(result).toEqual(Buffer.from([1, 2, 3, 4, 5, 6]));
    });

    it('should correctly decode for Up', () => {
      const buf = Buffer.from([0, 0, 0, 0, 0, 0]);
      const prevScanline = Buffer.from([1, 2, 3, 4, 5, 6]);
      const result = filterDecoders[FilterType.Up](buf, 3, prevScanline);
      expect(result).toEqual(Buffer.from([1, 2, 3, 4, 5, 6]));
    });

    it('should correctly decode for Average', () => {
      const buf = Buffer.from([1, 1, 2, 2, 2, 2]);
      const prevScanline = Buffer.from([1, 1, 2, 2, 2, 2]);
      const result = filterDecoders[FilterType.Average](buf, 3, prevScanline);
      expect(result).toEqual(Buffer.from([1, 1, 3, 3, 3, 4]));
    });

    it('should correctly decode for Paeth', () => {
      const buf = Buffer.from([0, 0, 0, 0, 0, 0]);
      const prevScanline = Buffer.from([1, 2, 3, 4, 5, 6]);
      const result = filterDecoders[FilterType.Paeth](buf, 3, prevScanline);
      expect(result).toEqual(Buffer.from([1, 2, 3, 4, 5, 6]));
    });
  });
});
