import Camera from '../structures/camera/Camera';
import { DirectionalLight } from '../structures/light/directional-light/DirectionalLight';
import { Traceable } from './Traceable';

export interface Scene {
  objects: Traceable[];
  camera: Camera;
  // to add an ability for many sources in the future
  light: DirectionalLight;
}
