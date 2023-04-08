import Camera from './lab1/structures/camera/Camera';
import { DirectionalLight } from './lab1/structures/light/directional-light/DirectionalLight';
import { Sphere } from './lab1/structures/sphere/Sphere';
import Vector3D from './lab1/structures/vector/Vector3D';
import Vertex3D from './lab1/structures/vertex/Vertex3D';
import { Scene } from './lab1/types/Scene';
import PPMRenderer from './lab3/structures/renderers/PPMRenderer';
import ReaderOBJ from './lab3/ReaderOBJ';
import { createReadStream, createWriteStream } from 'fs';

let objFilePath = '';
let outputPath = '';
for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i] === '--objFile') {
    objFilePath = process.argv[i + 1];
  }

  if (process.argv[i] === '--output') {
    outputPath = process.argv[i + 1];
  }
}

if (!objFilePath) throw new Error('Invalid input: no obj path');
if (!outputPath) throw new Error('Invalid input: no output path');

(async () => {
  const inputReadStream = createReadStream(objFilePath);
  const mesh = await ReaderOBJ.readStream(inputReadStream);
  console.log('Mesh loaded');
  const cameraWidth = 50;
  const resolution = 1;
  const camera = new Camera(
    new Vertex3D(0, 0, 0),
    new Vector3D(0, 0, 1),
    Math.PI / 3,
    cameraWidth,
    Math.floor(cameraWidth / resolution)
  );
  const directionalLight = new DirectionalLight(new Vector3D(-1, 0, 1));
  const scene: Scene = new Scene(
    [new Sphere(new Vertex3D(0, 0, 5), 300), mesh],
    camera,
    directionalLight
  );
  scene.translate(0, -500, 2000);
  // mesh.translate(0, 0, 1000);

  // look from below
  // camera.translate(0, -1000, 0);
  // camera.rotate(Math.PI / 6, 0, 0);

  // look from the side
  // camera.translate(-1000, 0, 0);
  // camera.rotate(0, -Math.PI / 6, 0);

  // look upside down
  // camera.rotate(0, 0, Math.PI);

  const outputWriteStream = createWriteStream(outputPath);
  const ppmRenderer = new PPMRenderer(scene, outputWriteStream);
  await ppmRenderer.render();
})();
