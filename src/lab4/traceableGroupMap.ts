import { DumbTraceableGroup } from "../lab3/structures/traceable-groups/DumbTraceableGroup";
import { TraceableGroupFactory } from "../lab3/structures/traceable-groups/GenericTraceableGroup";
import { KDTraceableGroup } from "../lab3/structures/traceable-groups/KDTraceableGroup";
import { KDTreeBuilder } from "./structures/KDTree";

export const traceableGroupMap: Record<string, () => TraceableGroupFactory[]> = {
  'kd': () => {
    const builder = new KDTreeBuilder({ maxPrimitives: 10 });
    return [(obj) => new KDTraceableGroup(obj, builder)]
  },
  'dumb': () => {
    return [(obj) => new DumbTraceableGroup(obj)]
  },
  'both': () => {
    const builder = new KDTreeBuilder({ maxPrimitives: 10 });
    return [
      (obj) => new KDTraceableGroup(obj, builder),
      (obj) => new DumbTraceableGroup(obj)
    ]
  }
}