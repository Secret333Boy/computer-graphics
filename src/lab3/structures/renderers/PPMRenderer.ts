import { WriteStream } from 'fs';
import { Scene } from '../../../lab1/types/Scene';
import WriterPPM from '../../../lab2/plugins/ppm/WriterPPM.writer';
import ImageRenderer from './ImageRenderer';

export default class PPMRenderer extends ImageRenderer {
  constructor(scene: Scene, writeStream: WriteStream) {
    const writerPPM = new WriterPPM();
    super({ scene, writeStream, imageWriter: writerPPM });
  }
}
