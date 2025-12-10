import React from 'react';
import { Play, CheckSquare, FileCheck, Zap, Flag, GripVertical } from 'lucide-react';
import { NodeType } from '../../types';

const SidebarItem = ({ type, label, icon: Icon, colorClass, borderClass }: { type: NodeType; label: string; icon: any; colorClass: string; borderClass: string }) => {
  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 mb-3 bg-white border border-gray-100 rounded-xl shadow-sm cursor-grab hover:shadow-md hover:border-blue-300 transition-all group relative overflow-hidden`}
      onDragStart={(event) => onDragStart(event, type)}
      draggable
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${borderClass}`} />
      <div className={`p-2 rounded-lg ${colorClass}`}>
        <Icon size={16} className="text-gray-700" />
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <GripVertical size={14} className="ml-auto text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-full bg-white border-r border-gray-200 flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Toolbox</h2>
        <p className="text-xs text-gray-500 mt-1">Drag nodes to build flow</p>
      </div>
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        <div className="mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Triggers & Ends</div>
        <SidebarItem type={NodeType.START} label="Start Node" icon={Play} colorClass="bg-emerald-50 text-emerald-600" borderClass="bg-emerald-500" />
        <SidebarItem type={NodeType.END} label="End Node" icon={Flag} colorClass="bg-rose-50 text-rose-600" borderClass="bg-rose-500" />
        
        <div className="mt-6 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Actions</div>
        <SidebarItem type={NodeType.TASK} label="Task Node" icon={CheckSquare} colorClass="bg-blue-50 text-blue-600" borderClass="bg-blue-500" />
        <SidebarItem type={NodeType.APPROVAL} label="Approval Node" icon={FileCheck} colorClass="bg-amber-50 text-amber-600" borderClass="bg-amber-500" />
        <SidebarItem type={NodeType.AUTOMATED} label="Automated Step" icon={Zap} colorClass="bg-purple-50 text-purple-600" borderClass="bg-purple-500" />
      </div>
    </aside>
  );
};

export default Sidebar;