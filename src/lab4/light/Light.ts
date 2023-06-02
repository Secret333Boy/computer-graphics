import { Hit } from '../../lab1/types/Hit';
import { TraceableTransformable } from '../../lab3/types/Transformable';

export interface Light {
  applyColor: (hit: Hit) => void;
  checkShadow: (hit: Hit, objects: TraceableTransformable[]) => boolean;
}
