import { ReactFlow, Controls, useNodesState, useEdgesState, useReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import NoteNode from './NoteNode';
import TextNode from './TextNode';
import ConnectionEdge from './ConnectionEdge';
import EdgeEditPopover from './EdgeEditPopover';
import FloatingFormattingBar from './FloatingFormattingBar';
import { useAppStore } from '../../store/useAppStore';
import { useEffect, useState, useCallback } from 'react';
import { useOnViewportChange } from '@xyflow/react';

const nodeTypes = { noteNode: NoteNode, textNode: TextNode };
const edgeTypes = { connectionEdge: ConnectionEdge };

function BoardCanvasInner() {
  const { 
    notes, edges: storeEdges, updateNotePosition, updateNote, updateTextNode,
    activeTool, setActiveTool, activeNoteColor, activeBoardId, 
    addNote, addTextNode, addConnection, deleteNote, deleteConnection 
  } = useAppStore();
  
  const { screenToFlowPosition } = useReactFlow();
  
  // Only show nodes/edges for active board
  const boardNotes = notes.filter(n => n.boardId === activeBoardId || n.boardId === undefined);
  const boardEdges = storeEdges.filter(e => e.boardId === activeBoardId || e.boardId === undefined);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(boardNotes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(boardEdges);

  // Sync store when it changes
  useEffect(() => { setNodes(boardNotes); }, [notes, activeBoardId, setNodes]);
  useEffect(() => { setEdges(boardEdges); }, [storeEdges, activeBoardId, setEdges]);

  // Connect tool state
  const [connectSource, setConnectSource] = useState(null);

  // Draw tool state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState(null);
  const [drawCurrent, setDrawCurrent] = useState(null);

  const handleNodeDragStop = (event, node) => updateNotePosition(node.id, node.position);

  const [edgePopover, setEdgePopover] = useState(null);

  const onPaneClick = (event) => {
    if (activeTool === 'connect') setConnectSource(null);
    setEdgePopover(null);
    if (activeTool === 'text') {
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      addTextNode({
        boardId: activeBoardId,
        type: 'textNode',
        position,
        data: { content: '', width: 120, height: 40 }
      });
      setActiveTool('select');
    }
  };

  const onEdgeClick = (event, edge) => {
    setEdgePopover({ id: edge.id, x: event.clientX, y: event.clientY });
  };

  const onNodeClick = (event, node) => {
    if (activeTool === 'connect') {
      if (!connectSource) {
        setConnectSource(node.id);
      } else if (connectSource !== node.id) {
        addConnection({
          boardId: activeBoardId,
          source: connectSource,
          target: node.id,
          type: 'connectionEdge',
          data: { color: activeNoteColor }
        });
        setConnectSource(null);
        setActiveTool('select');
      }
    }
  };

  const onKeyDown = useCallback((event) => {
    // Prevent delete when typing in inputs/textareas
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

    if (event.key === 'Delete' || event.key === 'Backspace') {
      const selectedNodes = nodes.filter(n => n.selected);
      const selectedEdges = edges.filter(e => e.selected);
      selectedNodes.forEach(n => deleteNote(n.id));
      selectedEdges.forEach(e => deleteConnection(e.id));
    }
  }, [nodes, edges, deleteNote, deleteConnection]);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  const onPointerDown = (e) => {
    if (activeTool !== 'draw') return;
    // Don't draw if we click on floating toolbar or other UI over the canvas
    if (e.target.closest('.react-flow__controls') || e.target.closest('.react-flow__panel')) return;
    
    setIsDrawing(true);
    setDrawStart({ x: e.clientX, y: e.clientY });
    setDrawCurrent({ x: e.clientX, y: e.clientY });
  };

  const onPointerMove = (e) => {
    if (!isDrawing) return;
    setDrawCurrent({ x: e.clientX, y: e.clientY });
  };

  const onPointerUp = (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const left = Math.min(drawStart.x, drawCurrent.x);
    const top = Math.min(drawStart.y, drawCurrent.y);
    let width = Math.max(drawStart.x, drawCurrent.x) - left;
    let height = Math.max(drawStart.y, drawCurrent.y) - top;

    // Constrain minimum sizes
    if (width < 180) width = 180;
    if (height < 140) height = 140;

    const position = screenToFlowPosition({ x: left, y: top });

    addNote({
      boardId: activeBoardId,
      type: 'noteNode',
      position,
      data: {
        category: 'New note',
        content: '',
        color: activeNoteColor,
        width,
        height
      }
    });

    setActiveTool('text');
  };

  let drawRect = null;
  if (isDrawing && drawStart && drawCurrent) {
    const left = Math.min(drawStart.x, drawCurrent.x);
    const top = Math.min(drawStart.y, drawCurrent.y);
    const width = Math.max(drawStart.x, drawCurrent.x) - left;
    const height = Math.max(drawStart.y, drawCurrent.y) - top;
    drawRect = { left, top, width, height };
  }

  const selectedNodes = nodes.filter(n => n.selected);
  const activeNode = selectedNodes.length === 1 ? selectedNodes[0] : null;
  const [formattingRect, setFormattingRect] = useState(null);

  const updateFormattingRect = useCallback(() => {
    if (!activeNode) {
      setFormattingRect(null);
      return;
    }
    const el = document.querySelector(`[data-id="${activeNode.id}"]`);
    if (el) setFormattingRect(el.getBoundingClientRect());
  }, [activeNode]);

  useEffect(() => { updateFormattingRect(); }, [activeNode, updateFormattingRect]);
  useOnViewportChange({ onChange: updateFormattingRect });

  const selectedEdges = edges.filter(e => e.selected);
  const activeEdge = selectedEdges.length === 1 ? selectedEdges[0] : null;

  return (
    <div 
      className="flex-1 w-full h-full graph-paper-light-bg relative"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      style={{ cursor: activeTool === 'draw' ? 'crosshair' : 'default' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={handleNodeDragStop}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        panOnDrag={activeTool === 'select'}
        selectionOnDrag={activeTool === 'select'}
        elementsSelectable={activeTool === 'select'}
        nodesDraggable={activeTool === 'select'}
        zoomOnScroll={true}
      >
        <Controls 
          className="bg-white border-[#e5e0d8] fill-[#6b6b6b] shadow-md" 
          showInteractive={false} 
        />
      </ReactFlow>

      {isDrawing && drawRect && (
        <div 
          className="absolute border border-dashed z-50 pointer-events-none"
          style={{
            left: drawRect.left,
            top: drawRect.top,
            width: drawRect.width,
            height: drawRect.height,
            borderColor: activeNoteColor,
            backgroundColor: `${activeNoteColor}15`
          }}
        />
      )}

      {activeNode && formattingRect && (activeNode.type === 'noteNode' || activeNode.type === 'textNode') && (
        <FloatingFormattingBar 
          nodeRect={formattingRect} 
          data={activeNode.data}
          onChange={(changes) => {
            if (activeNode.type === 'noteNode') updateNote(activeNode.id, changes);
            if (activeNode.type === 'textNode') updateTextNode(activeNode.id, changes);
          }}
        />
      )}

      {activeEdge && edgePopover && activeEdge.id === edgePopover.id && (
        <EdgeEditPopover 
          edgeId={activeEdge.id} 
          position={{ x: edgePopover.x, y: edgePopover.y }}
          onClose={() => setEdgePopover(null)} 
        />
      )}
    </div>
  );
}

export default function BoardCanvas() {
  return (
    <ReactFlowProvider>
      <BoardCanvasInner />
    </ReactFlowProvider>
  );
}
