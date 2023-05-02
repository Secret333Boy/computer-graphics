import { Matrix } from '../../lab3/structures/matrix/matrix';
import {
  TraceableTransformable,
  Transformable,
} from '../../lab3/types/Transformable';
import Camera from '../structures/camera/Camera';
import { DirectionalLight } from '../structures/light/directional-light/DirectionalLight';

export class Scene implements Transformable {
  constructor(
    public objects: TraceableTransformable[],
    public camera: Camera,
    public light: DirectionalLight
  ) {}

  public transform(matrix: Matrix): void {
    for (const object of this.objects) {
      object.transform(matrix);
    }
  }
}
