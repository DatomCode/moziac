import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Layout, Pin } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

export default function NoteNode({ id, data, selected }) {
  const { updateNote } = useAppStore();
  const [isEditing, setIsEditing] = useState(!data.content && !data.category); // Auto edit if new
  const color = data.color || '#facc15';
  
  const width = data.width || 220;
  const height = data.height || 180;

  return (
    <div 
      onDoubleClick={() => setIsEditing(true)}
      className="relative rounded-[4px] min-w-[180px] min-h-[140px] shadow-[0_2px_8px_rgba(0,0,0,0.10)] border border-[#e0d8cc] overflow-hidden"
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

      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="target" position={Position.Left} id="tl" className="opacity-0" />
      
      {/* Notebook lines */}
      <div className="absolute inset-0 pointer-events-none notebook-ruled-lines opacity-70" />

      {/* Thumbtack */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 text-slate-300 z-10 pointer-events-none">
        <Pin size={14} className="fill-slate-200" style={{ transform: 'rotate(45deg)' }} />
      </div>
      
      <div className="relative z-10 p-4 pl-6 h-full flex flex-col pt-5">
        {isEditing ? (
          <input 
            autoFocus
            className="text-xs font-bold bg-transparent outline-none border-b border-dashed border-slate-300 mb-1 w-full"
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
            className="text-sm text-[#1a1a1a] bg-transparent outline-none resize-none flex-1 leading-[24px]"
            value={data.content || ''}
            onChange={(e) => updateNote(id, { content: e.target.value })}
            onBlur={() => setIsEditing(false)}
            placeholder="Note content..."
          />
        ) : (
          <p className="text-sm text-[#1a1a1a] flex-1 leading-[24px] whitespace-pre-wrap break-words">
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

      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      <Handle type="source" position={Position.Right} id="sr" className="opacity-0" />
    </div>
  );
}
