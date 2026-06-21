import LeftRail from './LeftRail';
import PopoutSidebar from './PopoutSidebar';
import BoardToolbar from './BoardToolbar';
import BoardCanvas from './BoardCanvas';
import FloatingToolbar from './FloatingToolbar';

export default function BoardMode() {
  return (
    <div className="flex h-full w-full bg-[#f5f0e8] overflow-hidden text-[#1a1a1a] relative">
      <LeftRail />
      <PopoutSidebar />
      <div className="flex-1 flex flex-col relative h-full">
        <BoardToolbar />
        <BoardCanvas />
        <FloatingToolbar />
      </div>
    </div>
  );
}
