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
import {
  KDTraceableGroup,
  closestKdTraceableGroupFactory,
} from '../lab3/structures/traceable-groups/KDTraceableGroup';
import { transformations } from '../lab3/structures/matrix/transformation-factories';
import EnvironmentLight from './light/EnvironmentLight';
import VertexLight from './light/VertexLight';

let inputPath = '';
let outputPath = '';
for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i] === '--source') {
    inputPath = process.argv[i + 1];
  }

  if (process.argv[i] === '--output') {
    outputPath = process.argv[i + 1];
  }

  if (process.argv[i] === '--scene') {
    inputPath = process.argv[i + 1];
  }
}

if (!inputPath) throw new Error('Invalid input: no input path');
if (!outputPath) throw new Error('Invalid input: no output path');

(async () => {
  const cowOBJ = `${__dirname}/cow.obj`;
  const treeOBJ = `${__dirname}/Tree1.obj`;
  const grassOBJ = `${__dirname}/grass.obj`;
  const lartenOBJ = `${__dirname}/larten.obj`;
  const cowReadStream = createReadStream(cowOBJ);
  const treeReadStream = createReadStream(treeOBJ);
  const grassReadStream = createReadStream(grassOBJ);
  const lartenReadStream = createReadStream(lartenOBJ);
  const readerObj = new ReaderOBJ((obj) => new DumbTransformableGroup(obj));
  const cowMesh = await readerObj.readStream(cowReadStream);
  const treeMesh = await readerObj.readStream(treeReadStream);
  const grassMesh = await readerObj.readStream(grassReadStream);
  const lartenMesh = await readerObj.readStream(lartenReadStream);

  treeMesh.transform(transformations.scale3d(120, 120, 120));
  treeMesh.transform(transformations.translate3d(600, 0, -1100));
  treeMesh.transform(transformations.rotate3dX(2));

  cowMesh.transform(transformations.translate3d(-750, -1000, 300));

  grassMesh.transform(transformations.scale3d(400, 400, 400));
  grassMesh.transform(transformations.translate3d(-600, -1000, -400));

  lartenMesh.transform(transformations.scale3d(250, 250, 250));
  lartenMesh.transform(transformations.translate3d(400, -500, -900));
  console.log('Mesh loaded');
  const camera = new Camera(
    // use for relative to (0, 0, 0)
    // new Vertex3D(0, 0, 0),
    new Vertex3D(0, 0, -2000),
    new Vector3D(0, 0, 1),
    Math.PI / 3,
    600,
    600
  );

  const directionalLight = new DirectionalLight(
    new Vector3D(-1, -1, 1),
    { r: 1, g: 1, b: 1 },
    1
  );

  const lightDirectionalLight = new DirectionalLight(
    new Vector3D(-1, -1, 1),
    { r: 1, g: 1, b: 1 },
    0.1
  );

  const pinkDirectionalLight = new DirectionalLight(
    new Vector3D(-1, -1, 1),
    { r: 1, g: 0.588252941, b: 0.7058823529 },
    1
  );

  const greenEnvironmentalLight = new EnvironmentLight(
    { r: 0.498, g: 1, b: 0 },
    0.5
  );

  const lampLight = new VertexLight(
    new Vertex3D(400, 340, -950),
    {
      r: 0.9411764706,
      g: 0.9019607843,
      b: 0.5490196078,
    },
    1000
  );

  const moonLight = new VertexLight(
    new Vertex3D(-900, 1500, 1900),
    {
      r: 0.9411764706,
      g: 0.9019607843,
      b: 0.5490196078,
    },
    1000
  );

  let scene;
  if (inputPath === 'cow.obj') {
    scene = new Scene({
      objects: cowMesh.primitives,
      camera,
      lights: [directionalLight],
      transformableGroupFactory: (obj) => new DumbTransformableGroup(obj),
    });
  } else if (inputPath === 'cow-scene') {
    cowMesh.transform(transformations.translate3d(-40, 0, 70));
    cowMesh.transform(transformations.rotate3dY(-0.65));
    scene = new Scene({
      objects: [
        ...cowMesh.primitives,
        ...treeMesh.primitives,
        ...grassMesh.primitives,
      ],
      camera,
      lights: [pinkDirectionalLight],
      transformableGroupFactory: (obj) => new DumbTransformableGroup(obj),
    });
  } else if (inputPath === 'spheres') {
    const sphere1 = new Sphere(new Vertex3D(550, -1800, 2700), 1000);
    const sphere2 = new Sphere(new Vertex3D(-300, 1100, 1000), 500);
    const sphere3 = new Sphere(new Vertex3D(0, 200, 8000), 1500);
    scene = new Scene({
      objects: [sphere1, sphere2, sphere3],
      camera,
      lights: [directionalLight, greenEnvironmentalLight],
      transformableGroupFactory: (obj) => new DumbTransformableGroup(obj),
    });
  } else if (inputPath === 'night_with_larten') {
    const moon = new Sphere(new Vertex3D(-900, 1500, 2500), 500);
    scene = new Scene({
      objects: [
        ...lartenMesh.primitives,
        ...cowMesh.primitives,
        ...grassMesh.primitives,
        moon,
      ],
      camera,
      lights: [lightDirectionalLight, moonLight],
      transformableGroupFactory: (obj) => new DumbTransformableGroup(obj),
    });
  } else {
    throw new Error('Invalid input: unknown scene');
  }

  const outputWriteStream = createWriteStream(outputPath);
  const builder = new KDTreeBuilder({ maxPrimitives: 10 });
  const renderer = new BMPRenderer(
    scene,
    outputWriteStream,
    (obj) => new KDTraceableGroup(obj, builder),
    closestKdTraceableGroupFactory
  );
  await renderer.render();
})();
