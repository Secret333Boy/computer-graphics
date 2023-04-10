import { Traceable } from '../types/Traceable';
import { Scene } from '../types/Scene';
import ConsoleRenderer from '../ConsoleRenderer';
import Camera from '../structures/camera/Camera';
import Vertex3D from '../structures/vertex/Vertex3D';
import Vector3D from '../structures/vector/Vector3D';
import { DirectionalLight } from '../structures/light/directional-light/DirectionalLight';
import { Sphere } from '../structures/sphere/Sphere';
import { TraceableTransformable } from '../../lab3/types/Transformable';

describe('ConsoleRenderer', () => {
  let scene: Scene;
  let renderer: ConsoleRenderer;
  let camera: Camera;

  beforeEach(() => {
    const objects: TraceableTransformable[] = [
      new Sphere(new Vertex3D(0, 0, 0), 1),
    ];
    camera = new Camera(
      new Vertex3D(0, 0, -2),
      new Vector3D(0, 0, 1),
      Math.PI / 3,
      50,
      50
    );
    const light = new DirectionalLight(new Vector3D(1, 0, 0));
    scene = new Scene(objects, camera, light);
    renderer = new ConsoleRenderer(scene);
  });

  it('should render the scene to the console', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => void 0);
    await renderer.render();
    expect(spy).toHaveBeenCalled();
  });

  it('should render a pixel for each screen pixel', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => void 0);
    await renderer.render();
    expect(spy).toHaveBeenCalledTimes(camera.verticalResolution * 2);
    expect(spy.mock.calls[0][0].length).toEqual(camera.horizontailResolution);
  });

  it('should output different shades', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => void 0);
    await renderer.render();
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('#'));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('O'));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('.'));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining(' '));
  });
});
