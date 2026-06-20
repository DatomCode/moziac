import { useAppStore } from './store/useAppStore';
import HomeScreen from './components/home/HomeScreen';
import BoardMode from './components/board/BoardMode';
import TaskMode from './components/tasks/TaskMode';
import ModeSwitcher from './components/shared/ModeSwitcher';

function App() {
  const currentMode = useAppStore(state => state.currentMode);

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col relative text-slate-900">
      {currentMode === 'home' && <HomeScreen />}
      {currentMode === 'board' && <BoardMode />}
      {currentMode === 'task' && <TaskMode />}
      <ModeSwitcher />
    </div>
  );
}

export default App;
