import { Bounds3D } from '../structures/Bounds';

export interface Boundable {
  getWorldBounds: () => Bounds3D;
}
