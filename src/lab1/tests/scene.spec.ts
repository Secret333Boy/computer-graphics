import { transformations } from '../../lab3/structures/matrix/transformation-factories';
import { DumbTraceableGroup } from '../../lab3/structures/traceable-groups/DumbTraceableGroup';
import { DumbTransformableGroup } from '../../lab3/structures/transformable-groups/DumbTransformableGroup';
import Camera from '../structures/camera/Camera';
import Disk from '../structures/disk/Disk';
import { DirectionalLight } from '../structures/light/directional-light/DirectionalLight';
import { Sphere } from '../structures/sphere/Sphere';
import Vector3D from '../structures/vector/Vector3D';
import Vertex3D from '../structures/vertex/Vertex3D';
import { Scene } from '../types/Scene';

describe('Scene', () => {
  const sphere = new Sphere(new Vertex3D(1, 0, 0), 1);
  const disk = new Disk(new Vertex3D(0, 0, 0), new Vector3D(0, 0, 1), 1);
  const camera = new Camera(
    new Vertex3D(0, 0, 0),
    new Vector3D(0, 0, 1),
    1,
    1,
    1
  );
  const light = new DirectionalLight(new Vector3D(0, 0, 1));
  const scene = new Scene({
    objects: [sphere, disk],
    camera,
    light,
    transformableGroupFactory: (obj) => new DumbTransformableGroup(obj),
  });

  it('should translate every object in the scene', () => {
    const sphereTranslateSpy = jest.spyOn(sphere, 'transform');
    const diskTranslateSpy = jest.spyOn(disk, 'transform');
    const transformation = transformations.translate3d(1, 1, 1);
    scene.transform(transformation);
    expect(sphereTranslateSpy).toHaveBeenCalledWith(transformation);
    expect(diskTranslateSpy).toHaveBeenCalledWith(transformation);
  });

  it('should rotate every object in the scene', () => {
    const sphereRotateSpy = jest.spyOn(sphere, 'transform');
    const diskRotateSpy = jest.spyOn(disk, 'transform');
    const transformation = transformations.rotate3d(1, 1, 1);
    scene.transform(transformation);
    expect(sphereRotateSpy).toHaveBeenCalledWith(transformation);
    expect(diskRotateSpy).toHaveBeenCalledWith(transformation);
  });

  it('should scale every object in the scene', () => {
    const sphereScaleSpy = jest.spyOn(sphere, 'transform');
    const diskScaleSpy = jest.spyOn(disk, 'transform');
    const transformation = transformations.scale3d(1, 1, 1);
    scene.transform(transformation);
    expect(sphereScaleSpy).toHaveBeenCalledWith(transformation);
    expect(diskScaleSpy).toHaveBeenCalledWith(transformation);
  });
});
