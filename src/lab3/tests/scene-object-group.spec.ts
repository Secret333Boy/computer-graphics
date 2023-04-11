import Vertex3D from '../../lab1/structures/vertex/Vertex3D';
import { Sphere } from '../../lab1/structures/sphere/Sphere';
import Disk from '../../lab1/structures/disk/Disk';
import Vector3D from '../../lab1/structures/vector/Vector3D';
import { TraceableTransformableGroup } from '../structures/scene-object-group/SceneObjectGroup';

describe('SceneObjectGroup', () => {
  const sphere = new Sphere(new Vertex3D(1, 0, 0), 1);
  const disk = new Disk(new Vertex3D(0, 0, 0), new Vector3D(0, 0, 1), 1);
  const group = new TraceableTransformableGroup([sphere, disk]);

  it('should translate every object in the group', () => {
    const sphereTranslateSpy = jest.spyOn(sphere, 'translate');
    const diskTranslateSpy = jest.spyOn(disk, 'translate');
    group.translate(1, 1, 1);
    expect(sphereTranslateSpy).toHaveBeenCalledWith(1, 1, 1);
    expect(diskTranslateSpy).toHaveBeenCalledWith(1, 1, 1);
  });

  it('should rotate every object in the group', () => {
    const sphereRotateSpy = jest.spyOn(sphere, 'rotate');
    const diskRotateSpy = jest.spyOn(disk, 'rotate');
    group.rotate(1, 1, 1);
    expect(sphereRotateSpy).toHaveBeenCalledWith(1, 1, 1);
    expect(diskRotateSpy).toHaveBeenCalledWith(1, 1, 1);
  });

  it('should scale every object in the group', () => {
    const sphereScaleSpy = jest.spyOn(sphere, 'scale');
    const diskScaleSpy = jest.spyOn(disk, 'scale');
    group.scale(1, 1, 1);
    expect(sphereScaleSpy).toHaveBeenCalledWith(1, 1, 1);
    expect(diskScaleSpy).toHaveBeenCalledWith(1, 1, 1);
  });
});
