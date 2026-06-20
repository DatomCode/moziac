import { Layout, Plus, Grid } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) { return twMerge(clsx(inputs)); }

export default function LeftRail() {
  const { collections, activeBoardId, setActiveBoard } = useAppStore();
  const activeCollection = collections.find(c => c.boards.some(b => b.id === activeBoardId)) || collections[0];

  return (
    <div className="w-[44px] h-full bg-black/20 border-r border-[#1e2a3a] flex flex-col items-center py-4 shrink-0 z-10">
      <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-300 mb-6 cursor-pointer hover:text-white transition-colors">
        <Layout size={18} />
      </div>
      
      <div className="flex-1 w-full flex flex-col items-center gap-3">
        {activeCollection.boards.map(board => {
          const isActive = board.id === activeBoardId;
          return (
            <button
              key={board.id}
              onClick={() => setActiveBoard(board.id)}
              className={cn(
                "w-8 h-8 rounded flex items-center justify-center transition-all relative group",
                isActive ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-white/10 hover:text-slate-300"
              )}
              title={board.name}
            >
              <Grid size={16} />
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-white rounded-r-full -ml-[6px]" />
              )}
            </button>
          )
        })}
        <div className="w-8 h-8 rounded border border-dashed border-slate-600 flex items-center justify-center text-slate-500 cursor-pointer hover:bg-white/5 hover:text-slate-300 hover:border-slate-400 transition-all mt-2">
          <Plus size={16} />
        </div>
      </div>
    </div>
  );
}
