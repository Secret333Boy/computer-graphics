import Ray from '../../../lab1/structures/ray/Ray';
import { Hit } from '../../../lab1/types/Hit';
import { Renderer } from '../../../lab1/types/Renderer';
import { Scene } from '../../../lab1/types/Scene';
import { findCloserHit } from '../../../lab1/utils/findCloserHit';
import { Matrix } from '../matrix/matrix';

export interface CommonRendererProps {
  scene: Scene;
  onHit: (hit: Hit | null) => Promise<void> | void;
  onRowStart?: () => Promise<void> | void;
  onRowEnd?: () => Promise<void> | void;
  onRenderStart?: () => Promise<void> | void;
  onRenderEnd?: () => Promise<void> | void;
}

export default abstract class CommonRenderer implements Renderer {
  public readonly scene: Scene;
  private readonly onHit: (hit: Hit | null) => Promise<void> | void;
  private readonly onRowStart?: () => Promise<void> | void;
  private readonly onRowEnd?: () => Promise<void> | void;
  private readonly onRenderStart?: () => Promise<void> | void;
  private readonly onRenderEnd?: () => Promise<void> | void;

  constructor(props: CommonRendererProps) {
    const { scene, onHit, onRowStart, onRowEnd, onRenderStart, onRenderEnd } =
      props;

    this.scene = scene;
    this.onHit = onHit;
    this.onRowStart = onRowStart;
    this.onRowEnd = onRowEnd;
    this.onRenderStart = onRenderStart;
    this.onRenderEnd = onRenderEnd;
  }

  public async render(cameraTransformMatrix?: Matrix) {
    const { camera, objects } = this.scene;

    await this.onRenderStart?.();

    for (let y = 0; y < camera.verticalResolution; y++) {
      await this.onRowStart?.();
      for (let x = 0; x < camera.horizontalResolution; x++) {
        const screenPixelVector = camera.getScreenPixelVector(
          x,
          y,
          cameraTransformMatrix
        );
        const ray = new Ray(camera.focalPoint, screenPixelVector);
        let closestHit: Hit | null = null;

        for (const object of objects) {
          const hit = object.getIntersection(ray);

          if (!hit) continue;

          closestHit = closestHit ? findCloserHit(hit, closestHit) : hit;
        }

        await this.onHit(closestHit);
      }
      await this.onRowEnd?.();
    }

    await this.onRenderEnd?.();
  }
}
