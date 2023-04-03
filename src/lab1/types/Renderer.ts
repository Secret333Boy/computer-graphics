import { Scene } from './Scene';

export interface Renderer {
  scene: Scene;
  render: () => void;
}
