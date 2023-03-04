import Ray from "../structures/ray/Ray";

export interface Traceable {
    isIntersecting: (ray: Ray) => boolean
}
