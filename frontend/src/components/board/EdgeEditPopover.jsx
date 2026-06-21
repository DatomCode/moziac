import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

const SWATCHES = [
  '#facc15', '#fb923c', '#f87171', '#f472b6', 
  '#a78bfa', '#38bdf8', '#4ade80', '#a09080'
];

// SVG Previews for Line Types
const LineStraight = () => <svg width="24" height="24" viewBox="0 0 24 24"><path d="M4,12 L20,12" stroke="currentColor" strokeWidth="2" fill="none"/></svg>;
const LineCurved = () => <svg width="24" height="24" viewBox="0 0 24 24"><path d="M4,20 C4,4 20,4 20,20" stroke="currentColor" strokeWidth="2" fill="none"/></svg>;
const LineSmoothStep = () => <svg width="24" height="24" viewBox="0 0 24 24"><path d="M4,20 L4,10 Q4,4 10,4 L20,4" stroke="currentColor" strokeWidth="2" fill="none"/></svg>;
const LineElbow = () => <svg width="24" height="24" viewBox="0 0 24 24"><path d="M4,20 L4,4 L20,4" stroke="currentColor" strokeWidth="2" fill="none"/></svg>;
const LineLoose = () => <svg width="24" height="24" viewBox="0 0 24 24"><path d="M4,20 C-6,4 30,4 20,20" stroke="currentColor" strokeWidth="2" fill="none"/></svg>;

// Arrow Previews
const ArrowNone = () => <span className="font-bold px-1">—</span>;
const ArrowEnd = () => <span className="font-bold px-1">→</span>;
const ArrowStart = () => <span className="font-bold px-1">←</span>;
const ArrowBoth = () => <span className="font-bold px-1">↔</span>;

export default function EdgeEditPopover({ edgeId, position, onClose }) {
  const { edges, updateConnectionStyle, deleteConnection } = useAppStore();
  
  const edge = edges.find(e => e.id === edgeId);
  if (!edge || !position) return null;

  const data = edge.data || {};
  const lineType = data.lineType || 'bezier';
  const lineStyle = data.lineStyle || 'solid';
  const thickness = data.thickness || 2;
  const arrowStyle = data.arrowStyle || 'none';
  const color = data.color || '#a09080';
  const label = data.label || '';

  const update = (changes) => {
    updateConnectionStyle(edgeId, changes);
  };

  const Btn = ({ active, onClick, children }) => (
    <button 
      onClick={onClick}
      className={`p-1.5 rounded transition-colors flex items-center justify-center ${active ? 'bg-blue-100 text-[#185FA5]' : 'text-slate-600 hover:bg-slate-100'}`}
    >
      {children}
    </button>
  );

  return (
    <div 
      className="absolute z-50 bg-white p-3 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-[#e5e0d8] flex flex-col gap-3 w-[260px]"
      style={{ left: position.x, top: position.y, transform: 'translate(-50%, -100%)', marginTop: '-12px' }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Row 1: Line Type */}
      <div className="flex items-center justify-between">
        <Btn active={lineType === 'straight'} onClick={() => update({ lineType: 'straight' })}><LineStraight /></Btn>
        <Btn active={lineType === 'bezier'} onClick={() => update({ lineType: 'bezier' })}><LineCurved /></Btn>
        <Btn active={lineType === 'smoothstep'} onClick={() => update({ lineType: 'smoothstep' })}><LineSmoothStep /></Btn>
        <Btn active={lineType === 'step'} onClick={() => update({ lineType: 'step' })}><LineElbow /></Btn>
        <Btn active={lineType === 'loose'} onClick={() => update({ lineType: 'loose' })}><LineLoose /></Btn>
      </div>

      <div className="w-full h-px bg-slate-100" />

      {/* Row 2: Line Style */}
      <div className="flex items-center justify-center gap-2">
        <button onClick={() => update({ lineStyle: 'solid' })} className={`flex-1 py-1 text-xs font-medium rounded border ${lineStyle === 'solid' ? 'bg-blue-50 border-blue-200 text-[#185FA5]' : 'bg-white border-slate-200 text-slate-600'}`}>Solid</button>
        <button onClick={() => update({ lineStyle: 'dashed' })} className={`flex-1 py-1 text-xs font-medium rounded border ${lineStyle === 'dashed' ? 'bg-blue-50 border-blue-200 text-[#185FA5]' : 'bg-white border-slate-200 text-slate-600'}`}>Dashed</button>
        <button onClick={() => update({ lineStyle: 'dotted' })} className={`flex-1 py-1 text-xs font-medium rounded border ${lineStyle === 'dotted' ? 'bg-blue-50 border-blue-200 text-[#185FA5]' : 'bg-white border-slate-200 text-slate-600'}`}>Dotted</button>
      </div>

      {/* Row 3: Thickness */}
      <div className="flex items-center justify-center gap-2">
        <button onClick={() => update({ thickness: 1 })} className={`flex-1 py-1 text-xs font-medium rounded border ${thickness === 1 ? 'bg-blue-50 border-blue-200 text-[#185FA5]' : 'bg-white border-slate-200 text-slate-600'}`}>Thin</button>
        <button onClick={() => update({ thickness: 2 })} className={`flex-1 py-1 text-xs font-medium rounded border ${thickness === 2 ? 'bg-blue-50 border-blue-200 text-[#185FA5]' : 'bg-white border-slate-200 text-slate-600'}`}>Med</button>
        <button onClick={() => update({ thickness: 3 })} className={`flex-1 py-1 text-xs font-medium rounded border ${thickness === 3 ? 'bg-blue-50 border-blue-200 text-[#185FA5]' : 'bg-white border-slate-200 text-slate-600'}`}>Thick</button>
      </div>

      {/* Row 4: Arrow */}
      <div className="flex items-center justify-between px-2">
        <Btn active={arrowStyle === 'none'} onClick={() => update({ arrowStyle: 'none' })}><ArrowNone /></Btn>
        <Btn active={arrowStyle === 'end'} onClick={() => update({ arrowStyle: 'end' })}><ArrowEnd /></Btn>
        <Btn active={arrowStyle === 'start'} onClick={() => update({ arrowStyle: 'start' })}><ArrowStart /></Btn>
        <Btn active={arrowStyle === 'both'} onClick={() => update({ arrowStyle: 'both' })}><ArrowBoth /></Btn>
      </div>

      <div className="w-full h-px bg-slate-100" />

      {/* Row 5: Color */}
      <div className="flex items-center justify-between">
        {SWATCHES.map(swatch => (
          <button
            key={swatch}
            onClick={() => update({ color: swatch })}
            className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${color === swatch ? 'border-slate-400 shadow-sm' : 'border-transparent'}`}
            style={{ backgroundColor: swatch }}
          />
        ))}
      </div>

      {/* Row 6: Label */}
      <input 
        className="w-full text-sm p-1.5 border border-slate-200 rounded outline-none focus:border-blue-300"
        placeholder="Add label..."
        value={label}
        onChange={(e) => update({ label: e.target.value })}
      />

      <button 
        onClick={() => { deleteConnection(edgeId); onClose(); }}
        className="text-xs text-red-500 hover:text-red-600 mt-1 self-center font-medium"
      >
        Delete connection
      </button>
    </div>
  );
}
