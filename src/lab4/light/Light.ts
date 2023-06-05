import { Hit } from '../../lab1/types/Hit';
import { Traceable } from '../../lab1/types/Traceable';
import { Color } from '../types/Color';

export interface Light {
  getAppliedColor: (hit: Hit) => Color;
  checkShadow: (hit: Hit, objects: Traceable[]) => boolean;
}
