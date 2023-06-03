import { WriteStream } from 'fs';
import { PassThrough } from 'stream';
import { Scene } from '../../../lab1/types/Scene';
import { ImageBuffer } from '../../../lab2/ImageBuffer';
import { ImageWriter } from '../../../lab2/interfaces/ImageWriter';
import CommonRenderer from './CommonRenderer';
import { Color } from '../../../lab4/types/Color';

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

        const appliedColors: Color[] = [];
        for (const light of scene.lights) {
          if (light.checkShadow(hit, scene.objects)) continue;

          appliedColors.push(light.getAppliedColor(hit));
        }

        if (appliedColors.length === 0) {
          hit.color = { r: 0, g: 0, b: 0 };
        } else {
          hit.color = appliedColors.reduce((acc, color) => ({
            r: acc.r + color.r,
            g: acc.g + color.g,
            b: acc.b + color.b,
          }));
        }

        pixelsStream.push({
          r: hit.color.r > 1 ? 255 : Math.round(hit.color.r * 255),
          g: hit.color.g > 1 ? 255 : Math.round(hit.color.g * 255),
          b: hit.color.b > 1 ? 255 : Math.round(hit.color.b * 255),
        });
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
