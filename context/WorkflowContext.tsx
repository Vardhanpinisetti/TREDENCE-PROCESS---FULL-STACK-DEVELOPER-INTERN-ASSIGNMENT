import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef } from 'react';
import { useNodesState, useEdgesState, OnNodesChange, OnEdgesChange, Node, Edge } from 'reactflow';
import { WorkflowNode, WorkflowEdge, NodeData } from '../types';

interface WorkflowContextType {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addNode: (node: WorkflowNode) => void;
  setNodes: React.Dispatch<React.SetStateAction<Node<NodeData, string | undefined>[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge<any>[]>>;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  updateNodeData: (id: string, newData: Partial<NodeData>) => void;
  setValidationErrors: (invalidIds: string[]) => void;
  clearValidationErrors: () => void;
  resetCanvas: () => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

const STORAGE_KEY = 'hr_workflow_data';
const AUTOSAVE_INTERVAL = 30000; // 30 seconds

export const WorkflowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Refs to hold current state for the interval closure
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);

  useEffect(() => {
    nodesRef.current = nodes;
    edgesRef.current = edges;
  }, [nodes, edges]);

  // Load from Storage on Mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedData);
        setNodes(savedNodes || []);
        setEdges(savedEdges || []);
      } catch (e) {
        console.error("Failed to load workflow data", e);
      }
    }
  }, [setNodes, setEdges]);

  // Auto-save Interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      const dataToSave = {
        nodes: nodesRef.current,
        edges: edgesRef.current
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      console.log(`[AutoSave] Workflow saved at ${new Date().toLocaleTimeString()}`);
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  const addNode = useCallback((node: WorkflowNode) => {
    setNodes((nds) => nds.concat(node));
  }, [setNodes]);

  const updateNodeData = useCallback((id: string, newData: Partial<NodeData>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      })
    );
  }, [setNodes]);

  const setValidationErrors = useCallback((invalidIds: string[]) => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          hasError: invalidIds.includes(node.id),
        },
      }))
    );
  }, [setNodes]);

  const clearValidationErrors = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          hasError: false,
        },
      }))
    );
  }, [setNodes]);

  const resetCanvas = useCallback(() => {
    if (window.confirm("Are you sure you want to clear the canvas? This cannot be undone.")) {
      setNodes([]);
      setEdges([]);
      setSelectedNodeId(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [setNodes, setEdges]);

  return (
    <WorkflowContext.Provider
      value={{
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        addNode,
        setNodes,
        setEdges,
        selectedNodeId,
        setSelectedNodeId,
        updateNodeData,
        setValidationErrors,
        clearValidationErrors,
        resetCanvas
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};