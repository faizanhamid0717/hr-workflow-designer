import { Node, Edge } from 'reactflow';

export enum NodeType {
  START = 'startNode',
  TASK = 'taskNode',
  APPROVAL = 'approvalNode',
  AUTOMATION = 'automationNode',
  END = 'endNode',
}

// Data structures for Node Data
export interface BaseNodeData {
  label: string;
  [key: string]: any;
}

export interface StartNodeData extends BaseNodeData {
  metadata: { key: string; value: string }[];
}

export interface TaskNodeData extends BaseNodeData {
  description: string;
  assignee: string;
  dueDate: string;
}

export interface ApprovalNodeData extends BaseNodeData {
  approverRole: string;
  autoApproveThreshold: number;
}

export interface AutomationNodeData extends BaseNodeData {
  actionId: string;
  params: Record<string, string>;
}

export interface EndNodeData extends BaseNodeData {
  endMessage: string;
  isSummary: boolean;
}

// API Types
export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationLog {
  step: number;
  nodeId: string;
  nodeType: string;
  label: string;
  status: 'success' | 'failure' | 'pending';
  message: string;
  timestamp: string;
}

export interface SimulationResult {
  success: boolean;
  logs: SimulationLog[];
  errors?: string[];
}
