import Camera from '../lab1/structures/camera/Camera';
import { DirectionalLight } from '../lab1/structures/light/directional-light/DirectionalLight';
import { Sphere } from '../lab1/structures/sphere/Sphere';
import Vector3D from '../lab1/structures/vector/Vector3D';
import Vertex3D from '../lab1/structures/vertex/Vertex3D';
import { Scene } from '../lab1/types/Scene';
import ReaderOBJ from './ReaderOBJ';
import { createReadStream, createWriteStream } from 'fs';
import Disk from '../lab1/structures/disk/Disk';
import { transformations } from './structures/matrix/transformation-factories';
import BMPRenderer from './structures/renderers/BMPRenderer';
import { TraceableGroupFactory } from './structures/traceable-groups/GenericTraceableGroup';
import { TransformableGroupFactory } from './structures/transformable-groups/GenericTransformableGroup';
import { DumbTransformableGroup } from './structures/transformable-groups/DumbTransformableGroup';
import { KDTraceableGroup } from './structures/traceable-groups/KDTraceableGroup';
import { KDTreeBuilder } from '../lab4/structures/KDTree';

let objFilePath = '';
let outputPath = '';
for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i] === '--source') {
    objFilePath = process.argv[i + 1];
  }

  if (process.argv[i] === '--output') {
    outputPath = process.argv[i + 1];
  }
}

if (!objFilePath) throw new Error('Invalid input: no obj path');
if (!outputPath) throw new Error('Invalid input: no output path');

(async () => {
  // uncomment to return to the old rendering flow
  // const traceableGroupFactory: TraceableGroupFactory = (objects) =>
  //   new DumbTraceableGroup(objects);
  // const transformableGroupFactory: TransformableGroupFactory = (objects) =>
  //   new DumbTransformableGroup(objects);
  const kdTreeBuilder = new KDTreeBuilder({
    // max primitives in a leaf
    maxPrimitives: 10,
  });
  const traceableGroupFactory: TraceableGroupFactory = (objects) =>
    new KDTraceableGroup(objects, kdTreeBuilder);
  const transformableGroupFactory: TransformableGroupFactory = (objects) =>
    new DumbTransformableGroup(objects);
  const inputReadStream = createReadStream(objFilePath);
  const readerObj = new ReaderOBJ(transformableGroupFactory);
  const mesh = await readerObj.readStream(inputReadStream);
  console.log('Mesh loaded');
  const camera = new Camera(
    // use for relative to (0, 0, 0)
    // new Vertex3D(0, 0, 0),
    new Vertex3D(0, 0, -2000),
    new Vector3D(0, 0, 1),
    Math.PI / 3,
    2000,
    2000
  );
  const directionalLight = new DirectionalLight(new Vector3D(-1, -1, 1));
  const scene: Scene = new Scene({
    objects: [
      new Sphere(new Vertex3D(0, 1100, 8000), 100),
      // to avoid nested kdtrees, meshes now DO NOT implement Traceable, instead only the top-level scene creates
      // a top-level traceable group. Meshes still implement Transformable though
      // (imagine a situation, where there is a mesh inside a mesh, inside a mesh and so on. because the KDTrees
      // are built from the bottom to the top level (with a final one being the scene kdtree), you will end up
      // with an uncontrollable max depth of the tree, which might be bad. To avoid this, and keep the scene oblivious
      // of the existence of Mesh class, we just inline the primitives)
      ...mesh.primitives,
      new Disk(new Vertex3D(-400, -1800, 8000), new Vector3D(0, 1, 0), 8000),
    ],
    camera,
    light: directionalLight,
    transformableGroupFactory,
  });
  scene.transform(transformations.translate3d(-400, -500, 2000));
  mesh.transform(transformations.translate3d(900, 100, 700));
  mesh.transform(transformations.scale3d(2, 2, 2));

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
  // const renderer = new PPMRenderer(scene, outputWriteStream);
  const renderer = new BMPRenderer(
    scene,
    outputWriteStream,
    traceableGroupFactory
  );
  // transforms relative to the camera
  // await ppmRenderer.render();
  // look behind
  await renderer.render();
})();
