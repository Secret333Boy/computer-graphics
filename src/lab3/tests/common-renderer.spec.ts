import Camera from '../../lab1/structures/camera/Camera';
import { DirectionalLight } from '../../lab1/structures/light/directional-light/DirectionalLight';
import Vector3D from '../../lab1/structures/vector/Vector3D';
import Vertex3D from '../../lab1/structures/vertex/Vertex3D';
import { Renderer } from '../../lab1/types/Renderer';
import { Scene } from '../../lab1/types/Scene';
import { CommonRenderer } from '../CommonRenderer';

describe('CommonRenderer', () => {
  describe('render', () => {
    it('calls handleRay for each pixel on the screen', () => {
      const mockScene: Scene = {
        camera: new Camera(
          new Vertex3D(0, 0, 0),
          new Vector3D(0, 0, 1),
          1,
          Math.PI / 2,
          2
        ),
        light: new DirectionalLight(new Vector3D(0, 0, 1)),
        objects: [],
      };
      const mockRenderer: Renderer = {
        scene: mockScene,
        render: jest.fn(),
      };
      const commonRenderer = new CommonRenderer(mockScene, mockRenderer.render);
      commonRenderer.render();
      expect(mockRenderer.render).toHaveBeenCalledTimes(4);
    });
  });
});
