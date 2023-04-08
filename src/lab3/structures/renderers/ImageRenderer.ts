import { WriteStream } from 'fs';
import { PassThrough } from 'stream';
import { Scene } from '../../../lab1/types/Scene';
import { ImageBuffer } from '../../../lab2/ImageBuffer';
import { ImageWriter } from '../../../lab2/interfaces/ImageWriter';
import CommonRenderer from './CommonRenderer';

export interface ImageRendererProps {
  scene: Scene;
  writeStream: WriteStream;
  imageWriter: ImageWriter;
}

export default abstract class ImageRenderer extends CommonRenderer {
  constructor(props: ImageRendererProps) {
    const { scene, writeStream, imageWriter } = props;

    const pixelsStream = new PassThrough({ objectMode: true });

    const imageBuffer = new ImageBuffer(
      {
        height: scene.camera.vResolution,
        width: scene.camera.hResolution,
        maxColor: 255,
      },
      pixelsStream
    );

    const PPMStream = imageWriter.write(imageBuffer);
    PPMStream.pipe(writeStream);

    super({
      scene,
      onHit: (hit) => {
        if (!hit) {
          pixelsStream.push({ r: 0, g: 0, b: 0 });
          return;
        }

        const dotProduct = hit.normal.vector.dotProduct(
          this.scene.light.vector
        );

        const color = Math.round(dotProduct * -255);

        pixelsStream.push({ r: color, g: color, b: color });
      },
    });
  }
}
