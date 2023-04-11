import { Traceable } from '../../lab1/types/Traceable';

export interface Rotatable {
  rotate(angleX: number, angleY: number, angleZ: number): void;
}

export interface Translatable {
  translate(x: number, y: number, z: number): void;
}

export interface Scalable {
  scale(x: number, y: number, z: number): void;
}

export interface Transformable extends Rotatable, Translatable, Scalable {}

export interface TraceableTransformable extends Transformable, Traceable {}
