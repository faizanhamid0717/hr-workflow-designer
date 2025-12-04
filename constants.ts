import { Node } from 'reactflow';
import { NodeType } from './types';
import { StartNode, TaskNode, ApprovalNode, AutomationNode, EndNode } from './components/CustomNodes';

export const INITIAL_NODES: Node[] = [
  {
    id: '1',
    type: NodeType.START,
    data: { label: 'New Hire Trigger' },
    position: { x: 250, y: 50 },
  },
];

export const NODE_TYPES = {
  [NodeType.START]: StartNode,
  [NodeType.TASK]: TaskNode,
  [NodeType.APPROVAL]: ApprovalNode,
  [NodeType.AUTOMATION]: AutomationNode,
  [NodeType.END]: EndNode,
};
