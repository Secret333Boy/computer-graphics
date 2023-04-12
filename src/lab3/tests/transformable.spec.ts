import {
  Rotatable,
  Scalable,
  TraceableTransformable,
  Transformable,
  Translatable,
} from '../types/Transformable';

describe('interfaces', () => {
  describe('Rotatable', () => {
    it('should have a rotate method', () => {
      const rotatable: Rotatable = {
        rotate: jest.fn(),
      };
      expect(rotatable.rotate).toBeDefined();
      expect(typeof rotatable.rotate).toBe('function');
    });
  });

  describe('Translatable', () => {
    it('should have a translate method', () => {
      const translatable: Translatable = {
        translate: jest.fn(),
      };
      expect(translatable.translate).toBeDefined();
      expect(typeof translatable.translate).toBe('function');
    });
  });

  describe('Scalable', () => {
    it('should have a scale method', () => {
      const scalable: Scalable = {
        scale: jest.fn(),
      };
      expect(scalable.scale).toBeDefined();
      expect(typeof scalable.scale).toBe('function');
    });
  });

  describe('Transformable', () => {
    it('should have rotate, translate, and scale methods', () => {
      const transformable: Transformable = {
        rotate: jest.fn(),
        translate: jest.fn(),
        scale: jest.fn(),
      };
      expect(transformable.rotate).toBeDefined();
      expect(typeof transformable.rotate).toBe('function');
      expect(transformable.translate).toBeDefined();
      expect(typeof transformable.translate).toBe('function');
      expect(transformable.scale).toBeDefined();
      expect(typeof transformable.scale).toBe('function');
    });
  });
});
