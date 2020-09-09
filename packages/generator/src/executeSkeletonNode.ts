import Nodes from '@plantarium/nodes';
import { GeneratorContext } from '@plantarium/types';
import { PlantNode } from '@types';

const nodes: { [type: string]: PlantNode } = {};

Nodes.forEach((n) => {
  nodes[n.type] = n;
});

export default (node, ctx: GeneratorContext) => {
  if (node.type in nodes) {
    return nodes[node.type].computeSkeleton(node, ctx);
  }

  return node.result;
};
