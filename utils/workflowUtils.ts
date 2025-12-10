import { WorkflowNode, WorkflowEdge, NodeType, ValidationResult } from '../types';

export const generateId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const validateWorkflow = (nodes: WorkflowNode[], edges: WorkflowEdge[]): ValidationResult => {
  const errors: string[] = [];
  const invalidNodeIds: string[] = [];

  // 1. Check for Start Node
  const startNodes = nodes.filter(n => n.type === NodeType.START);
  if (startNodes.length === 0) {
    errors.push("Workflow must have at least one Start node.");
  }
  if (startNodes.length > 1) {
    errors.push("Workflow cannot have multiple Start nodes.");
    startNodes.forEach(n => invalidNodeIds.push(n.id));
  }

  // 2. Check for isolated nodes (except Start)
  nodes.forEach(node => {
    if (node.type === NodeType.START) return;
    const isConnected = edges.some(e => e.target === node.id);
    if (!isConnected) {
      errors.push(`Node "${node.data.label}" is unreachable (no incoming connections).`);
      invalidNodeIds.push(node.id);
    }
  });

  // 3. Check for End Nodes
  const endNodes = nodes.filter(n => n.type === NodeType.END);
  if (endNodes.length === 0) {
    errors.push("Workflow should have at least one End node.");
  }

  // 4. Check for Leaf nodes that aren't End nodes
  nodes.forEach(node => {
    if (node.type === NodeType.END) return;
    const hasOutgoing = edges.some(e => e.source === node.id);
    if (!hasOutgoing) {
      errors.push(`Node "${node.data.label}" is a dead end. Connect it to another node or an End node.`);
      invalidNodeIds.push(node.id);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    invalidNodeIds: Array.from(new Set(invalidNodeIds))
  };
};