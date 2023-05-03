export interface BitmapFileHeader {
  bfType: 'BM';
  bfSize: number;
  bfReserved1: 0;
  bfReserved2: 0;
  bfOffBits: number;
}

export enum BitmapFileInfoSize {
  CORE = 12,
  V3 = 40,
  V4 = 108,
  V5 = 124,
}

export enum Compression {
  BI_RGB,
  BI_RLE8,
  BI_RLE4,
  BI_BITFIELDS,
  BI_JPEG,
  BI_PNG,
  BI_ALPHABITFIELDS,
}

export type BMPBit = 1 | 2 | 4 | 8 | 16 | 24 | 32 | 48 | 64;

export interface CommonBitmapFileInfoCore {
  bcWidth: number;
  bcHeight: number;
  bcPlanes: 1;
  bcBitCount: BMPBit;
}

export interface CommonBitmapFileInfoV3 extends CommonBitmapFileInfoCore {
  biCompression: Compression;
  biSizeImage: number;
  biXPelsPerMeter: number;
  biYPelsPerMeter: number;
  biClrUsed: number;
  biClrImportant: number;
}

export interface CommonBitmapFileInfoV4 extends CommonBitmapFileInfoV3 {
  bV4RedMask: string;
  bV4GreenMask: string;
  bV4BlueMask: string;
  bV4AlphaMask: string;
  bV4CSType: string;
  bV4Endpoints: string;
  bV4GammaRed: string;
  bV4GammaGreen: string;
  bV4GammaBlue: string;
}

export interface CommonBitmapFileInfoV5 extends CommonBitmapFileInfoV4 {
  bV5Intent: string;
  bV5ProfileData: string;
  bV5ProfileSize: string;
  bV5Reserved: string;
}

export interface BitmapFileInfoCore extends CommonBitmapFileInfoCore {
  bcSize: BitmapFileInfoSize.CORE;
}

export interface BitmapFileInfoV3 extends CommonBitmapFileInfoV3 {
  bcSize: BitmapFileInfoSize.V3;
}

export interface BitmapFileInfoV4 extends CommonBitmapFileInfoV4 {
  bcSize: BitmapFileInfoSize.V4;
}

export interface BitmapFileInfoV5 extends CommonBitmapFileInfoV5 {
  bcSize: BitmapFileInfoSize.V5;
}

export type BitmapFileInfo =
  | BitmapFileInfoCore
  | BitmapFileInfoV3
  | BitmapFileInfoV4
  | BitmapFileInfoV5;
