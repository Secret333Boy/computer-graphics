import Ray from '../structures/ray/Ray';
import { Hit } from './Hit';

export interface Traceable {
  getIntersection: (ray: Ray) => Hit | null;
}
