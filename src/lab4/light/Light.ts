import { Hit } from '../../lab1/types/Hit';
import { GenericTraceableGroup } from '../../lab3/structures/traceable-groups/GenericTraceableGroup';
import { Color } from '../types/Color';

export interface Light {
  getAppliedColor: (hit: Hit) => Color;
  checkShadow: (hit: Hit, traceableGroup: GenericTraceableGroup) => boolean;
}
