import { Node, Edge } from 'reactflow';

export enum NodeType {
  START = 'start',
  TASK = 'task',
  APPROVAL = 'approval',
  AUTOMATED = 'automated',
  END = 'end',
}

export interface NodeData {
  label: string;
  hasError?: boolean;
  // Start Node
  metadata?: Record<string, string>;
  // Task Node
  description?: string;
  assignee?: string;
  dueDate?: string;
  customFields?: Record<string, string>;
  // Approval Node
  approverRole?: string;
  autoApproveThreshold?: number;
  // Automated Node
  actionId?: string;
  actionParams?: Record<string, any>;
  // End Node
  endMessage?: string;
  isSummary?: boolean;
}

export type WorkflowNode = Node<NodeData>;
export type WorkflowEdge = Edge;

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationLog {
  stepId: number;
  nodeId: string;
  nodeType: string;
  nodeLabel: string;
  message: string;
  status: 'success' | 'failure' | 'pending';
  timestamp: string;
}

export interface SimulationResult {
  success: boolean;
  logs: SimulationLog[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  invalidNodeIds: string[];
}