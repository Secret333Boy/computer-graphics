import ConsoleRenderer from './ConsoleRenderer';
import Camera from './structures/camera/Camera';
import { DirectionalLight } from './structures/light/directional-light/DirectionalLight';
import { Sphere } from './structures/sphere/Sphere';
import Vector3D from './structures/vector/Vector3D';
import Vertex3D from './structures/vertex/Vertex3D';
import { Scene } from './types/Scene';

const camera = new Camera(
  new Vertex3D(0, 0, -5),
  new Vector3D(0, 0, 1),
  1,
  Math.PI / 3,
  50
);

const sphere = new Sphere(new Vertex3D(0, 0, 0), 1);

const mainScene: Scene = {
  camera,
  objects: [sphere],
  light: new DirectionalLight(new Vector3D(1, 0, 0)),
};

const consoleRenderer = new ConsoleRenderer(mainScene);

consoleRenderer.render();
