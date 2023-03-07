import { Traceable } from '../src/types/Traceable';
import { Scene } from '../src/types/Scene';
import ConsoleRenderer from '../src/ConsoleRenderer';
import Camera from '../src/structures/camera/Camera';
import Vertex3D from '../src/structures/vertex/Vertex3D';
import Vector3D from '../src/structures/vector/Vector3D';
import { DirectionalLight } from '../src/structures/light/directional-light/DirectionalLight';
import { Sphere } from '../src/structures/sphere/Sphere';

describe('ConsoleRenderer', () => {
  let scene: Scene;
  let renderer: ConsoleRenderer;
  let camera: Camera;

  beforeEach(() => {
    const objects: Traceable[] = [new Sphere(new Vertex3D(0, 0, 0), 1)];
    camera = new Camera(
      new Vertex3D(0, 0, -2),
      new Vector3D(0, 0, 1),
      1,
      Math.PI / 3,
      50
    );
    const light = new DirectionalLight(new Vector3D(1, 0, 0));
    scene = { objects, camera, light };
    renderer = new ConsoleRenderer(scene);
  });

  it('should render the scene to the console', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => void 0);
    renderer.render();
    expect(spy).toHaveBeenCalled();
  });

  it('should render a pixel for each screen pixel', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => void 0);
    renderer.render();
    expect(spy).toHaveBeenCalledTimes(camera.vResolution * 2);
    expect(spy.mock.calls[0][0].length).toEqual(camera.hResolution);
  });

  it('should output different shades', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => void 0);
    renderer.render();
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('#'));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('O'));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('.'));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining(' '));
  });
});
