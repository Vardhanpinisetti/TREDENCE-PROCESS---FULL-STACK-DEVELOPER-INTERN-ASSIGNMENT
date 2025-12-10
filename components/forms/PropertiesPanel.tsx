import React, { useEffect, useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { NodeType, AutomationAction } from '../../types';
import { fetchAutomations } from '../../services/api';
import { X, Plus, Trash2, Settings, ChevronRight } from 'lucide-react';

const KeyValueEditor = ({ 
  title, 
  data = {}, 
  onChange 
}: { 
  title: string; 
  data?: Record<string, string>; 
  onChange: (d: Record<string, string>) => void; 
}) => {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAdd = () => {
    if (newKey.trim()) {
      onChange({ ...data, [newKey]: newValue });
      setNewKey('');
      setNewValue('');
    }
  };

  const handleDelete = (key: string) => {
    const next = { ...data };
    delete next[key];
    onChange(next);
  };

  return (
    <div className="space-y-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</label>
      <div className="space-y-2">
        {Object.entries(data).map(([k, v]) => (
          <div key={k} className="flex gap-2 items-center group">
            <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white border border-gray-200 px-2 py-1.5 rounded text-gray-600 font-medium truncate">{k}</div>
              <div className="bg-white border border-gray-200 px-2 py-1.5 rounded text-gray-800 truncate">{v}</div>
            </div>
            <button onClick={() => handleDelete(k)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <div className="flex gap-2 items-center">
          <input 
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="Key"
            className="w-1/3 p-1.5 border border-gray-200 rounded text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
          />
          <input 
             value={newValue}
             onChange={(e) => setNewValue(e.target.value)}
             placeholder="Value"
             className="flex-1 p-1.5 border border-gray-200 rounded text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
          />
          <button 
            onClick={handleAdd}
            disabled={!newKey.trim()}
            className="text-blue-600 hover:text-blue-800 disabled:text-gray-300 p-1"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const PropertiesPanel: React.FC = () => {
  const { selectedNodeId, nodes, updateNodeData, setSelectedNodeId, setNodes } = useWorkflow();
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  
  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  useEffect(() => {
    fetchAutomations().then(setAutomations);
  }, []);

  const handleDelete = () => {
    setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));
    setSelectedNodeId(null);
  };

  const handleChange = (field: string, value: any) => {
    if (selectedNode) {
      updateNodeData(selectedNode.id, { [field]: value });
    }
  };

  // Render Logic
  const renderFields = () => {
    if (!selectedNode) return null;

    switch (selectedNode.type) {
      case NodeType.START:
        return (
          <div className="space-y-6">
             <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-100">
               <strong>Trigger:</strong> This node initiates the workflow process.
             </div>
             <KeyValueEditor 
                title="Start Metadata" 
                data={selectedNode.data.metadata} 
                onChange={(d) => handleChange('metadata', d)} 
             />
          </div>
        );
      
      case NodeType.TASK:
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
              <textarea 
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
                rows={4}
                value={selectedNode.data.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe the task details..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Assignee</label>
              <input 
                type="text"
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                value={selectedNode.data.assignee || ''}
                onChange={(e) => handleChange('assignee', e.target.value)}
                placeholder="e.g. Hiring Manager"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Due Date</label>
              <input 
                type="date"
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                value={selectedNode.data.dueDate || ''}
                onChange={(e) => handleChange('dueDate', e.target.value)}
              />
            </div>
            <KeyValueEditor 
                title="Custom Fields" 
                data={selectedNode.data.customFields} 
                onChange={(d) => handleChange('customFields', d)} 
             />
          </div>
        );

      case NodeType.APPROVAL:
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Approver Role</label>
              <div className="relative">
                <select 
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 appearance-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                  value={selectedNode.data.approverRole || ''}
                  onChange={(e) => handleChange('approverRole', e.target.value)}
                >
                  <option value="">Select Role...</option>
                  <option value="HR Manager">HR Manager</option>
                  <option value="Department Head">Department Head</option>
                  <option value="Finance Director">Finance Director</option>
                  <option value="CTO">CTO</option>
                </select>
                <div className="absolute right-3 top-3 pointer-events-none text-gray-400">
                  <ChevronRight size={14} className="rotate-90" />
                </div>
              </div>
            </div>
            <div>
               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Auto-Approve Threshold</label>
               <div className="flex items-center gap-2">
                 <span className="text-gray-400 text-sm">$</span>
                 <input 
                  type="number"
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                  value={selectedNode.data.autoApproveThreshold || ''}
                  onChange={(e) => handleChange('autoApproveThreshold', e.target.value)}
                  placeholder="0.00"
                />
               </div>
            </div>
          </div>
        );

      case NodeType.AUTOMATED:
        const selectedAction = automations.find(a => a.id === selectedNode.data.actionId);
        return (
          <div className="space-y-5">
             <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Automation Action</label>
              <div className="relative">
                <select 
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 appearance-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                  value={selectedNode.data.actionId || ''}
                  onChange={(e) => handleChange('actionId', e.target.value)}
                >
                  <option value="">Select Action...</option>
                  {automations.map(a => (
                    <option key={a.id} value={a.id}>{a.label}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-3 pointer-events-none text-gray-400">
                   <ChevronRight size={14} className="rotate-90" />
                </div>
              </div>
            </div>
            {selectedAction && (
               <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-800 uppercase tracking-wide">
                     <Settings size={12} />
                     Parameters
                  </div>
                  {selectedAction.params.map(param => (
                    <div key={param}>
                       <label className="block text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-wider">{param.replace('_', ' ')}</label>
                       <input 
                         type="text"
                         className="w-full p-2 border border-purple-200 rounded-md text-sm text-gray-800 placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white transition-all"
                         placeholder={`Enter ${param}...`}
                         value={selectedNode.data.actionParams?.[param] || ''}
                         onChange={(e) => {
                            const newParams = { ...selectedNode.data.actionParams, [param]: e.target.value };
                            handleChange('actionParams', newParams);
                         }}
                       />
                    </div>
                  ))}
               </div>
            )}
          </div>
        );

      case NodeType.END:
        return (
          <div className="space-y-5">
             <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Completion Message</label>
              <input 
                type="text"
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                value={selectedNode.data.endMessage || ''}
                onChange={(e) => handleChange('endMessage', e.target.value)}
                placeholder="e.g. Workflow Success"
              />
            </div>
             <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
              <input 
                type="checkbox"
                id="isSummary"
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                checked={selectedNode.data.isSummary || false}
                onChange={(e) => handleChange('isSummary', e.target.checked)}
              />
              <label htmlFor="isSummary" className="text-sm font-medium text-gray-700 select-none cursor-pointer">Generate Summary Report</label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className={`fixed top-[56px] right-0 bottom-0 w-96 bg-white border-l border-gray-200 shadow-2xl transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${
        selectedNodeId ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {selectedNode ? (
        <>
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Edit Node</h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{selectedNode.type} configuration</p>
            </div>
            <button onClick={() => setSelectedNodeId(null)} className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Node Label</label>
              <input 
                type="text"
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                value={selectedNode.data.label}
                onChange={(e) => handleChange('label', e.target.value)}
              />
            </div>

            <div className="border-t border-gray-100 pt-6">
              {renderFields()}
            </div>
          </div>

          <div className="p-5 border-t border-gray-100 bg-gray-50">
            <button 
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 hover:border-red-300 transition-all shadow-sm"
            >
              <Trash2 size={16} />
              Delete Node
            </button>
          </div>
        </>
      ) : (
         <div className="flex-1 flex items-center justify-center text-gray-400">
            {/* Empty state holder if needed, usually hidden by transform */}
         </div>
      )}
    </div>
  );
};

export default PropertiesPanel;