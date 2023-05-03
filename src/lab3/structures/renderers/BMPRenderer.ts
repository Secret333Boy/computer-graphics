import { WriteStream } from 'fs';
import { Scene } from '../../../lab1/types/Scene';
import ImageRenderer from './ImageRenderer';
import { WriterBMP } from '../../../lab2/plugins/bmp/bmp.writer';

export default class BMPRenderer extends ImageRenderer {
  constructor(scene: Scene, writeStream: WriteStream) {
    const writerBMP = new WriterBMP();
    super({ scene, writeStream, imageWriter: writerBMP });
  }
}
