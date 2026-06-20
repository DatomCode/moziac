import { ReactFlow, Controls, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import NoteNode from './NoteNode';
import ConnectionEdge from './ConnectionEdge';
import { useAppStore } from '../../store/useAppStore';
import { useEffect } from 'react';

const nodeTypes = {
  noteNode: NoteNode,
};

const edgeTypes = {
  connectionEdge: ConnectionEdge,
};

export default function BoardCanvas() {
  const { notes, edges: storeEdges, updateNotePosition } = useAppStore();
  
  const [nodes, setNodes, onNodesChange] = useNodesState(notes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);

  useEffect(() => {
    setNodes(notes);
  }, [notes, setNodes]);

  const handleNodeDragStop = (event, node) => {
    updateNotePosition(node.id, node.position);
  };

  return (
    <div className="flex-1 w-full h-full graph-paper-bg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={handleNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Controls 
          className="bg-slate-900 border-slate-700 fill-slate-300 shadow-xl" 
          showInteractive={false} 
        />
      </ReactFlow>
    </div>
  );
}
