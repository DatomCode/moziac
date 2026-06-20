import { Handle, Position } from '@xyflow/react';
import { Layout } from 'lucide-react';

export default function NoteNode({ data }) {
  const color = data.color || '#38bdf8';
  
  return (
    <div 
      className="relative rounded-lg shadow-lg min-w-[220px] border p-4 backdrop-blur-md"
      style={{ 
        borderColor: color, 
        backgroundColor: `${color}15`,
        boxShadow: `0 0 15px ${color}20` 
      }}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-[#0a0d12] border-2" 
        style={{ borderColor: color }} 
      />
      
      <div className="flex items-center justify-between mb-3">
        <span 
          className="text-xs font-bold px-2 py-0.5 rounded"
          style={{ backgroundColor: `${color}20`, color: color }}
        >
          {data.category}
        </span>
      </div>
      
      <p className="text-sm text-[#e2e8f0] mb-4">{data.content}</p>
      
      {(data.tag || data.linkedTaskId) && (
        <div className="flex items-center gap-2 mt-auto border-t border-white/10 pt-3">
          {data.tag && (
            <span className="text-[10px] font-medium text-slate-300 bg-white/10 px-1.5 py-0.5 rounded">
              #{data.tag}
            </span>
          )}
          {data.linkedTaskId && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-[#38bdf8] bg-[#38bdf8]20 px-1.5 py-0.5 rounded ml-auto">
              <Layout size={10} /> Task
            </span>
          )}
        </div>
      )}

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-[#0a0d12] border-2" 
        style={{ borderColor: color }} 
      />
    </div>
  );
}
