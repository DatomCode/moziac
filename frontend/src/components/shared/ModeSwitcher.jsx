import { LayoutDashboard, CheckSquare } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function ModeSwitcher() {
  const { currentMode, setMode, activeBoardId } = useAppStore();

  if (currentMode === 'home') return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="glass-pill gap-1">
        <button
          onClick={() => setMode('board')}
          className={cn(
            "p-2 rounded-full transition-all flex items-center justify-center",
            currentMode === 'board' ? "bg-slate-700/80 text-white shadow-sm" : "text-slate-400 hover:text-white hover:bg-white/10"
          )}
          title="Board Mode"
        >
          <LayoutDashboard size={20} />
        </button>
        <div className="w-px h-6 bg-white/10 mx-1" />
        <button
          onClick={() => setMode('task')}
          className={cn(
            "p-2 rounded-full transition-all flex items-center justify-center",
            currentMode === 'task' ? "bg-slate-700/80 text-white shadow-sm" : "text-slate-400 hover:text-white hover:bg-white/10"
          )}
          title="Task Mode"
        >
          <CheckSquare size={20} />
        </button>
      </div>
    </div>
  );
}
