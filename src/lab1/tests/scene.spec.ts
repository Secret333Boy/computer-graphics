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
  const scene = new Scene([sphere, disk], camera, light);

  it('should translate every object in the scene', () => {
    const sphereTranslateSpy = jest.spyOn(sphere, 'translate');
    const diskTranslateSpy = jest.spyOn(disk, 'translate');
    scene.translate(1, 1, 1);
    expect(sphereTranslateSpy).toHaveBeenCalledWith(1, 1, 1);
    expect(diskTranslateSpy).toHaveBeenCalledWith(1, 1, 1);
  });

  it('should rotate every object in the scene', () => {
    const sphereRotateSpy = jest.spyOn(sphere, 'rotate');
    const diskRotateSpy = jest.spyOn(disk, 'rotate');
    scene.rotate(1, 1, 1);
    expect(sphereRotateSpy).toHaveBeenCalledWith(1, 1, 1);
    expect(diskRotateSpy).toHaveBeenCalledWith(1, 1, 1);
  });

  it('should scale every object in the scene', () => {
    const sphereScaleSpy = jest.spyOn(sphere, 'scale');
    const diskScaleSpy = jest.spyOn(disk, 'scale');
    scene.scale(1, 1, 1);
    expect(sphereScaleSpy).toHaveBeenCalledWith(1, 1, 1);
    expect(diskScaleSpy).toHaveBeenCalledWith(1, 1, 1);
  });
});