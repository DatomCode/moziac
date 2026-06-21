import { createPortal } from 'react-dom';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Minus, Plus, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

const FONTS = [
  'Inter', 'Poppins', 'Roboto', 'Playfair Display', 'Merriweather',
  'Lora', 'Space Mono', 'JetBrains Mono', 'Dancing Script', 
  'Pacifico', 'Oswald', 'Raleway', 'Nunito', 'Source Serif Pro', 'Work Sans'
];

const SWATCHES = [
  '#facc15', '#fb923c', '#f87171', '#f472b6', 
  '#a78bfa', '#38bdf8', '#4ade80', '#1a1a1a'
];

export default function FloatingFormattingBar({ nodeRect, data, onChange }) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [fontSearch, setFontSearch] = useState('');
  
  if (!nodeRect) return null;

  const top = nodeRect.y - 12;
  const left = nodeRect.x + nodeRect.width / 2;

  const filteredFonts = FONTS.filter(f => f.toLowerCase().includes(fontSearch.toLowerCase()));

  const handleFontSizeChange = (e) => {
    let val = parseInt(e.target.value);
    if (!isNaN(val)) onChange({ fontSize: Math.max(8, Math.min(96, val)) });
  };

  return createPortal(
    <div 
      className="fixed z-[100] flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-[#e5e0d8]"
      style={{ top, left, transform: 'translate(-50%, -100%)' }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="relative">
        <button 
          onClick={() => setShowFontPicker(!showFontPicker)}
          className="flex items-center gap-1 px-2 py-1 hover:bg-slate-100 rounded text-sm text-slate-700 min-w-[100px] justify-between"
          style={{ fontFamily: data.fontFamily || 'Inter' }}
        >
          <span className="truncate">{data.fontFamily || 'Inter'}</span>
          <ChevronDown size={14} />
        </button>
        {showFontPicker && (
          <>
            <div className="fixed inset-0 z-[100]" onClick={() => setShowFontPicker(false)} />
            <div className="absolute top-full mt-2 left-0 bg-white border border-slate-200 rounded-lg shadow-xl w-48 overflow-hidden z-[101]">
              <input 
                autoFocus
                className="w-full p-2 text-sm outline-none border-b border-slate-100"
                placeholder="Search fonts..."
                value={fontSearch}
                onChange={e => setFontSearch(e.target.value)}
              />
              <div className="max-h-60 overflow-y-auto">
                {filteredFonts.map(font => (
                  <button
                    key={font}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-sm"
                    style={{ fontFamily: font }}
                    onClick={() => { onChange({ fontFamily: font }); setShowFontPicker(false); setFontSearch(''); }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="w-px h-5 bg-slate-200 mx-1" />

      <div className="flex items-center gap-1">
        <button onClick={() => onChange({ fontSize: Math.max(8, (data.fontSize || 14) - 1) })} className="p-1 hover:bg-slate-100 rounded text-slate-600">
          <Minus size={14} />
        </button>
        <input 
          className="w-8 text-center text-sm outline-none bg-transparent"
          value={data.fontSize || 14}
          onChange={handleFontSizeChange}
          onKeyDown={(e) => {
             if (e.key === 'Enter') e.target.blur();
          }}
        />
        <button onClick={() => onChange({ fontSize: Math.min(96, (data.fontSize || 14) + 1) })} className="p-1 hover:bg-slate-100 rounded text-slate-600">
          <Plus size={14} />
        </button>
      </div>

      <div className="w-px h-5 bg-slate-200 mx-1" />

      <button onClick={() => onChange({ bold: !data.bold })} className={`p-1.5 rounded transition-colors ${data.bold ? 'bg-blue-100 text-[#185FA5]' : 'text-slate-600 hover:bg-slate-100'}`}>
        <Bold size={16} />
      </button>
      <button onClick={() => onChange({ italic: !data.italic })} className={`p-1.5 rounded transition-colors ${data.italic ? 'bg-blue-100 text-[#185FA5]' : 'text-slate-600 hover:bg-slate-100'}`}>
        <Italic size={16} />
      </button>
      <button onClick={() => onChange({ underline: !data.underline })} className={`p-1.5 rounded transition-colors ${data.underline ? 'bg-blue-100 text-[#185FA5]' : 'text-slate-600 hover:bg-slate-100'}`}>
        <Underline size={16} />
      </button>

      <div className="w-px h-5 bg-slate-200 mx-1" />

      <div className="relative flex items-center">
        <button 
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="w-5 h-5 rounded-full border border-slate-300 mx-1"
          style={{ backgroundColor: data.textColor || '#1a1a1a' }}
        />
        {showColorPicker && (
          <>
            <div className="fixed inset-0 z-[100]" onClick={() => setShowColorPicker(false)} />
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white p-3 rounded-xl shadow-xl border border-slate-100 z-[101] w-48">
              <HexColorPicker color={data.textColor || '#1a1a1a'} onChange={(color) => onChange({ textColor: color })} />
              <div className="flex flex-wrap gap-2 mt-3 justify-between">
                {SWATCHES.map(swatch => (
                  <button
                    key={swatch}
                    onClick={() => onChange({ textColor: swatch })}
                    className="w-5 h-5 rounded-full border border-slate-200"
                    style={{ backgroundColor: swatch }}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="w-px h-5 bg-slate-200 mx-1" />

      <button onClick={() => onChange({ textAlign: 'left' })} className={`p-1.5 rounded transition-colors ${!data.textAlign || data.textAlign === 'left' ? 'bg-blue-100 text-[#185FA5]' : 'text-slate-600 hover:bg-slate-100'}`}>
        <AlignLeft size={16} />
      </button>
      <button onClick={() => onChange({ textAlign: 'center' })} className={`p-1.5 rounded transition-colors ${data.textAlign === 'center' ? 'bg-blue-100 text-[#185FA5]' : 'text-slate-600 hover:bg-slate-100'}`}>
        <AlignCenter size={16} />
      </button>
      <button onClick={() => onChange({ textAlign: 'right' })} className={`p-1.5 rounded transition-colors ${data.textAlign === 'right' ? 'bg-blue-100 text-[#185FA5]' : 'text-slate-600 hover:bg-slate-100'}`}>
        <AlignRight size={16} />
      </button>
    </div>,
    document.body
  );
}
