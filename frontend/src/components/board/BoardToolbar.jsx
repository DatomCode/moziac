import { Search, Plus } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function BoardToolbar() {
  const { collections, activeBoardId } = useAppStore();
  const activeBoard = collections.flatMap(c => c.boards).find(b => b.id === activeBoardId);

  return (
    <div className="h-[56px] w-full bg-[#0f1117] border-b border-[#1e2a3a] flex items-center justify-between px-6 z-10 shrink-0">
      <div className="flex items-center gap-3">
        <h2 className="font-semibold text-lg">{activeBoard?.name || 'Board'}</h2>
        <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
          {activeBoard?.noteCount || 0} notes
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-white transition-colors">
          <Search size={18} />
        </button>
        <button className="flex items-center gap-2 bg-[#185FA5] hover:bg-[#15508c] text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
          <Plus size={16} /> Note
        </button>
      </div>
    </div>
  );
}
