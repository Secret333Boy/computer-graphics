import { HitInfo } from '../types/Traceable';

export const findClosestHit = (hits: HitInfo[]): HitInfo => {
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
