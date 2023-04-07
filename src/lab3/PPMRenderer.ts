import { createWriteStream } from 'fs';
import { Renderer } from '../lab1/types/Renderer';
import { Scene } from '../lab1/types/Scene';
import { WriterPPM } from '../lab2/plugins/ppm/WriterPPM';
import path from 'path';
import { ImageBuffer } from '../lab2/ImageBuffer';
import { PassThrough } from 'stream';
import Ray from '../lab1/structures/ray/Ray';
import { Hit } from '../lab1/types/Hit';
import { findCloserHit } from '../lab1/utils/findCloserHit';
import { Pixel } from '../lab2/interfaces/Pixel';

export default class PPMRenderer implements Renderer {
  private writerPPM = new WriterPPM();

  constructor(public readonly scene: Scene, private filePath: string) {}

  public render() {
    const { camera, objects } = this.scene;

    const writeStream = createWriteStream(
      path.resolve(__dirname, this.filePath)
    );

    const pixelsStream = new PassThrough({ objectMode: true });

    const imageBuffer = new ImageBuffer(
      {
        height: camera.vResolution,
        width: camera.hResolution,
        maxColor: 255,
      },
      pixelsStream
    );

    const PPMStream = this.writerPPM.write(imageBuffer);
    PPMStream.pipe(writeStream);

    for (let y = 0; y < camera.vResolution; y++) {
      for (let x = 0; x < camera.hResolution; x++) {
        const screenPixelPosition = camera.getScreenPixelCoordinates(x, y);
        const ray = new Ray(
          camera.focalPoint,
          screenPixelPosition.toVector().subtract(camera.focalPoint.toVector())
        );
        let closestHit: Hit | null = null;

        for (const object of objects) {
          const hit = object.getIntersection(ray);

          if (!hit) continue;

          closestHit = closestHit ? findCloserHit(hit, closestHit) : hit;
        }

        const pixel = this.handleHit(closestHit);

        pixelsStream.push(pixel);
      }
    }
  }

  private handleHit(hit: Hit | null): Pixel {
    if (!hit) return { r: 0, g: 0, b: 0 };

    const dotProduct = hit.normal.vector.dotProduct(this.scene.light.vector);

    const color = Math.round(dotProduct * -255);

    return { r: color, g: color, b: color };
  }
}
