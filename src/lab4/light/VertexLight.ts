import Ray from '../../lab1/structures/ray/Ray';
import Vertex3D from '../../lab1/structures/vertex/Vertex3D';
import { Hit } from '../../lab1/types/Hit';
import { GenericTraceableGroup } from '../../lab3/structures/traceable-groups/GenericTraceableGroup';
import { Color } from '../types/Color';
import { Light } from './Light';

export default class VertexLight implements Light {
  private vertex: Vertex3D;
  private color: Color;
  private intensity: number;

  constructor(vertex: Vertex3D, color: Color, intensity: number) {
    this.vertex = vertex;
    this.color = color;
    this.intensity = intensity;
  }

  public getAppliedColor(hit: Hit): Color {
    const vector = hit.vertex.toVector().subtract(this.vertex.toVector());

    const d = vector.length;

    const dotProduct = hit.normal.vector.dotProduct(vector);

    const colorMultiplier = dotProduct < 0 ? 0 : dotProduct;

    return {
      r:
        (hit.color.r * this.color.r * colorMultiplier * this.intensity) /
        (d * d),

      g:
        (hit.color.g * this.color.g * colorMultiplier * this.intensity) /
        (d * d),

      b:
        (hit.color.b * this.color.b * colorMultiplier * this.intensity) /
        (d * d),
    };
  }

  public checkShadow(hit: Hit, traceableGroup: GenericTraceableGroup) {
    if (!hit) return false;
    const baseVector = this.vertex.toVector().subtract(hit.vertex.toVector());
    const shadowRay = new Ray(
      hit.vertex
        .toVector()
        .add(baseVector.normalize().multiply(0.0000000001))
        .toVertex3D(),
      baseVector
    );
    const shadowHit = traceableGroup.getIntersection(shadowRay);
    return Boolean(shadowHit);
  }
}
