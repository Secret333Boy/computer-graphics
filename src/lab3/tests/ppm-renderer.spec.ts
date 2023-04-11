import fs, { createWriteStream } from 'fs';
import path from 'path';
import Camera from '../../lab1/structures/camera/Camera';
import { Scene } from '../../lab1/types/Scene';
import Vertex3D from '../../lab1/structures/vertex/Vertex3D';
import Vector3D from '../../lab1/structures/vector/Vector3D';
import { Sphere } from '../../lab1/structures/sphere/Sphere';
import { DirectionalLight } from '../../lab1/structures/light/directional-light/DirectionalLight';
import PPMRenderer from '../structures/renderers/PPMRenderer';

describe('PPMRenderer', () => {
  const scene: Scene = new Scene(
    [new Sphere(new Vertex3D(0, 0, 5), 1)],
    new Camera(
      new Vertex3D(0, 0, 0),
      new Vector3D(0, 0, 1),
      Math.PI / 3,
      50,
      50
    ),
    new DirectionalLight(new Vector3D(0, 0, 1))
  );
  const filePath = path.resolve(__dirname, './test.ppm');
  const writeStream = createWriteStream(filePath);
  const renderer = new PPMRenderer(scene, writeStream);

  it('should render an image', async () => {
    await renderer.render();
    setTimeout(() => {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      expect(fileContent).toMatch(/^P3 \d+ \d+ \d+\n(\d+ \d+ \d+[\n\s]?)*/);
      fs.unlinkSync(filePath);
    }, 100);
  });
});
