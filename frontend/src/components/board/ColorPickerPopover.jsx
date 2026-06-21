import { HexColorPicker } from 'react-colorful';
import { useAppStore } from '../../store/useAppStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) { return twMerge(clsx(inputs)); }

const presetColors = [
  ['#facc15', '#38bdf8', '#4ade80', '#f472b6'],
  ['#fb923c', '#a78bfa', '#f87171', '#ffffff']
];

export default function ColorPickerPopover({ onClose }) {
  const { activeNoteColor, setActiveNoteColor } = useAppStore();

  return (
    <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border border-[#e5e0d8] p-4 w-[240px]">
      <div className="mb-4 space-y-2">
        {presetColors.map((row, i) => (
          <div key={i} className="flex gap-2 justify-center">
            {row.map(color => (
              <button
                key={color}
                onClick={() => { setActiveNoteColor(color); onClose(); }}
                className={cn(
                  "w-7 h-7 rounded-full border shadow-sm transition-all",
                  activeNoteColor === color ? "ring-2 ring-offset-2 ring-[#185FA5]" : "border-slate-200 hover:scale-110"
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="border-t border-[#e5e0d8] pt-4 flex justify-center">
        <HexColorPicker color={activeNoteColor} onChange={setActiveNoteColor} />
      </div>
    </div>
  );
}
