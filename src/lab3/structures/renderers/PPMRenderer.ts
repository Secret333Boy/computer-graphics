import { Scene } from '../../../lab1/types/Scene';
import { WriterPPM } from '../../../lab2/plugins/ppm/WriterPPM';
import ImageRenderer from './ImageRenderer';

export default class PPMRenderer extends ImageRenderer {
  constructor(scene: Scene, filePath: string) {
    const writerPPM = new WriterPPM();
    super({ scene, filePath, imageWriter: writerPPM });
  }
}
