import { ChevronLeft, Layout, Plus, Grid } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) { return twMerge(clsx(inputs)); }

export default function PopoutSidebar() {
  const { collections, sidebarOpen, toggleSidebar, activeBoardId, setActiveBoard, addCollection, addBoard } = useAppStore();
  const [expandedColls, setExpandedColls] = useState(collections.map(c => c.id));
  const [addingColl, setAddingColl] = useState(false);
  const [newCollName, setNewCollName] = useState('');
  const [addingBoard, setAddingBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardCollId, setNewBoardCollId] = useState(collections[0]?.id || '');

  if (!sidebarOpen) return null;

  const toggleColl = (id) => setExpandedColls(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleAddColl = () => {
    if (newCollName.trim()) addCollection(newCollName.trim());
    setAddingColl(false); setNewCollName('');
  };

  const handleAddBoard = () => {
    if (newBoardName.trim() && newBoardCollId) addBoard(Number(newBoardCollId), newBoardName.trim());
    setAddingBoard(false); setNewBoardName('');
  };

  return (
    <>
      <div className="absolute inset-0 z-40 bg-transparent" onClick={toggleSidebar} />
      <div className="absolute left-0 top-0 h-full w-[240px] z-50 shadow-2xl flex flex-col" style={{ backgroundColor: 'rgba(255,250,245,0.92)', backdropFilter: 'blur(8px)' }}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#e5e0d8]">
          <h2 className="font-semibold text-[#1a1a1a] flex items-center gap-2"><Layout size={18} /> Collections</h2>
          <button onClick={toggleSidebar} className="p-1 hover:bg-[#e5e0d8] rounded text-[#6b6b6b] transition-colors"><ChevronLeft size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {collections.map(coll => (
            <div key={coll.id}>
              <div className="flex items-center justify-between mb-2 cursor-pointer group" onClick={() => toggleColl(coll.id)}>
                <h3 className="text-sm font-semibold text-[#1a1a1a] group-hover:text-[#185FA5] transition-colors">{coll.name}</h3>
                <span className="text-xs text-[#6b6b6b] bg-white/50 px-1.5 py-0.5 rounded">{coll.boards.length}</span>
              </div>
              {expandedColls.includes(coll.id) && (
                <div className="space-y-1 ml-2 border-l-2 border-[#e5e0d8] pl-2">
                  {coll.boards.map(board => (
                    <button 
                      key={board.id} 
                      onClick={() => setActiveBoard(board.id)}
                      className={cn("w-full text-left px-2 py-1.5 rounded text-sm flex items-center justify-between", activeBoardId === board.id ? "bg-[#185FA5]/10 text-[#185FA5] font-medium" : "text-[#6b6b6b] hover:bg-white/50")}
                    >
                      <span className="flex items-center gap-2 truncate"><Grid size={14} className="shrink-0" /> <span className="truncate">{board.name}</span></span>
                      <span className="text-[10px] shrink-0 ml-2 opacity-50">{board.noteCount}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[#e5e0d8] space-y-3 bg-white/30">
          {addingColl ? (
            <div className="flex gap-2">
              <input autoFocus type="text" placeholder="Collection name" value={newCollName} onChange={e => setNewCollName(e.target.value)} onKeyDown={e => { if(e.key==='Enter') handleAddColl(); if(e.key==='Escape') setAddingColl(false); }} className="flex-1 text-sm p-1.5 border border-[#e5e0d8] rounded outline-none" />
            </div>
          ) : (
            <button onClick={() => setAddingColl(true)} className="w-full text-left text-sm text-[#6b6b6b] hover:text-[#1a1a1a] flex items-center gap-2 py-1"><Plus size={16} /> New collection</button>
          )}

          {addingBoard ? (
            <div className="space-y-2 border-t pt-3 mt-2 border-[#e5e0d8]/50">
              <input autoFocus type="text" placeholder="Board name" value={newBoardName} onChange={e => setNewBoardName(e.target.value)} className="w-full text-sm p-1.5 border border-[#e5e0d8] rounded outline-none" />
              <select value={newBoardCollId} onChange={e => setNewBoardCollId(e.target.value)} className="w-full text-sm p-1.5 border border-[#e5e0d8] rounded outline-none bg-white">
                {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <div className="flex gap-2">
                <button onClick={handleAddBoard} className="flex-1 bg-[#185FA5] text-white text-xs py-1.5 rounded">Save</button>
                <button onClick={() => setAddingBoard(false)} className="flex-1 bg-white text-xs py-1.5 rounded border border-[#e5e0d8]">Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAddingBoard(true)} className="w-full text-left text-sm text-[#6b6b6b] hover:text-[#1a1a1a] flex items-center gap-2 py-1"><Plus size={16} /> New board</button>
          )}
        </div>
      </div>
    </>
  );
}
