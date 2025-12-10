import React, { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { WorkflowProvider, useWorkflow } from './context/WorkflowContext';
import WorkflowCanvas from './components/canvas/WorkflowCanvas';
import Sidebar from './components/sidebar/Sidebar';
import PropertiesPanel from './components/forms/PropertiesPanel';
import SimulationPanel from './components/sandbox/SimulationPanel';
import { Play, Download, Trash2, Layout } from 'lucide-react';

const HeaderButton = ({ 
  icon: Icon, 
  label, 
  onClick, 
  variant = 'secondary' 
}: { 
  icon: any, 
  label: string, 
  onClick: () => void, 
  variant?: 'primary' | 'secondary' | 'danger' 
}) => {
  const baseClasses = "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all shadow-sm";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
    danger: "bg-white border border-red-200 text-red-600 hover:bg-red-50"
  };

  return (
    <button onClick={onClick} className={`${baseClasses} ${variants[variant]}`}>
      <Icon size={14} />
      {label}
    </button>
  );
};

const WorkflowEditor = () => {
  const { nodes, edges, resetCanvas } = useWorkflow();
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ nodes, edges }, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "workflow.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50 text-slate-900 font-sans">
      {/* 1. Top Navigation Bar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 justify-between flex-shrink-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
            <Layout size={18} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 leading-tight">HR Workflow Designer</h1>
            <p className="text-[10px] text-gray-400 font-medium">Auto-saving enabled</p>
          </div>
        </div>
        
        <div className="flex gap-2">
           <HeaderButton 
             icon={Trash2} 
             label="Reset Canvas" 
             onClick={resetCanvas} 
             variant="danger" 
           />
           <HeaderButton 
             icon={Download} 
             label="Export JSON" 
             onClick={handleExport} 
           />
           <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
           <HeaderButton 
             icon={Play} 
             label={isSimulationOpen ? "Hide Test" : "Test Workflow"} 
             onClick={() => setIsSimulationOpen(!isSimulationOpen)} 
             variant="primary" 
           />
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 2. Left Sidebar */}
        <Sidebar />

        {/* 3. Center Canvas */}
        <div className="flex-1 relative flex flex-col">
          <WorkflowCanvas />
          
          {/* 5. Bottom Execution Log Panel */}
          <SimulationPanel isOpen={isSimulationOpen} onClose={() => setIsSimulationOpen(false)} />
        </div>

        {/* 4. Right Configuration Panel */}
        <PropertiesPanel />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ReactFlowProvider>
      <WorkflowProvider>
        <WorkflowEditor />
      </WorkflowProvider>
    </ReactFlowProvider>
  );
};

export default App;