import Ray from '../../../lab1/structures/ray/Ray';
import { Hit } from '../../../lab1/types/Hit';
import { Renderer } from '../../../lab1/types/Renderer';
import { Scene } from '../../../lab1/types/Scene';
import { findCloserHit } from '../../../lab1/utils/findCloserHit';
import { TraceableTransformable } from '../../types/Transformable';

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

  // eslint-disable-next-line sonarjs/cognitive-complexity
  public async render() {
    const { camera, objects } = this.scene;

    await this.onRenderStart?.();

    for (let y = 0; y < camera.verticalResolution; y++) {
      await this.onRowStart?.();
      for (let x = 0; x < camera.horizontailResolution; x++) {
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

        if (this.checkShadow(closestHit)) closestHit = null;

        await this.onHit(closestHit);
      }
      await this.onRowEnd?.();
    }

    await this.onRenderEnd?.();
  }

  public checkShadow(closestHit: Hit | null) {
    if (!closestHit) return false;

    const shadowRay = new Ray(
      closestHit.vertex,
      this.scene.light.vector.multiply(-1)
    );
    for (const object of this.scene.objects) {
      if (object === closestHit.object) continue;
      const shadowHit = object.getIntersection(shadowRay);
      if (shadowHit) return true;
    }
    return false;
  }
}