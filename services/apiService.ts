import { Edge, Node } from 'reactflow';
import { AutomationAction, NodeType, SimulationResult, SimulationLog } from '../types';

// Mock Data
const MOCK_AUTOMATIONS: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate PDF Document', params: ['template_id', 'recipient_name'] },
  { id: 'slack_notify', label: 'Send Slack Notification', params: ['channel', 'message'] },
  { id: 'create_jira', label: 'Create Jira Ticket', params: ['project', 'summary'] },
];

/**
 * Simulates GET /automations
 */
export const fetchAutomations = async (): Promise<AutomationAction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_AUTOMATIONS);
    }, 500); // Simulate network latency
  });
};

/**
 * Simulates POST /simulate
 * Validates the workflow and executes a mock run.
 */
export const simulateWorkflow = async (nodes: Node[], edges: Edge[]): Promise<SimulationResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const logs: SimulationLog[] = [];
      const errors: string[] = [];

      // 1. Validation: Check for Start Node
      const startNode = nodes.find((n) => n.type === NodeType.START);
      if (!startNode) {
        resolve({
          success: false,
          logs: [],
          errors: ['Validation Error: Workflow must have a Start Node.'],
        });
        return;
      }

      // 2. Traversal Simulation (Simple BFS/DFS mock)
      let currentNode: Node | undefined = startNode;
      let step = 1;
      const visited = new Set<string>();

      while (currentNode) {
        if (visited.has(currentNode.id)) {
          errors.push('Validation Error: Cycle detected in workflow.');
          break;
        }
        visited.add(currentNode.id);

        let statusMessage = 'Executed successfully';
        
        // Node specific logic simulation
        switch (currentNode.type) {
            case NodeType.START:
                statusMessage = 'Workflow initiated.';
                break;
            case NodeType.TASK:
                statusMessage = `Task assigned to ${currentNode.data.assignee || 'Unassigned'}.`;
                break;
            case NodeType.APPROVAL:
                statusMessage = `Waiting for approval from ${currentNode.data.approverRole || 'Admin'}.`;
                break;
            case NodeType.AUTOMATION:
                statusMessage = `Triggered automation: ${currentNode.data.actionId || 'None'}.`;
                break;
            case NodeType.END:
                statusMessage = `Workflow ended. ${currentNode.data.endMessage || ''}`;
                break;
        }

        logs.push({
          step: step++,
          nodeId: currentNode.id,
          nodeType: currentNode.type || 'unknown',
          label: currentNode.data.label,
          status: 'success',
          message: statusMessage,
          timestamp: new Date().toISOString(),
        });

        if (currentNode.type === NodeType.END) {
          break;
        }

        // Find next node
        const outgoingEdge = edges.find((e) => e.source === currentNode?.id);
        if (outgoingEdge) {
          currentNode = nodes.find((n) => n.id === outgoingEdge.target);
        } else {
          // If not an end node and no outgoing edge, it's a dead end
          if (currentNode.type !== NodeType.END) {
             logs.push({
                step: step++,
                nodeId: currentNode.id,
                nodeType: currentNode.type || 'unknown',
                label: currentNode.data.label,
                status: 'failure',
                message: 'Flow stopped unexpectedly. No outgoing path.',
                timestamp: new Date().toISOString(),
             });
          }
          currentNode = undefined;
        }
      }

      resolve({
        success: errors.length === 0,
        logs,
        errors: errors.length > 0 ? errors : undefined,
      });
    }, 1000); // Simulate processing time
  });
};
