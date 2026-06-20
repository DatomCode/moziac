import LeftRail from './LeftRail';
import BoardToolbar from './BoardToolbar';
import BoardCanvas from './BoardCanvas';

export default function BoardMode() {
  return (
    <div className="flex h-full w-full bg-[#0a0d12] overflow-hidden text-[#e2e8f0]">
      <LeftRail />
      <div className="flex-1 flex flex-col relative h-full">
        <BoardToolbar />
        <BoardCanvas />
      </div>
    </div>
  );
}
