import Ray from '../../lab1/structures/ray/Ray';
import { Hit } from '../../lab1/types/Hit';
import { Traceable } from '../../lab1/types/Traceable';

export class KDTree implements Traceable {
  getIntersection(ray: Ray): Hit | null {
    throw new Error('Method not implemented.');
  }
}
