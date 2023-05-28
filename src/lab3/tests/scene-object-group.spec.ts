import Vertex3D from '../../lab1/structures/vertex/Vertex3D';
import { Sphere } from '../../lab1/structures/sphere/Sphere';
import Disk from '../../lab1/structures/disk/Disk';
import Vector3D from '../../lab1/structures/vector/Vector3D';
import { TraceableTransformableGroup } from '../structures/scene-object-group/SceneObjectGroup';
import { transformations } from '../structures/matrix/transformation-factories';
import { DumbTraceableGroup } from '../structures/traceable-group/TraceableGroup';

describe('SceneObjectGroup', () => {
  const sphere = new Sphere(new Vertex3D(1, 0, 0), 1);
  const disk = new Disk(new Vertex3D(0, 0, 0), new Vector3D(0, 0, 1), 1);
  const group = new TraceableTransformableGroup(
    new DumbTraceableGroup([sphere, disk])
  );

  it('should translate every object in the scene', () => {
    const sphereTranslateSpy = jest.spyOn(sphere, 'transform');
    const diskTranslateSpy = jest.spyOn(disk, 'transform');
    const transformation = transformations.translate3d(1, 1, 1);
    group.transform(transformation);
    expect(sphereTranslateSpy).toHaveBeenCalledWith(transformation);
    expect(diskTranslateSpy).toHaveBeenCalledWith(transformation);
  });

  it('should rotate every object in the scene', () => {
    const sphereRotateSpy = jest.spyOn(sphere, 'transform');
    const diskRotateSpy = jest.spyOn(disk, 'transform');
    const transformation = transformations.rotate3d(1, 1, 1);
    group.transform(transformation);
    expect(sphereRotateSpy).toHaveBeenCalledWith(transformation);
    expect(diskRotateSpy).toHaveBeenCalledWith(transformation);
  });

  it('should scale every object in the scene', () => {
    const sphereScaleSpy = jest.spyOn(sphere, 'transform');
    const diskScaleSpy = jest.spyOn(disk, 'transform');
    const transformation = transformations.scale3d(1, 1, 1);
    group.transform(transformation);
    expect(sphereScaleSpy).toHaveBeenCalledWith(transformation);
    expect(diskScaleSpy).toHaveBeenCalledWith(transformation);
  });
});
