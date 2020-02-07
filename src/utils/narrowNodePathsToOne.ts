import { NodePath } from '@babel/traverse';

export function narrowNodePathsToOne(nodePaths: NodePath | NodePath[]) {
  return Array.isArray(nodePaths) ? nodePaths[0] : nodePaths;
}
