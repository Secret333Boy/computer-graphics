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
  private linesRendered = 0;
  constructor(props: ImageRendererProps) {
    const { scene, writeStream, imageWriter } = props;

    const pixelsStream = new PassThrough({ objectMode: true });

    const imageBuffer = new ImageBuffer(
      {
        height: scene.camera.verticalResolution,
        width: scene.camera.horizontalResolution,
        maxColor: 255,
      },
      pixelsStream
    );

    const stream = imageWriter.write(imageBuffer);
    stream.pipe(writeStream);

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

        const color = dotProduct < 0 ? 0 : Math.round(dotProduct * 255);

        pixelsStream.push({ r: color, g: color, b: color });
      },
      onRenderStart: () => {
        console.log('Rendering started');
        this.linesRendered = 0;
      },
      onRowEnd: () => {
        this.linesRendered++;
        if (this.linesRendered % 10 === 0) {
          console.log(`Rendered ${this.linesRendered} lines`);
        }
      },
      onRenderEnd: () => {
        pixelsStream.end();
      },
    });
  }
}
