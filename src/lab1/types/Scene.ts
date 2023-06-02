import { Matrix } from '../../lab3/structures/matrix/matrix';
import {
  TraceableTransformable,
  Transformable,
} from '../../lab3/types/Transformable';
import { Light } from '../../lab4/light/Light';
import Camera from '../structures/camera/Camera';

export class Scene implements Transformable {
  constructor(
    public objects: TraceableTransformable[],
    public camera: Camera,
    public lights: Light[]
  ) {}

  public transform(matrix: Matrix): void {
    for (const object of this.objects) {
      object.transform(matrix);
    }
  }
}
