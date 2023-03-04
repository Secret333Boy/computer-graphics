import Camera from '../structures/camera/Camera';
import { Traceable } from './Traceable';

export interface Scene {
  objects: Traceable[];
  camera: Camera;
}
