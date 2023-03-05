import Normal3D from '../normal/Normal';
import Vector3D from '../vector/Vector3D';
import Vertex3D from '../vertex/Vertex3D';

export default class Plane {
  public readonly normal: Normal3D;
  public readonly point: Vertex3D;

  constructor(vector: Vector3D, point: Vertex3D) {
    this.normal = new Normal3D(vector);
    this.point = point;
  }
}
