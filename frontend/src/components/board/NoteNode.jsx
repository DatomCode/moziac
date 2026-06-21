import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Layout, Pin } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

const HANDLE_STYLE = {
  width: '8px', height: '8px', 
  backgroundColor: '#185FA5', 
  border: '2px solid white'
};

export default function NoteNode({ id, data, selected }) {
  const { updateNote, activeTool } = useAppStore();
  const [isEditing, setIsEditing] = useState(!data.content); // Auto edit if new
  const showHandles = activeTool === 'connect';
  
  const fontStyle = {
    fontFamily: data.fontFamily || 'Inter',
    fontSize: data.fontSize ? `${data.fontSize}px` : undefined,
    fontWeight: data.bold ? 'bold' : 'normal',
    fontStyle: data.italic ? 'italic' : 'normal',
    textDecoration: data.underline ? 'underline' : 'none',
    color: data.textColor || '#1a1a1a',
    textAlign: data.textAlign || 'left',
  };
  const color = data.color || '#facc15';
  
  const width = data.width || 220;
  const height = data.height || 180;

  return (
    <div 
      onDoubleClick={() => setIsEditing(true)}
      className="relative rounded-[4px] min-w-[180px] min-h-[140px] shadow-[0_2px_8px_rgba(0,0,0,0.10)] border border-[#e0d8cc] overflow-hidden group/node"
      style={{ width, height, borderLeft: `4px solid ${color}`, backgroundColor: `${color}05` }}
    >
      <NodeResizer 
        color={color} 
        isVisible={selected} 
        minWidth={180} 
        minHeight={140}
        onResize={(evt, params) => {
          updateNote(id, { width: params.width, height: params.height });
        }}
      />

      <div className={`transition-opacity duration-200 z-50 ${showHandles ? 'opacity-0 group-hover/node:opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Handle type="target" position={Position.Top} id="tc-t" style={HANDLE_STYLE} />
        <Handle type="source" position={Position.Top} id="tc-s" style={HANDLE_STYLE} />
        <Handle type="target" position={Position.Bottom} id="bc-t" style={HANDLE_STYLE} />
        <Handle type="source" position={Position.Bottom} id="bc-s" style={HANDLE_STYLE} />
        <Handle type="target" position={Position.Left} id="lc-t" style={HANDLE_STYLE} />
        <Handle type="source" position={Position.Left} id="lc-s" style={HANDLE_STYLE} />
        <Handle type="target" position={Position.Right} id="rc-t" style={HANDLE_STYLE} />
        <Handle type="source" position={Position.Right} id="rc-s" style={HANDLE_STYLE} />
        
        <Handle type="target" position={Position.Top} id="tl-t" style={{ ...HANDLE_STYLE, left: 0 }} />
        <Handle type="source" position={Position.Top} id="tl-s" style={{ ...HANDLE_STYLE, left: 0 }} />
        <Handle type="target" position={Position.Top} id="tr-t" style={{ ...HANDLE_STYLE, left: '100%' }} />
        <Handle type="source" position={Position.Top} id="tr-s" style={{ ...HANDLE_STYLE, left: '100%' }} />
        <Handle type="target" position={Position.Bottom} id="bl-t" style={{ ...HANDLE_STYLE, left: 0 }} />
        <Handle type="source" position={Position.Bottom} id="bl-s" style={{ ...HANDLE_STYLE, left: 0 }} />
        <Handle type="target" position={Position.Bottom} id="br-t" style={{ ...HANDLE_STYLE, left: '100%' }} />
        <Handle type="source" position={Position.Bottom} id="br-s" style={{ ...HANDLE_STYLE, left: '100%' }} />
      </div>
      
      {/* Notebook lines */}
      <div className="absolute inset-0 pointer-events-none notebook-ruled-lines opacity-70" />

      {/* Thumbtack */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 text-slate-300 z-10 pointer-events-none">
        <Pin size={14} className="fill-slate-200" style={{ transform: 'rotate(45deg)' }} />
      </div>
      
      <div className="relative z-10 p-4 pl-6 h-full flex flex-col pt-5">
        {isEditing ? (
          <input 
            className="nodrag text-xs font-bold bg-transparent outline-none border-b border-dashed border-slate-300 mb-1 w-full"
            style={{ color: color }}
            value={data.category || ''}
            onChange={(e) => updateNote(id, { category: e.target.value })}
            placeholder="Category..."
          />
        ) : (
          <span 
            className="text-xs font-bold mb-1 inline-block truncate w-full"
            style={{ color: color }}
          >
            {data.category || 'New note'}
          </span>
        )}
        
        {isEditing ? (
          <textarea
            autoFocus
            className="nodrag text-sm bg-transparent outline-none resize-none flex-1 leading-[24px]"
            style={fontStyle}
            value={data.content || ''}
            onChange={(e) => updateNote(id, { content: e.target.value })}
            onBlur={() => setIsEditing(false)}
            placeholder="Note content..."
          />
        ) : (
          <p className="text-sm flex-1 leading-[24px] whitespace-pre-wrap break-words" style={fontStyle}>
            {data.content}
          </p>
        )}
        
        {data.linkedTaskId && (
          <div className="flex items-center gap-2 mt-auto border-t border-[#e5e0d8] pt-2 bg-white/50 -mx-4 px-4 pb-2 -mb-4">
            <span className="flex items-center gap-1 text-[10px] font-medium text-[#185FA5] bg-blue-50 px-1.5 py-0.5 rounded">
              <Layout size={10} /> Task Attached
            </span>
          </div>
        )}
      </div>


    </div>
  );
}
