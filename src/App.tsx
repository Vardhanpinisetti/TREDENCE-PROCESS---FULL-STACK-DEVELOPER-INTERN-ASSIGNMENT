// src/App.tsx
import React, {
  FC,
  useCallback,
  useState,
  ChangeEvent,
  useEffect,
} from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  addEdge,
  useNodesState,
  useEdgesState,
} from "reactflow";
import type { Node, Edge, Connection } from "reactflow";
import "reactflow/dist/style.css";

type NodeKind = "start" | "task" | "approval" | "automated" | "end";

type NodeConfig = Record<string, any>;

type NodeData = {
  kind: NodeKind;
  label: string;
  config: NodeConfig;
};

type RFNode = Node<NodeData>;

// ---------- Custom node components ----------

type NodeComponentProps = { data: NodeData };

const baseNodeStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 8,
  fontSize: 12,
  minWidth: 160,
  textAlign: "center",
};

const StartNode: FC<NodeComponentProps> = ({ data }) => (
  <div
    style={{
      ...baseNodeStyle,
      borderRadius: 999,
      border: "2px solid #16a34a",
      background: "#dcfce7",
      fontWeight: 600,
    }}
  >
    <Handle type="source" position={Position.Bottom} />
    🚀 {data.label || "Start"}
  </div>
);

const TaskNode: FC<NodeComponentProps> = ({ data }) => (
  <div
    style={{
      ...baseNodeStyle,
      border: "1px solid #4b5563",
      background: "#111827",
      color: "white",
    }}
  >
    <Handle type="target" position={Position.Top} />
    <Handle type="source" position={Position.Bottom} />
    📝 {data.label || "Task"}
  </div>
);

const ApprovalNode: FC<NodeComponentProps> = ({ data }) => (
  <div
    style={{
      ...baseNodeStyle,
      border: "1px solid #6366f1",
      background: "#e0e7ff",
    }}
  >
    <Handle type="target" position={Position.Top} />
    <Handle type="source" position={Position.Bottom} />
    ✅ {data.label || "Approval"}
  </div>
);

const AutomatedNode: FC<NodeComponentProps> = ({ data }) => (
  <div
    style={{
      ...baseNodeStyle,
      border: "1px dashed #0ea5e9",
      background: "#e0f2fe",
    }}
  >
    <Handle type="target" position={Position.Top} />
    <Handle type="source" position={Position.Bottom} />
    🤖 {data.label || "Automated"}
  </div>
);

const EndNode: FC<NodeComponentProps> = ({ data }) => (
  <div
    style={{
      ...baseNodeStyle,
      borderRadius: 999,
      border: "2px solid #b91c1c",
      background: "#fee2e2",
      fontWeight: 600,
    }}
  >
    <Handle type="target" position={Position.Top} />
    🏁 {data.label || "End"}
  </div>
);

const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};

// ---------- Sidebar ----------

const sidebarButton: React.CSSProperties = {
  width: "100%",
  padding: "6px 10px",
  marginBottom: 8,
  borderRadius: 6,
  border: "1px solid #374151",
  background: "#111827",
  color: "white",
  fontSize: 12,
  cursor: "pointer",
  textAlign: "left",
};

const Sidebar: FC<{ onAddNode: (kind: NodeKind) => void }> = ({
  onAddNode,
}) => (
  <div
    style={{
      width: 220,
      padding: 12,
      borderRight: "1px solid #1f2933",
      background: "#020617",
      color: "white",
      height: "100vh",
      boxSizing: "border-box",
    }}
  >
    <h2 style={{ fontSize: 14, marginBottom: 12 }}>Node Palette</h2>
    <button style={sidebarButton} onClick={() => onAddNode("start")}>
      🚀 Start Node
    </button>
    <button style={sidebarButton} onClick={() => onAddNode("task")}>
      📝 Task Node
    </button>
    <button style={sidebarButton} onClick={() => onAddNode("approval")}>
      ✅ Approval Node
    </button>
    <button style={sidebarButton} onClick={() => onAddNode("automated")}>
      🤖 Automated Step Node
    </button>
    <button style={sidebarButton} onClick={() => onAddNode("end")}>
      🏁 End Node
    </button>
  </div>
);

// ---------- Node Config Panel ----------

type ConfigPanelProps = {
  node: RFNode | null;
  onUpdate: (patch: Partial<NodeData["config"]> & { label?: string }) => void;
};

const labelCss: React.CSSProperties = {
  fontSize: 11,
  color: "#9ca3af",
  marginTop: 8,
  marginBottom: 4,
  display: "block",
};

const inputCss: React.CSSProperties = {
  width: "100%",
  padding: "6px 8px",
  borderRadius: 4,
  border: "1px solid #4b5563",
  background: "#020617",
  color: "white",
  fontSize: 12,
  boxSizing: "border-box",
};

const NodeConfigPanel: FC<ConfigPanelProps> = ({ node, onUpdate }) => {
  if (!node) {
    return (
      <div style={{ padding: 12, color: "#9ca3af", fontSize: 12 }}>
        Select a node to edit it.
      </div>
    );
  }

  const { kind, label, config } = node.data;

  const handleFieldChange =
    (field: string) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        e.currentTarget.type === "checkbox"
          ? (e.currentTarget as HTMLInputElement).checked
          : e.currentTarget.value;

      if (field === "label") {
        onUpdate({ label: value as string });
      } else {
        onUpdate({ [field]: value });
      }
    };

  return (
    <div style={{ padding: 12, color: "white", fontSize: 12 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
        Node Details
      </div>
      <div style={{ fontSize: 11, marginBottom: 8, color: "#9ca3af" }}>
        Type: <strong>{kind.toUpperCase()}</strong>
      </div>

      {/* Common label */}
      <label style={labelCss}>Label</label>
      <input style={inputCss} value={label} onChange={handleFieldChange("label")} />

      {/* Type-specific fields */}
      {kind === "start" && (
        <>
          <label style={labelCss}>Start Title</label>
          <input
            style={inputCss}
            value={config.startTitle || ""}
            onChange={handleFieldChange("startTitle")}
          />
          <label style={labelCss}>Metadata (key=value, comma separated)</label>
          <textarea
            style={{ ...inputCss, minHeight: 60 }}
            value={config.metadata || ""}
            onChange={handleFieldChange("metadata")}
          />
        </>
      )}

      {kind === "task" && (
        <>
          <label style={labelCss}>Title</label>
          <input
            style={inputCss}
            value={config.title || ""}
            onChange={handleFieldChange("title")}
          />
          <label style={labelCss}>Description</label>
          <textarea
            style={{ ...inputCss, minHeight: 60 }}
            value={config.description || ""}
            onChange={handleFieldChange("description")}
          />
          <label style={labelCss}>Assignee</label>
          <input
            style={inputCss}
            value={config.assignee || ""}
            onChange={handleFieldChange("assignee")}
          />
          <label style={labelCss}>Due Date</label>
          <input
            type="date"
            style={inputCss}
            value={config.dueDate || ""}
            onChange={handleFieldChange("dueDate")}
          />
          <label style={labelCss}>Custom Fields (key=value)</label>
          <textarea
            style={{ ...inputCss, minHeight: 60 }}
            value={config.customFields || ""}
            onChange={handleFieldChange("customFields")}
          />
        </>
      )}

      {kind === "approval" && (
        <>
          <label style={labelCss}>Title</label>
          <input
            style={inputCss}
            value={config.title || ""}
            onChange={handleFieldChange("title")}
          />
          <label style={labelCss}>Approver Role</label>
          <input
            style={inputCss}
            value={config.approverRole || ""}
            onChange={handleFieldChange("approverRole")}
            placeholder="Manager, HRBP, Director..."
          />
          <label style={labelCss}>Auto-approve Threshold</label>
          <input
            type="number"
            style={inputCss}
            value={config.threshold ?? ""}
            onChange={handleFieldChange("threshold")}
          />
        </>
      )}

      {kind === "automated" && (
        <>
          <label style={labelCss}>Title</label>
          <input
            style={inputCss}
            value={config.title || ""}
            onChange={handleFieldChange("title")}
          />
          <label style={labelCss}>Action ID</label>
          <input
            style={inputCss}
            value={config.actionId || ""}
            onChange={handleFieldChange("actionId")}
            placeholder="send_email, generate_doc..."
          />
          <label style={labelCss}>Action Params (JSON / key=value)</label>
          <textarea
            style={{ ...inputCss, minHeight: 60 }}
            value={config.params || ""}
            onChange={handleFieldChange("params")}
          />
        </>
      )}

      {kind === "end" && (
        <>
          <label style={labelCss}>End Message</label>
          <input
            style={inputCss}
            value={config.message || ""}
            onChange={handleFieldChange("message")}
          />
          <label style={labelCss}>
            <input
              type="checkbox"
              style={{ marginRight: 6 }}
              checked={!!config.summary}
              onChange={handleFieldChange("summary")}
            />
            Include in summary
          </label>
        </>
      )}
    </div>
  );
};

// ---------- Initial nodes ----------

const initialNodes: RFNode[] = [
  {
    id: "1",
    type: "start",
    position: { x: 350, y: 80 },
    data: {
      kind: "start",
      label: "Start",
      config: {},
    },
  },
];

// ---------- Main App ----------

const App: FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<RFNode[]>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [selectedId, setSelectedId] = useState<string>("1");

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const labelByKind: Record<NodeKind, string> = {
    start: "Start",
    task: "Task",
    approval: "Approval",
    automated: "Automated Step",
    end: "End",
  };

  const handleAddNode = (kind: NodeKind) => {
    setNodes((prev) => {
      const newNode: RFNode = {
        id: crypto.randomUUID(),
        type: kind,
        position: { x: 350, y: 80 + prev.length * 80 },
        data: {
          kind,
          label: labelByKind[kind],
          config: {},
        },
      };
      return [...prev, newNode];
    });
  };

  const handleNodeClick = (_: React.MouseEvent, node: RFNode) => {
    setSelectedId(node.id);
  };

  const selectedNode = nodes.find((n) => n.id === selectedId) || null;

  const updateSelectedConfig: ConfigPanelProps["onUpdate"] = (patch) => {
    if (!selectedNode) return;
    const id = selectedNode.id;

    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;

        const newLabel =
          typeof patch.label === "string" ? patch.label : n.data.label;

        const { label, ...rest } = patch;

        return {
          ...n,
          data: {
            ...n.data,
            label: newLabel,
            config: {
              ...n.data.config,
              ...rest,
            },
          },
        };
      })
    );
  };

  // ---------- Delete selected node with Delete/Backspace ----------

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selectedId) return;
      if (e.key === "Delete" || e.key === "Backspace") {
        setNodes((prev) => prev.filter((n) => n.id !== selectedId));
        setEdges((prev) =>
          prev.filter(
            (edge) =>
              edge.source !== selectedId && edge.target !== selectedId
          )
        );
        setSelectedId("");
      }
    },
    [selectedId, setNodes, setEdges]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // ---------- Export / Import / Simulate ----------

  const handleExport = () => {
    const workflow = {
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.data.kind,
        label: n.data.label,
        config: n.data.config,
        position: n.position,
      })),
      edges,
    };

    navigator.clipboard.writeText(JSON.stringify(workflow, null, 2));
    alert("Workflow JSON copied to clipboard.");
  };

  const handleImport = () => {
    const json = prompt("Paste workflow JSON:");
    if (!json) return;

    try {
      const parsed = JSON.parse(json);
      setNodes(
        parsed.nodes.map((n: any) => ({
          id: n.id,
          type: n.type,
          position: n.position,
          data: {
            kind: n.type as NodeKind,
            label: n.label,
            config: n.config || {},
          },
        }))
      );
      setEdges(parsed.edges || []);
      alert("Workflow loaded.");
    } catch (err) {
      alert("Invalid JSON. Please check and try again.");
    }
  };

  const handleSimulate = () => {
    const steps = [...nodes]
      .sort((a, b) => a.position.y - b.position.y)
      .map((n) => {
        const cfg = n.data.config || {};
        switch (n.data.kind) {
          case "start":
            return `🚀 Start: ${n.data.label}`;
          case "task":
            return `📝 Task: ${n.data.label} — Assignee: ${
              cfg.assignee || "Unassigned"
            }`;
          case "approval":
            return `✅ Approval: ${n.data.label} — Role: ${
              cfg.approverRole || "N/A"
            }`;
          case "automated":
            return `🤖 Automated: ${n.data.label} — Action: ${
              cfg.actionId || "none"
            }`;
          case "end":
            return `🏁 End: ${n.data.label}`;
          default:
            return n.data.label;
        }
      });

    alert(steps.join("\n"));
  };

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      <Sidebar onAddNode={handleAddNode} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            padding: 8,
            display: "flex",
            gap: 8,
            borderBottom: "1px solid #1f2933",
            background: "#020617",
          }}
        >
          <button onClick={handleExport}>💾 Export</button>
          <button onClick={handleImport}>📂 Import</button>
          <button onClick={handleSimulate}>▶️ Simulate</button>
        </div>

        {/* Canvas */}
        <div style={{ flex: 1 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            fitView
          >
            <Background />
            <MiniMap pannable zoomable />
            <Controls />
          </ReactFlow>
        </div>
      </div>

      <div
        style={{
          width: 280,
          borderLeft: "1px solid #1f2933",
          background: "#020617",
          height: "100vh",
          boxSizing: "border-box",
        }}
      >
        <NodeConfigPanel node={selectedNode} onUpdate={updateSelectedConfig} />
      </div>
    </div>
  );
};

export default App;
