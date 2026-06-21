import { ChevronRight, Grid } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) { return twMerge(clsx(inputs)); }

export default function LeftRail() {
  const { collections, activeBoardId, setActiveBoard, toggleSidebar } = useAppStore();
  const activeCollection = collections.find(c => c.boards.some(b => b.id === activeBoardId)) || collections[0];

  return (
    <div className="w-[44px] h-full flex flex-col items-center py-4 shrink-0 z-10 border-r border-[#e5e0d8]" style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}>
      <button 
        onClick={toggleSidebar}
        className="w-8 h-8 rounded bg-white border border-[#e5e0d8] shadow-sm flex items-center justify-center text-[#1a1a1a] mb-6 cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <ChevronRight size={18} />
      </button>
      
      <div className="flex-1 w-full flex flex-col items-center gap-3">
        {activeCollection.boards.map(board => {
          const isActive = board.id === activeBoardId;
          return (
            <button
              key={board.id}
              onClick={() => setActiveBoard(board.id)}
              className={cn(
                "w-8 h-8 rounded flex items-center justify-center transition-all relative group",
                isActive ? "bg-[#185FA5] text-white shadow-md" : "text-[#6b6b6b] hover:bg-white/60 hover:text-[#1a1a1a]"
              )}
              title={board.name}
            >
              <Grid size={16} />
            </button>
          )
        })}
      </div>
    </div>
  );
}
