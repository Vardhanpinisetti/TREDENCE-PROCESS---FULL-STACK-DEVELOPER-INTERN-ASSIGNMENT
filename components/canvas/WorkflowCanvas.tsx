import React, { useCallback, useRef } from 'react';
import ReactFlow, { 
  Background, 
  BackgroundVariant,
  Controls, 
  MiniMap, 
  Connection, 
  addEdge, 
  NodeTypes,
  ReactFlowInstance,
  Panel
} from 'reactflow';
import { useWorkflow } from '../../context/WorkflowContext';
import { StartNode, TaskNode, ApprovalNode, AutomatedNode, EndNode } from './CustomNodes';
import { generateId } from '../../utils/workflowUtils';
import { NodeType } from '../../types';

const nodeTypes: NodeTypes = {
  [NodeType.START]: StartNode,
  [NodeType.TASK]: TaskNode,
  [NodeType.APPROVAL]: ApprovalNode,
  [NodeType.AUTOMATED]: AutomatedNode,
  [NodeType.END]: EndNode,
};

const WorkflowCanvas: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    setEdges, 
    addNode, 
    setSelectedNodeId, 
    selectedNodeId 
  } = useWorkflow();
  
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        return;
      }

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      const newNode = {
        id: generateId(),
        type,
        position,
        data: { label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node` },
      };

      addNode(newNode);
      setSelectedNodeId(newNode.id);
    },
    [reactFlowInstance, addNode, setSelectedNodeId]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: any) => {
    setSelectedNodeId(node.id);
  }, [setSelectedNodeId]);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  return (
    <div className="flex-grow h-full relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid={true}
        snapGrid={[15, 15]}
        defaultEdgeOptions={{ type: 'smoothstep', animated: true, style: { stroke: '#b1b1b7', strokeWidth: 2 } }}
      >
        <Background gap={20} size={1} variant={BackgroundVariant.Dots} color="#e5e7eb" />
        <Controls className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden" />
        <MiniMap 
           zoomable 
           pannable 
           className="bg-white border border-gray-200 rounded-lg shadow-sm" 
           maskColor="rgba(240, 242, 245, 0.7)"
           nodeColor={(n) => {
             if (n.type === NodeType.START) return '#10b981';
             if (n.type === NodeType.END) return '#f43f5e';
             if (n.type === NodeType.TASK) return '#3b82f6';
             if (n.type === NodeType.APPROVAL) return '#f59e0b';
             return '#a855f7';
           }}
        />
        <Panel position="top-right" className="m-4">
           {selectedNodeId ? (
             <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border border-blue-100 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                Node Selected
             </div>
           ) : (
             <div className="bg-white text-gray-500 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm border border-gray-200">
                Canvas Ready
             </div>
           )}
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default WorkflowCanvas;