import { createReadStream, createWriteStream } from 'fs';
import BMPRenderer from '../lab3/structures/renderers/BMPRenderer';
import { DirectionalLight } from '../lab1/structures/light/directional-light/DirectionalLight';
import Vector3D from '../lab1/structures/vector/Vector3D';
import { Scene } from '../lab1/types/Scene';
import Camera from '../lab1/structures/camera/Camera';
import Vertex3D from '../lab1/structures/vertex/Vertex3D';
import { Sphere } from '../lab1/structures/sphere/Sphere';
import Disk from '../lab1/structures/disk/Disk';
import { transformations } from '../lab3/structures/matrix/transformation-factories';
import ReaderOBJ from '../lab3/ReaderOBJ';

let inputPath = '';
let outputPath = '';
for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i] === '--source') {
    inputPath = process.argv[i + 1];
  }

  if (process.argv[i] === '--output') {
    outputPath = process.argv[i + 1];
  }
}

if (!inputPath) throw new Error('Invalid input: no input path');
if (!outputPath) throw new Error('Invalid input: no output path');

(async () => {
  const cowOBJ = './src/lab4/cow.obj';
  const treeOBJ = './src/lab4/tree3.obj';
  const grassOBJ = './src/lab4/grass.obj';
  const cowReadStream = createReadStream(cowOBJ);
  const treeReadStream = createReadStream(treeOBJ);
  const grassReadStream = createReadStream(grassOBJ);
  const cowMesh = await ReaderOBJ.readStream(cowReadStream);
  const treeMesh = await ReaderOBJ.readStream(treeReadStream);
  const grassMesh = await ReaderOBJ.readStream(grassReadStream);
  treeMesh.transform(transformations.scale3d(80, 80, 80));
  treeMesh.transform(transformations.translate3d(600, -900, 0));
  cowMesh.transform(transformations.translate3d(-400, -1000, 0));
  grassMesh.transform(transformations.scale3d(400, 400, 400));
  grassMesh.transform(transformations.translate3d(0, -1000, -400));
  console.log('Mesh loaded');
  const camera = new Camera(
    // use for relative to (0, 0, 0)
    // new Vertex3D(0, 0, 0),
    new Vertex3D(0, 0, -2000),
    new Vector3D(0, 0, 1),
    Math.PI / 3,
    200,
    200
  );

  const directionalLight = new DirectionalLight(new Vector3D(-0.25, -1, 1));

  let scene;
  if (inputPath === 'cow.obj') {
    scene = new Scene([treeMesh], camera, directionalLight);
  } else if (inputPath === 'cow-scene') {
    scene = new Scene(
      [
        new Sphere(new Vertex3D(-1000, 3500, 7000), 5000),
        cowMesh,
        treeMesh,
        grassMesh,
        new Disk(new Vertex3D(-400, -1800, 8000), new Vector3D(0, 1, 0), 8000),
      ],
      camera,
      directionalLight
    );
  } else if (inputPath === 'human-scene') {
    scene = new Scene([treeMesh, cowMesh], camera, directionalLight);
  } else {
    throw new Error('Invalid input: unknown scene');
  }

  //   scene.transform(transformations.translate3d(-400, -500, 2000));
  //   mesh.transform(transformations.translate3d(900, 100, 700));
  //   mesh.transform(transformations.scale3d(2, 2, 2));

  //

  // mesh.translate(0, 0, 1000);

  // transforms relative to (0, 0, 0)
  // look from below
  // camera.translate(0, -1000, 0);
  // camera.rotate(Math.PI / 6, 0, 0);

  // look from the side
  // camera.translate(-1000, 0, 0);
  // camera.rotate(0, -Math.PI / 6, 0);

  // look upside down
  // camera.rotate(0, 0, Math.PI);

  // look behind
  // camera.rotate(0, Math.PI, 0);

  const outputWriteStream = createWriteStream(outputPath);
  const renderer = new BMPRenderer(scene, outputWriteStream);
  await renderer.render();
})();
