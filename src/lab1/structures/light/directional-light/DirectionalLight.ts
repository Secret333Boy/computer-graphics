import { TraceableTransformable } from '../../../../lab3/types/Transformable';
import { Color } from '../../../../lab4/light/Color';
import { Light } from '../../../../lab4/light/Light';
import { Hit } from '../../../types/Hit';
import Ray from '../../ray/Ray';
import Vector3D from '../../vector/Vector3D';

export class DirectionalLight implements Light {
  private vector: Vector3D;
  private color: Color;

  constructor(vector: Vector3D, color: Color) {
    this.vector = vector.normalize();
    this.color = color;
  }

  public applyColor(hit: Hit) {
    const dotProduct = hit.normal.vector.dotProduct(this.vector);

    const colorMultiplier = dotProduct < 0 ? 0 : dotProduct;

    hit.color = {
      r: (hit.color.r * (this.color.r * colorMultiplier)) / 255,
      g: (hit.color.g * (this.color.g * colorMultiplier)) / 255,
      b: (hit.color.b * (this.color.b * colorMultiplier)) / 255,
    };
  }

  public checkShadow(hit: Hit, objects: TraceableTransformable[]) {
    if (!hit) return false;

    const shadowRay = new Ray(hit.vertex, this.vector.multiply(-1));
    for (const object of objects) {
      if (object === hit.object) continue;
      const shadowHit = object.getIntersection(shadowRay);
      if (shadowHit) return true;
    }
    return false;
  }
}
