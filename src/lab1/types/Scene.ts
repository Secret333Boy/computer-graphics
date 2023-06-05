import { Matrix } from '../../lab3/structures/matrix/matrix';
import { TransformableGroupFactory } from '../../lab3/structures/transformable-groups/GenericTransformableGroup';
import { Transformable } from '../../lab3/types/Transformable';
import Camera from '../structures/camera/Camera';
import { DirectionalLight } from '../structures/light/directional-light/DirectionalLight';
import { Traceable } from './Traceable';
export type SceneParams = {
  objects: (Traceable & Transformable)[];
  camera: Camera;
  light: DirectionalLight;
  transformableGroupFactory: TransformableGroupFactory<Transformable>;
};

// Scene is not Traceable, it's just a container!
// otherwise, it will have to implement logic for tracing - the renderer's job
export class Scene implements Transformable {
  public camera: Camera;
  public light: DirectionalLight;
  public objects: (Traceable & Transformable)[];
  private transformableGroup: Transformable;

  constructor({
    camera,
    light,
    objects,
    transformableGroupFactory,
  }: SceneParams) {
    this.camera = camera;
    this.light = light;
    this.objects = objects;
    this.transformableGroup = transformableGroupFactory(objects);
  }

  public transform(matrix: Matrix): void {
    this.transformableGroup.transform(matrix);
  }
}
