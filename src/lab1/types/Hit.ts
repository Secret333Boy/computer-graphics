import Normal3D from '../structures/normal/Normal';
import Vertex3D from '../structures/vertex/Vertex3D';
import { Traceable } from './Traceable';

export interface Hit {
  normal: Normal3D;
  vertex: Vertex3D;
  t: number;
  object: Traceable;
}
