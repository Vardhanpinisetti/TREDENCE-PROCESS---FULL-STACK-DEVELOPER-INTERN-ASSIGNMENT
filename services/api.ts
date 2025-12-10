import { AutomationAction, SimulationResult, WorkflowNode, WorkflowEdge, SimulationLog } from '../types';

// Mock Data
const MOCK_AUTOMATIONS: AutomationAction[] = [
  { id: "send_email", label: "Send Email", params: ["to", "subject", "body"] },
  { id: "generate_contract", label: "Generate Contract", params: ["template_id", "candidate_name"] },
  { id: "notify_slack", label: "Notify Slack Channel", params: ["channel", "message"] },
  { id: "create_user_account", label: "Create IT Account", params: ["username", "department"] }
];

// Service functions
export const fetchAutomations = async (): Promise<AutomationAction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_AUTOMATIONS);
    }, 500); // Simulate network delay
  });
};

export const simulateWorkflow = async (nodes: WorkflowNode[], edges: WorkflowEdge[]): Promise<SimulationResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const logs: SimulationLog[] = [];
      let stepCounter = 1;

      // Simple BFS Simulation Logic
      const startNode = nodes.find(n => n.type === 'start');
      
      if (!startNode) {
        resolve({
          success: false,
          logs: [{
            stepId: 0,
            nodeId: 'error',
            nodeType: 'system',
            nodeLabel: 'System',
            message: 'No Start Node found.',
            status: 'failure',
            timestamp: new Date().toISOString()
          }]
        });
        return;
      }

      const queue: WorkflowNode[] = [startNode];
      const visited = new Set<string>();

      while (queue.length > 0) {
        const currentNode = queue.shift()!;
        
        if (visited.has(currentNode.id)) continue;
        visited.add(currentNode.id);

        // Log execution based on type
        let message = `Executed ${currentNode.data.label}`;
        if (currentNode.type === 'task') message = `Task assigned to ${currentNode.data.assignee || 'Unassigned'}`;
        if (currentNode.type === 'approval') message = `Approval request sent to ${currentNode.data.approverRole || 'Admin'}`;
        if (currentNode.type === 'automated') message = `Triggered automation: ${currentNode.data.actionId || 'None'}`;
        
        logs.push({
          stepId: stepCounter++,
          nodeId: currentNode.id,
          nodeType: currentNode.type || 'unknown',
          nodeLabel: currentNode.data.label,
          message: message,
          status: 'success',
          timestamp: new Date().toISOString()
        });

        // Find connected outgoing nodes
        const outgoingEdges = edges.filter(e => e.source === currentNode.id);
        outgoingEdges.forEach(edge => {
          const targetNode = nodes.find(n => n.id === edge.target);
          if (targetNode) {
            queue.push(targetNode);
          }
        });
      }

      resolve({
        success: true,
        logs
      });
    }, 1500); // Simulate processing time
  });
};