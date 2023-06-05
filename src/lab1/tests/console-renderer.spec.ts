import { Scene } from '../types/Scene';
import ConsoleRenderer from '../ConsoleRenderer';
import Camera from '../structures/camera/Camera';
import Vertex3D from '../structures/vertex/Vertex3D';
import Vector3D from '../structures/vector/Vector3D';
import { DirectionalLight } from '../structures/light/directional-light/DirectionalLight';
import { DumbTraceableGroup } from '../../lab3/structures/traceable-groups/DumbTraceableGroup';
import { DumbTransformableGroup } from '../../lab3/structures/transformable-groups/DumbTransformableGroup';
import { Sphere } from '../structures/sphere/Sphere';

describe('ConsoleRenderer', () => {
  let scene: Scene;
  let renderer: ConsoleRenderer;
  let camera: Camera;

  beforeEach(() => {
    const objects = [new Sphere(new Vertex3D(0, 0, 0), 1)];
    camera = new Camera(
      new Vertex3D(0, 0, -2),
      new Vector3D(0, 0, 1),
      Math.PI / 3,
      50,
      50
    );
    const light = new DirectionalLight(new Vector3D(1, 0, 0));
    scene = new Scene({
      objects,
      camera,
      light,
      transformableGroupFactory: (obj) => new DumbTransformableGroup(obj),
    });
    renderer = new ConsoleRenderer(scene, (obj) => new DumbTraceableGroup(obj));
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
    expect(spy.mock.calls[0][0].length).toEqual(camera.horizontalResolution);
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
