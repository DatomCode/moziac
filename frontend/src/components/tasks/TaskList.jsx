import { Filter, Plus, Mic } from 'lucide-react';
import TaskItem from './TaskItem';
import { useAppStore } from '../../store/useAppStore';

export default function TaskList({ onSelectTask }) {
  const tasks = useAppStore(state => state.tasks);

  return (
    <div className="flex-1 h-full flex flex-col bg-white overflow-hidden pb-24">
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Today</h1>
          <p className="text-sm text-slate-500">Friday June 19</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-md transition-colors">
            <Filter size={20} />
          </button>
          <button className="px-4 py-2 bg-[#185FA5] text-white rounded-md font-medium hover:bg-[#15508c] transition-colors flex items-center gap-2 text-sm">
            <Plus size={16} /> Add Task
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="mb-6 flex items-center border border-dashed border-slate-300 rounded-lg px-4 py-3 bg-slate-50 text-slate-500 group focus-within:border-[#185FA5] focus-within:bg-white transition-colors cursor-text">
          <Plus size={18} className="mr-3 group-focus-within:text-[#185FA5]" />
          <input 
            type="text" 
            placeholder="Add a task..." 
            className="flex-1 bg-transparent outline-none text-slate-900 placeholder:text-slate-400 text-sm"
          />
          <button className="p-1 text-slate-400 hover:text-[#185FA5] rounded transition-colors ml-2">
            <Mic size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-1">
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} onClick={() => onSelectTask(task.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}
