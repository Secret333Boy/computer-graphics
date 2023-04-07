import Camera from '../lab1/structures/camera/Camera';
import { DirectionalLight } from '../lab1/structures/light/directional-light/DirectionalLight';
import { Sphere } from '../lab1/structures/sphere/Sphere';
import Vector3D from '../lab1/structures/vector/Vector3D';
import Vertex3D from '../lab1/structures/vertex/Vertex3D';
import { Scene } from '../lab1/types/Scene';
import PPMRenderer from './PPMRenderer';
import ReaderOBJ from './ReaderOBJ';

let objFilePath = '';
let output = '';
for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i] === '--objFile') {
    objFilePath = process.argv[i + 1];
  }

  if (process.argv[i] === '--output') {
    output = process.argv[i + 1];
  }
}

if (!objFilePath) throw new Error('Invalid input: no obj path');
if (!output) throw new Error('Invalid input: no output path');

(async () => {
  const mesh = await ReaderOBJ.read(objFilePath);

  const camera = new Camera(
    new Vertex3D(0, 500, -2000),
    new Vector3D(0, 0, 1),
    1,
    Math.PI / 3,
    600
  );

  const directionalLight = new DirectionalLight(new Vector3D(-1, 0, 1));

  const scene: Scene = {
    camera,
    light: directionalLight,
    objects: [new Sphere(new Vertex3D(0, 0, 5), 300), mesh],
  };

  const ppmRenderer = new PPMRenderer(scene, output);

  ppmRenderer.render();
})();
