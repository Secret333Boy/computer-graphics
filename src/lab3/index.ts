import ConsoleRenderer from '../lab1/ConsoleRenderer';
import Camera from '../lab1/structures/camera/Camera';
import { DirectionalLight } from '../lab1/structures/light/directional-light/DirectionalLight';
import Vector3D from '../lab1/structures/vector/Vector3D';
import Vertex3D from '../lab1/structures/vertex/Vertex3D';
import { Scene } from '../lab1/types/Scene';
import Triangle from './structures/triangle/Triangle';

const camera = new Camera(
  new Vertex3D(0, 0, 0),
  new Vector3D(0, 0, 1),
  1,
  Math.PI / 3,
  50
);

const triangle = new Triangle(
  new Vertex3D(0, 0, 5),
  new Vertex3D(0, 1, 5),
  new Vertex3D(1, 0, 5)
);

const directionalLight = new DirectionalLight(new Vector3D(0, 0, 1));

const mainScene: Scene = {
  camera,
  objects: [triangle],
  light: directionalLight,
};

const consoleRenderer = new ConsoleRenderer(mainScene);

consoleRenderer.render();
