import ConsoleRenderer from './ConsoleRenderer';
import Camera from './structures/camera/Camera';
import Disk from './structures/disk/Disk';
import { DirectionalLight } from './structures/light/directional-light/DirectionalLight';
import Plane from './structures/plane/Plane';
import { Sphere } from './structures/sphere/Sphere';
import Vector3D from './structures/vector/Vector3D';
import Vertex3D from './structures/vertex/Vertex3D';
import { Scene } from './types/Scene';

const camera = new Camera(
  new Vertex3D(0, 0, 0),
  new Vector3D(0, 0, 1),
  1,
  Math.PI / 3,
  50
);

const plane1 = new Plane(new Vertex3D(0, 0, 1), new Vector3D(100, 0, 1));
const plane2 = new Plane(new Vertex3D(0, 0, 5), new Vector3D(0, 0, -1));

const disk = new Disk(new Vertex3D(0, 0, 10), new Vector3D(0, 0, -1), 3);

const sphere = new Sphere(new Vertex3D(1, 1, 5), 1);

const directionalLight = new DirectionalLight(new Vector3D(0, 0, 1));

const mainScene: Scene = {
  camera,
  objects: [disk, sphere],
  light: directionalLight,
};

const consoleRenderer = new ConsoleRenderer(mainScene);

consoleRenderer.render();
