import { Traceable } from '../src/types/Traceable';
import { Scene } from '../src/types/Scene';
import ConsoleRenderer from '../src/ConsoleRenderer';
import Camera from '../src/structures/camera/Camera';
import Vertex3D from '../src/structures/vertex/Vertex3D';
import Vector3D from '../src/structures/vector/Vector3D';

class MockObject implements Traceable {
  public isIntersecting(): boolean {
    return false;
  }
}

describe('ConsoleRenderer', () => {
  let scene: Scene;
  let renderer: ConsoleRenderer;
  let camera: Camera;

  beforeEach(() => {
    const objects: Traceable[] = [new MockObject(), new MockObject()];
    camera = new Camera(
      new Vertex3D(0, 0, 0),
      new Vector3D(0, 0, 1),
      1,
      Math.PI / 4,
      100
    );
    scene = { objects, camera };
    renderer = new ConsoleRenderer(scene);
  });

  it('should render the scene to the console', () => {
    const spy = jest.spyOn(console, 'log');
    renderer.render();
    expect(spy).toHaveBeenCalled();
  });

  it('should render a pixel for each screen pixel', () => {
    const spy = jest.spyOn(console, 'log');
    renderer.render();
    expect(spy).toHaveBeenCalledTimes(camera.vResolution * 2);
    expect(spy.mock.calls[0][0].length).toEqual(camera.hResolution);
  });
});
