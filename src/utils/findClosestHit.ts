import { Hit } from '../types/Hit';

export const findClosestHit = (hits: Hit[]): Hit => {
  let minT = hits[0].t;
  let closestHit = hits[0];
  for (let i = 1; i < hits.length; i++) {
    if (hits[i].t < minT) {
      closestHit = hits[i];
      minT = hits[i].t;
    }
  }
  return closestHit;
};
