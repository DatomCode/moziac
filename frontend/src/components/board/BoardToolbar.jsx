import { useAppStore } from '../../store/useAppStore';

export default function BoardToolbar() {
  const { collections, activeBoardId } = useAppStore();
  const activeBoard = collections.flatMap(c => c.boards).find(b => b.id === activeBoardId);

  return (
    <div className="h-[56px] w-full bg-white border-b border-[#e5e0d8] flex items-center justify-between px-6 z-10 shrink-0">
      <div className="flex items-center gap-3">
        <h2 className="font-semibold text-lg text-[#1a1a1a]">{activeBoard?.name || 'Board'}</h2>
        <span className="text-xs font-medium text-[#6b6b6b] bg-slate-100 px-2 py-0.5 rounded">
          {activeBoard?.noteCount || 0} notes
        </span>
      </div>
    </div>
  );
}
