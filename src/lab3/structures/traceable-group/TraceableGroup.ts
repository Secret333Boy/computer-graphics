import Ray from '../../../lab1/structures/ray/Ray';
import { Hit } from '../../../lab1/types/Hit';
import { Traceable } from '../../../lab1/types/Traceable';
import { findCloserHit } from '../../../lab1/utils/findCloserHit';
import { SceneObject } from '../../types/Transformable';

export default class TraceableGroup<T extends Traceable> implements Traceable {
  constructor(protected traceableObjects: T[] = []) {}

  public getIntersection(ray: Ray): Hit | null {
    let closestHit: Hit | null = null;
    for (const traceableObject of this.traceableObjects) {
      const currentHit = traceableObject.getIntersection(ray);

      if (!currentHit) continue;

      closestHit = closestHit
        ? findCloserHit(currentHit, closestHit)
        : currentHit;
    }

    return closestHit;
  }
}

export class SceneObjectGroup<T extends SceneObject>
  extends TraceableGroup<T>
  implements SceneObject
{
  translate(x: number, y: number, z: number): void {
    for (const traceableObject of this.traceableObjects) {
      traceableObject.translate(x, y, z);
    }
  }
  rotate(angleX: number, angleY: number, angleZ: number): void {
    for (const traceableObject of this.traceableObjects) {
      traceableObject.rotate(angleX, angleY, angleZ);
    }
  }
  scale(x: number, y: number, z: number): void {
    for (const traceableObject of this.traceableObjects) {
      traceableObject.scale(x, y, z);
    }
  }
}
