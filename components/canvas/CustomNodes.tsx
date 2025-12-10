import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Play, CheckSquare, FileCheck, Zap, Flag, AlertCircle } from 'lucide-react';
import { NodeData } from '../../types';

const NodeWrapper = ({ 
  children, 
  selected, 
  title, 
  icon: Icon,
  colorClass,
  hasError
}: { 
  children?: React.ReactNode;
  selected: boolean;
  title: string;
  icon: any;
  colorClass: string;
  hasError?: boolean;
}) => (
  <div className={`w-64 shadow-md rounded-md bg-white border-2 transition-all relative ${
    hasError 
      ? 'border-red-500 ring-2 ring-red-200' 
      : selected 
        ? 'border-blue-500 ring-2 ring-blue-200' 
        : 'border-gray-200'
  } `}>
    {hasError && (
      <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 shadow-sm z-10">
        <AlertCircle size={16} />
      </div>
    )}
    <div className={`flex items-center gap-2 px-3 py-2 rounded-t-sm border-b border-gray-100 ${colorClass} text-white`}>
      <Icon size={16} />
      <span className="text-sm font-semibold">{title}</span>
    </div>
    <div className="p-3">
      {children}
    </div>
  </div>
);

export const StartNode = memo(({ data, selected }: NodeProps<NodeData>) => {
  return (
    <NodeWrapper selected={selected} title={data.label} icon={Play} colorClass="bg-emerald-500" hasError={data.hasError}>
      <div className="text-xs text-gray-500">Workflow Entry Point</div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-emerald-500" />
    </NodeWrapper>
  );
});

export const TaskNode = memo(({ data, selected }: NodeProps<NodeData>) => {
  return (
    <NodeWrapper selected={selected} title={data.label} icon={CheckSquare} colorClass="bg-blue-500" hasError={data.hasError}>
      <div className="text-xs text-gray-600 mb-1 line-clamp-2">{data.description || 'No description'}</div>
      {data.assignee && (
        <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block mt-1">
          👤 {data.assignee}
        </div>
      )}
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-400" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
    </NodeWrapper>
  );
});

export const ApprovalNode = memo(({ data, selected }: NodeProps<NodeData>) => {
  return (
    <NodeWrapper selected={selected} title={data.label} icon={FileCheck} colorClass="bg-amber-500" hasError={data.hasError}>
       <div className="text-xs text-gray-600">
          Role: <span className="font-medium">{data.approverRole || 'Unassigned'}</span>
       </div>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-400" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-amber-500" />
    </NodeWrapper>
  );
});

export const AutomatedNode = memo(({ data, selected }: NodeProps<NodeData>) => {
  return (
    <NodeWrapper selected={selected} title={data.label} icon={Zap} colorClass="bg-purple-500" hasError={data.hasError}>
      <div className="text-xs text-gray-600 italic">
        {data.actionId ? `Action: ${data.actionId}` : 'No action configured'}
      </div>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-400" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-purple-500" />
    </NodeWrapper>
  );
});

export const EndNode = memo(({ data, selected }: NodeProps<NodeData>) => {
  return (
    <NodeWrapper selected={selected} title={data.label} icon={Flag} colorClass="bg-rose-500" hasError={data.hasError}>
      <div className="text-xs text-gray-500">Workflow Completion</div>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-400" />
    </NodeWrapper>
  );
});