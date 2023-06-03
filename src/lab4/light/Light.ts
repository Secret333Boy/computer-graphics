import { Hit } from '../../lab1/types/Hit';
import { TraceableTransformable } from '../../lab3/types/Transformable';
import { Color } from '../types/Color';

export interface Light {
  getAppliedColor: (hit: Hit) => Color;
  checkShadow: (hit: Hit, objects: TraceableTransformable[]) => boolean;
}
