import Vector3D from '../../lab1/structures/vector/Vector3D';
import Vertex3D from '../../lab1/structures/vertex/Vertex3D';
import { Hit } from '../../lab1/types/Hit';
import { TraceableTransformable } from '../../lab3/types/Transformable';
import { Color } from '../types/Color';
import { Light } from './Light';

export default class EnvironmentLight implements Light {
  constructor(
    private color: Color,
    private intensity: number,
    private samplesCount: number = 1
  ) {}

  private getSphereRandomVectorAtVertex(vertex: Vertex3D) {
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.random() * Math.PI;

    const x = Math.sin(phi) * Math.cos(theta);
    const y = Math.sin(phi) * Math.sin(theta);
    const z = Math.cos(phi);

    return vertex
      .toVector()
      .subtract(new Vector3D(vertex.x + x, vertex.y + y, vertex.z + z));
  }

  public getAppliedColor(hit: Hit) {
    const hitVertex = hit.vertex;

    const samples = [];

    for (let i = 0; i < this.samplesCount; i++) {
      const vector = this.getSphereRandomVectorAtVertex(hitVertex);

      const dotProduct = hit.normal.vector.dotProduct(vector);

      const colorMultiplier = dotProduct < 0 ? 0 : dotProduct;

      samples.push({
        r: hit.color.r * this.color.r * colorMultiplier * this.intensity,

        g: hit.color.g * this.color.g * colorMultiplier * this.intensity,

        b: hit.color.b * this.color.b * colorMultiplier * this.intensity,
      });
    }

    const colorSum = samples.reduce((acc, el) => ({
      r: acc.r + el.r,
      g: acc.g + el.g,
      b: acc.b + el.b,
    }));

    return {
      r: colorSum.r / this.samplesCount,
      g: colorSum.g / this.samplesCount,
      b: colorSum.b / this.samplesCount,
    };
  }

  public checkShadow() {
    return false;
  }
}
