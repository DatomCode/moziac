import { MousePointer2, Square, GitCommit, Trash2, Type } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useState } from 'react';
import ColorPickerPopover from './ColorPickerPopover';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) { return twMerge(clsx(inputs)); }

export default function FloatingToolbar() {
  const { activeTool, setActiveTool, activeNoteColor } = useAppStore();
  const [showColorPicker, setShowColorPicker] = useState(false);

  const ToolBtn = ({ id, icon: Icon }) => (
    <button
      onClick={() => { setActiveTool(id); setShowColorPicker(false); }}
      className={cn(
        "p-2 rounded-full transition-colors flex items-center justify-center",
        activeTool === id ? "bg-blue-100 text-[#185FA5]" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
      )}
    >
      <Icon size={20} />
    </button>
  );

  return (
    <div className="absolute bottom-[104px] left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white px-4 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-[#e5e0d8] flex items-center gap-2 relative">
        <ToolBtn id="select" icon={MousePointer2} />
        <ToolBtn id="draw" icon={Square} />
        <ToolBtn id="text" icon={Type} />
        <ToolBtn id="connect" icon={GitCommit} />
        
        <div className="w-px h-6 bg-slate-200 mx-1" />
        
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-8 h-8 rounded-full border-2 border-slate-200 shadow-sm flex items-center justify-center mx-1 transition-transform hover:scale-105"
            style={{ backgroundColor: activeNoteColor }}
          />
          {showColorPicker && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowColorPicker(false)} />
              <div className="z-50 relative">
                <ColorPickerPopover onClose={() => setShowColorPicker(false)} />
              </div>
            </>
          )}
        </div>
        
        <div className="w-px h-6 bg-slate-200 mx-1" />
        
        <button
          className="p-2 rounded-full text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center"
          title="Delete selected (use Backspace or Delete key)"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
