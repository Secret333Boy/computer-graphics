import { transformations } from '../../lab3/structures/matrix/transformation-factories';
import Camera from '../structures/camera/Camera';
import Vector3D from '../structures/vector/Vector3D';
import Vertex3D from '../structures/vertex/Vertex3D';
import { expectVector3DCloseTo, expectVertex3DCloseTo } from './helpers';

describe('Camera', () => {
  // camera with focal point at (1, 1, 1)
  // looking 45 degrees up and 45 degrees into the first quadrant
  // with a 16:9 aspect ratio
  // 60 degress FOV, 1920 pixels wide
  const ratio = 16 / 9;
  const camera = new Camera(
    new Vertex3D(1, 1, 1),
    new Vector3D(1, 1, 1),
    Math.PI / 3,
    1920,
    Math.floor(1920 / ratio)
  );
  it('should have a screen center', () => {
    expect(camera.screenCenter).toEqual(new Vertex3D(2, 2, 2));
  });

  it('should have a screen width', () => {
    expect(camera.screenWidth).toBeCloseTo(
      (2 * camera.viewVector.length) / Math.sqrt(3)
    );
  });

  it('should have a screen height', () => {
    expect(camera.screenHeight).toBeCloseTo(
      (2 * camera.viewVector.length) / Math.sqrt(3) / ratio
    );
  });

  it('should have correct vertical resolution', () => {
    expect(camera.verticalResolution).toEqual(1080);
  });

  // the same camera, but not looking up and starting at (0, 0, 0)
  const convenientCamera = new Camera(
    new Vertex3D(0, 0, 0),
    new Vector3D(1, 1, 0),
    Math.PI / 2,
    1920,
    1920
  );

  it('should correctly translate pixel coordinates into 3d coordinates', () => {
    const coordBottomLeft = convenientCamera.getScreenPixelCoordinates(0, 0);
    expect(coordBottomLeft.x).toBeCloseTo(2);
    expect(coordBottomLeft.y).toBeCloseTo(0);
    expect(coordBottomLeft.z).toBeCloseTo(-Math.sqrt(2));
    const coordTopRight = convenientCamera.getScreenPixelCoordinates(
      1920,
      1920
    );
    expect(coordTopRight.x).toBeCloseTo(0);
    expect(coordTopRight.y).toBeCloseTo(2);
    expect(coordTopRight.z).toBeCloseTo(Math.sqrt(2));
    expect(
      convenientCamera.getScreenPixelCoordinates(1920 / 2, 1920 / 2)
    ).toEqual(new Vertex3D(1, 1, 0));
  });

  describe('transforms', () => {
    let mutableCamera: Camera;
    beforeEach(() => {
      mutableCamera = new Camera(
        new Vertex3D(1, 1, 1),
        new Vector3D(1, 1, 1),
        Math.PI / 3,
        1920,
        Math.floor(1920 / ratio)
      );
    });

    it('should translate camera', () => {
      mutableCamera.transform(transformations.translate3d(1, 1, 1));
      expect(mutableCamera.focalPoint).toEqual(new Vertex3D(2, 2, 2));
    });

    it('should rotate camera', () => {
      mutableCamera.transform(transformations.rotate3dX(Math.PI / 2));
      expectVector3DCloseTo(mutableCamera.viewVector, new Vector3D(1, 1, -1));
      expectVertex3DCloseTo(mutableCamera.focalPoint, new Vertex3D(1, 1, -1));
    });
  });
});
