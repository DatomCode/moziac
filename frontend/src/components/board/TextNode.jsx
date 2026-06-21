import { Handle, Position, NodeResizer } from '@xyflow/react';
import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';

const HANDLE_STYLE = {
  width: '8px', height: '8px', 
  backgroundColor: '#185FA5', 
  border: '2px solid white'
};

export default function TextNode({ id, data, selected }) {
  const { updateTextNode, activeTool } = useAppStore();
  const [isEditing, setIsEditing] = useState(!data.content);
  
  const width = data.width || 120;
  const height = data.height || 40;
  const showHandles = activeTool === 'connect';



  const fontStyle = {
    fontFamily: data.fontFamily || 'Inter',
    fontSize: `${data.fontSize || 14}px`,
    fontWeight: data.bold ? 'bold' : 'normal',
    fontStyle: data.italic ? 'italic' : 'normal',
    textDecoration: data.underline ? 'underline' : 'none',
    color: data.textColor || '#1a1a1a',
    textAlign: data.textAlign || 'left',
  };

  return (
    <div 
      onDoubleClick={() => setIsEditing(true)}
      className="relative min-w-[120px] min-h-[40px] group/node"
      style={{ width, height }}
    >
      <NodeResizer 
        color="#38bdf8" 
        isVisible={selected} 
        minWidth={120} 
        minHeight={40}
        onResize={(evt, params) => {
          updateTextNode(id, { width: params.width, height: params.height });
        }}
      />

      {/* Handles (both source and target at each of 8 positions so we can connect anywhere to anywhere) */}
      <div className={`transition-opacity duration-200 ${showHandles ? 'opacity-0 group-hover/node:opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Top Center */}
        <Handle type="target" position={Position.Top} id="tc-t" style={HANDLE_STYLE} />
        <Handle type="source" position={Position.Top} id="tc-s" style={HANDLE_STYLE} />
        {/* Bottom Center */}
        <Handle type="target" position={Position.Bottom} id="bc-t" style={HANDLE_STYLE} />
        <Handle type="source" position={Position.Bottom} id="bc-s" style={HANDLE_STYLE} />
        {/* Left Center */}
        <Handle type="target" position={Position.Left} id="lc-t" style={HANDLE_STYLE} />
        <Handle type="source" position={Position.Left} id="lc-s" style={HANDLE_STYLE} />
        {/* Right Center */}
        <Handle type="target" position={Position.Right} id="rc-t" style={HANDLE_STYLE} />
        <Handle type="source" position={Position.Right} id="rc-s" style={HANDLE_STYLE} />
        
        {/* Corners (using CSS offsets relative to the node bounding box) */}
        <Handle type="target" position={Position.Top} id="tl-t" style={{ ...HANDLE_STYLE, left: 0 }} />
        <Handle type="source" position={Position.Top} id="tl-s" style={{ ...HANDLE_STYLE, left: 0 }} />
        
        <Handle type="target" position={Position.Top} id="tr-t" style={{ ...HANDLE_STYLE, left: '100%' }} />
        <Handle type="source" position={Position.Top} id="tr-s" style={{ ...HANDLE_STYLE, left: '100%' }} />
        
        <Handle type="target" position={Position.Bottom} id="bl-t" style={{ ...HANDLE_STYLE, left: 0 }} />
        <Handle type="source" position={Position.Bottom} id="bl-s" style={{ ...HANDLE_STYLE, left: 0 }} />
        
        <Handle type="target" position={Position.Bottom} id="br-t" style={{ ...HANDLE_STYLE, left: '100%' }} />
        <Handle type="source" position={Position.Bottom} id="br-s" style={{ ...HANDLE_STYLE, left: '100%' }} />
      </div>

      <div className="w-full h-full relative z-10 flex flex-col">
        {isEditing ? (
          <textarea
            autoFocus
            className="nodrag w-full h-full bg-transparent outline-none resize-none leading-normal p-1"
            style={fontStyle}
            value={data.content || ''}
            onChange={(e) => updateTextNode(id, { content: e.target.value })}
            onBlur={() => setIsEditing(false)}
            placeholder="Type something..."
          />
        ) : (
          <div 
            className="w-full h-full leading-normal p-1 whitespace-pre-wrap break-words overflow-hidden"
            style={fontStyle}
          >
            {data.content || <span className="opacity-50">Type something...</span>}
          </div>
        )}
      </div>
    </div>
  );
}
