import Normal3D from '../structures/normal/Normal';
import Ray from '../structures/ray/Ray';
import Vertex3D from '../structures/vertex/Vertex3D';

export type HitInfo = {
  normal: Normal3D;
  pHit: Vertex3D;
  // number of units from ray origin to intersection point
  t: number;
};

export interface Traceable {
  getIntersection: (ray: Ray) => HitInfo | null;
}
