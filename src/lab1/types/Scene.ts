import { Matrix } from '../../lab3/structures/matrix/matrix';
import { TraceableGroupFactory } from '../../lab3/structures/traceable-groups/GenericTraceableGroup';
import { TransformableGroupFactory } from '../../lab3/structures/transformable-groups/GenericTransformableGroup';
import { Transformable } from '../../lab3/types/Transformable';
import { Bounds3D } from '../../lab4/structures/Bounds';
import Camera from '../structures/camera/Camera';
import { DirectionalLight } from '../structures/light/directional-light/DirectionalLight';
import Ray from '../structures/ray/Ray';
import { Hit } from './Hit';
import { Traceable } from './Traceable';
export type SceneParams = {
  objects: (Traceable & Transformable)[];
  camera: Camera;
  light: DirectionalLight;
  traceableGroupFactory: TraceableGroupFactory<Traceable>;
  transformableGroupFactory: TransformableGroupFactory<Transformable>;
};
export class Scene implements Traceable, Transformable {
  private traceableGroup: Traceable;
  private transformableGroup: Transformable;
  public camera: Camera;
  public light: DirectionalLight;
  constructor({
    camera,
    light,
    objects,
    traceableGroupFactory,
    transformableGroupFactory,
  }: SceneParams) {
    this.camera = camera;
    this.light = light;
    this.traceableGroup = traceableGroupFactory(objects);
    this.transformableGroup = transformableGroupFactory(objects);
  }

  public getWorldBounds(): Bounds3D {
    return this.traceableGroup.getWorldBounds();
  }

  public getIntersection(ray: Ray): Hit | null {
    return this.traceableGroup.getIntersection(ray);
  }
  public transform(matrix: Matrix): void {
    this.transformableGroup.transform(matrix);
  }
}
