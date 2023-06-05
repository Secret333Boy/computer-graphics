import { Boundable } from '../../lab4/types/Boundable';
import Ray from '../structures/ray/Ray';
import { Hit } from './Hit';

export interface Traceable extends Boundable {
  getIntersection: (ray: Ray) => Hit | null;
}
