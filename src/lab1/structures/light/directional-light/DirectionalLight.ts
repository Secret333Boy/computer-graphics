import { GenericTraceableGroup } from '../../../../lab3/structures/traceable-groups/GenericTraceableGroup';
import { Light } from '../../../../lab4/light/Light';
import { Color } from '../../../../lab4/types/Color';
import { Hit } from '../../../types/Hit';
import { Traceable } from '../../../types/Traceable';
import Ray from '../../ray/Ray';
import Vector3D from '../../vector/Vector3D';

export class DirectionalLight implements Light {
  private vector: Vector3D;
  private color: Color;
  private intensity: number;

  constructor(vector: Vector3D, color: Color, intensity: number) {
    this.vector = vector.normalize();
    this.color = color;
    this.intensity = intensity;
  }

  public getAppliedColor(hit: Hit) {
    const dotProduct = hit.normal.vector.dotProduct(this.vector);

    const colorMultiplier = dotProduct < 0 ? 0 : dotProduct;

    return {
      r: hit.color.r * this.color.r * colorMultiplier * this.intensity,

      g: hit.color.g * this.color.g * colorMultiplier * this.intensity,

      b: hit.color.b * this.color.b * colorMultiplier * this.intensity,
    };
  }

  public checkShadow(hit: Hit, traceableGroup: GenericTraceableGroup) {
    if (!hit) return false;
    const shadowRay = new Ray(hit.vertex, this.vector.multiply(-1));
    const shadowHit = traceableGroup.getIntersection(shadowRay, {
      lookForClosest: false,
      avoidPrimitives: [hit.object],
    });
    return Boolean(shadowHit);
  }
}
