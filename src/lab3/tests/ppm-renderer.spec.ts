import fs from 'fs';
import path from 'path';
import PPMRenderer from '../PPMRenderer';
import Camera from '../../lab1/structures/camera/Camera';
import { Scene } from '../../lab1/types/Scene';
import Vertex3D from '../../lab1/structures/vertex/Vertex3D';
import Vector3D from '../../lab1/structures/vector/Vector3D';
import { Sphere } from '../../lab1/structures/sphere/Sphere';
import { DirectionalLight } from '../../lab1/structures/light/directional-light/DirectionalLight';
import { Hit } from '../../lab1/types/Hit';
import Normal3D from '../../lab1/structures/normal/Normal';

describe('PPMRenderer', () => {
  const scene: Scene = {
    camera: new Camera(
      new Vertex3D(0, 0, 0),
      new Vector3D(0, 0, 1),
      1,
      Math.PI / 3,
      50
    ),
    objects: [new Sphere(new Vertex3D(0, 0, 5), 1)],
    light: new DirectionalLight(new Vector3D(0, 0, 1)),
  };
  const filePath = path.resolve(__dirname, './test.ppm');
  const renderer = new PPMRenderer(scene, filePath);

  it('should render an image', () => {
    renderer.render();
    setTimeout(() => {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      expect(fileContent).toMatch(/^P3 \d+ \d+ \d+\n(\d+ \d+ \d+[\n\s]?)*/);
      fs.unlinkSync(filePath);
    }, 100);
  });

  it('should handle a hit', () => {
    const hit: Hit = {
      t: 1,
      vertex: new Vertex3D(0, 0, 0),
      normal: new Normal3D(new Vector3D(0, 0, -1)),
    };
    const pixel = renderer.handleHit(hit);
    expect(pixel).toEqual({ r: 255, g: 255, b: 255 });
  });

  it('should handle a null hit', () => {
    const pixel = renderer.handleHit(null);
    expect(pixel).toEqual({ r: 0, g: 0, b: 0 });
  });
});
