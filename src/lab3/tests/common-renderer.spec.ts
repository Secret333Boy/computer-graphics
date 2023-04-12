import { createWriteStream } from 'fs';
import Camera from '../../lab1/structures/camera/Camera';
import { DirectionalLight } from '../../lab1/structures/light/directional-light/DirectionalLight';
import { Sphere } from '../../lab1/structures/sphere/Sphere';
import Vector3D from '../../lab1/structures/vector/Vector3D';
import Vertex3D from '../../lab1/structures/vertex/Vertex3D';
import { Scene } from '../../lab1/types/Scene';
import PPMRenderer from '../structures/renderers/PPMRenderer';
import { Traceable } from '../../lab1/types/Traceable';
import { Hit } from '../../lab1/types/Hit';
import Normal3D from '../../lab1/structures/normal/Normal';

describe('Common Renderer', () => {
  const scene: Scene = new Scene(
    [
      new Sphere(new Vertex3D(0, 0, 5), 1),
      new Sphere(new Vertex3D(100, 0, 5), 2),
    ],
    new Camera(
      new Vertex3D(0, 0, 0),
      new Vector3D(0, 0, 1),
      Math.PI / 3,
      50,
      50
    ),
    new DirectionalLight(new Vector3D(0, 0, 1))
  );
  const outputPath = '';
  const outputWriteStream = createWriteStream(outputPath);

  const renderer = new PPMRenderer(scene, outputWriteStream);

  describe('Check Shadow', () => {
    it('closest hit is null', () => {
      //Arrange
      //Act
      const result = renderer.checkShadow(null);
      //Assert
      expect(result).toBe(false);
    });
    it('closest hit is not null returns false', () => {
      //Arrange
      const normal = new Normal3D(new Vector3D(0, 0, 1));
      const hit: Hit = {
        normal,
        vertex: new Vertex3D(0, 0, 2),
        t: 2,
        object: {} as Traceable,
      };
      //Act
      const result = renderer.checkShadow(hit);
      //Assert
      expect(result).toBe(false);
    });
  });
});
