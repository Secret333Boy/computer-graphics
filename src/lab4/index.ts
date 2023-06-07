import { createReadStream, createWriteStream } from 'fs';
import BMPRenderer from '../lab3/structures/renderers/BMPRenderer';
import { DirectionalLight } from '../lab1/structures/light/directional-light/DirectionalLight';
import Vector3D from '../lab1/structures/vector/Vector3D';
import { Scene } from '../lab1/types/Scene';
import Camera from '../lab1/structures/camera/Camera';
import Vertex3D from '../lab1/structures/vertex/Vertex3D';
import { Sphere } from '../lab1/structures/sphere/Sphere';
import Disk from '../lab1/structures/disk/Disk';
import ReaderOBJ from '../lab3/ReaderOBJ';
import { KDTreeBuilder } from './structures/KDTree';
import { DumbTransformableGroup } from '../lab3/structures/transformable-groups/DumbTransformableGroup';
import { KDTraceableGroup } from '../lab3/structures/traceable-groups/KDTraceableGroup';
import { traceableGroupMap } from './traceableGroupMap';

let inputPath = '';
let outputPath = '';
let traceableGroupType = 'kd';
for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i] === '--source') {
    inputPath = process.argv[i + 1];
  }

  if (process.argv[i] === '--output') {
    outputPath = process.argv[i + 1];
  }

  if (process.argv[i] === '--traceable-group') {
    traceableGroupType = process.argv[i + 1];
  }
}

if (!inputPath) throw new Error('Invalid input: no input path');
if (!outputPath) throw new Error('Invalid input: no output path');
if (
  !traceableGroupType ||
  !Object.keys(traceableGroupMap).includes(traceableGroupType)
)
  throw new Error('Invalid input: incorrect traceable group type');

(async () => {
  const cowOBJ = `${__dirname}/cow.obj`;
  const inputReadStream = createReadStream(cowOBJ);
  const readerObj = new ReaderOBJ((obj) => new DumbTransformableGroup(obj));
  const mesh = await readerObj.readStream(inputReadStream);
  console.log('Mesh loaded');
  const camera = new Camera(
    // use for relative to (0, 0, 0)
    // new Vertex3D(0, 0, 0),
    new Vertex3D(0, 0, -2000),
    new Vector3D(0, 0, 1),
    Math.PI / 3,
    1920,
    1080
  );

  const directionalLight = new DirectionalLight(
    new Vector3D(-1, -1, 1),
    { r: 1, g: 1, b: 1 },
    1
  );

  let scene;
  if (inputPath === 'cow.obj') {
    const inputReadStream = createReadStream(inputPath);
    const mesh = await readerObj.readStream(inputReadStream);
    scene = new Scene({
      objects: mesh.primitives,
      camera,
      lights: [directionalLight],
      transformableGroupFactory: (obj) => new DumbTransformableGroup(obj),
    });
  } else if (inputPath === 'cow-scene') {
    scene = new Scene({
      objects: [
        new Sphere(new Vertex3D(0, 1100, 8000), 3500),
        ...mesh.primitives,
        new Disk(new Vertex3D(-400, -1800, 8000), new Vector3D(0, 1, 0), 8000),
      ],
      camera,
      lights: [directionalLight],
      transformableGroupFactory: (obj) => new DumbTransformableGroup(obj),
    });
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
  for (const traceableGroupFactory of traceableGroupMap[traceableGroupType]()) {
    const renderer = new BMPRenderer(
      scene,
      outputWriteStream,
      traceableGroupFactory
    );
    await renderer.render();
  }
})();
