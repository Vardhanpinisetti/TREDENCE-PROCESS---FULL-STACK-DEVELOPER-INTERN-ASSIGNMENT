import React, { useState, useEffect } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { validateWorkflow } from '../../utils/workflowUtils';
import { simulateWorkflow } from '../../services/api';
import { SimulationLog } from '../../types';
import { PlayCircle, AlertTriangle, CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';

interface SimulationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({ isOpen, onClose }) => {
  const { nodes, edges, setValidationErrors, clearValidationErrors } = useWorkflow();
  const [logs, setLogs] = useState<SimulationLog[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [simulationStatus, setSimulationStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

  // Auto-run logic when opened
  useEffect(() => {
    if (isOpen) {
      handleRunSimulation();
    } else {
        // Reset state on close if needed
        setSimulationStatus('idle');
    }
  }, [isOpen]);

  const handleRunSimulation = async () => {
    setLogs([]);
    setErrors([]);
    setSimulationStatus('running');
    setIsSimulating(true);
    clearValidationErrors();

    const validation = validateWorkflow(nodes, edges);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setValidationErrors(validation.invalidNodeIds);
      setIsSimulating(false);
      setSimulationStatus('error');
      return;
    }

    try {
      const result = await simulateWorkflow(nodes, edges);
      setLogs(result.logs);
      setSimulationStatus('success');
    } catch (error) {
      setErrors(["Simulation API failed"]);
      setSimulationStatus('error');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className={`absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out z-30 flex flex-col ${isOpen ? 'h-72' : 'h-0 overflow-hidden'}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${
                simulationStatus === 'running' ? 'bg-blue-500 animate-pulse' :
                simulationStatus === 'success' ? 'bg-green-500' :
                simulationStatus === 'error' ? 'bg-red-500' : 'bg-gray-300'
             }`} />
             <h3 className="text-sm font-bold text-gray-800">Execution Log</h3>
          </div>
          {simulationStatus === 'error' && <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 font-medium">Validation Failed</span>}
          {simulationStatus === 'success' && <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100 font-medium">Workflow Completed</span>}
        </div>
        
        <div className="flex gap-2">
           <button 
             onClick={handleRunSimulation} 
             disabled={isSimulating}
             className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded hover:bg-gray-50 text-gray-700 transition-colors disabled:opacity-50"
           >
              {isSimulating ? <Loader2 size={12} className="animate-spin" /> : <PlayCircle size={12} />}
              Rerun
           </button>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">✕</button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 bg-white custom-scrollbar">
         {/* Validation Errors */}
         {errors.length > 0 && (
            <div className="max-w-2xl mx-auto mb-4 bg-red-50 border border-red-100 rounded-lg p-4 flex gap-3 animate-fadeIn">
              <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
              <div>
                 <h4 className="text-sm font-bold text-red-800 mb-1">Cannot run workflow</h4>
                 <ul className="text-xs text-red-600 list-disc list-inside space-y-1">
                    {errors.map((err, i) => <li key={i}>{err}</li>)}
                 </ul>
              </div>
            </div>
         )}

         {/* Timeline View */}
         {logs.length > 0 && (
            <div className="flex items-start gap-4 min-w-max pb-4">
              {logs.map((log, index) => (
                <div 
                  key={log.stepId} 
                  className="flex items-start group animate-slideUp" 
                  style={{ animationDelay: `${index * 150}ms`, opacity: 0 }}
                >
                   {/* Connection Line */}
                   {index > 0 && (
                      <div className="mt-4 w-8 h-0.5 bg-gray-200 mr-4 self-center" />
                   )}
                   
                   {/* Step Card */}
                   <div className="relative flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm z-10 ${
                         log.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                         {log.status === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      </div>
                      
                      <div className="mt-3 w-48 p-3 rounded-lg border border-gray-100 bg-white shadow-sm group-hover:shadow-md group-hover:border-blue-200 transition-all">
                         <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{log.nodeType}</span>
                            <span className="text-[10px] text-gray-300 tabular-nums">{log.timestamp.split('T')[1].split('.')[0]}</span>
                         </div>
                         <div className="text-sm font-bold text-gray-800 mb-1 truncate" title={log.nodeLabel}>{log.nodeLabel}</div>
                         <div className="text-xs text-gray-500 line-clamp-2" title={log.message}>{log.message}</div>
                      </div>
                   </div>
                   
                   {/* Arrow for next step */}
                   {index < logs.length - 1 && (
                      <div className="mt-8 ml-4 text-gray-300">
                         <ArrowRight size={16} />
                      </div>
                   )}
                </div>
              ))}
              
              {/* End Flag */}
              {simulationStatus === 'success' && (
                 <div className="flex items-center gap-4 animate-slideUp" style={{ animationDelay: `${logs.length * 150}ms`, opacity: 0 }}>
                    <div className="w-8 h-0.5 bg-gray-200" />
                    <div className="px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-full shadow-lg">
                       FINISH
                    </div>
                 </div>
              )}
            </div>
         )}
      </div>
    </div>
  );
};

export default SimulationPanel;