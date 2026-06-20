import { X, Calendar, Flag, Layout, Link as LinkIcon, AlignLeft } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function TaskDetailPanel({ taskId, onClose }) {
  const { tasks, projects } = useAppStore();
  const task = tasks.find(t => t.id === taskId);
  const project = projects.find(p => p?.id === task?.projectId);

  if (!task) return null;

  return (
    <div className="w-[360px] h-full bg-white border-l border-slate-200 shadow-[-10px_0_30px_rgba(0,0,0,0.03)] absolute right-0 top-0 z-20 flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Task Details</span>
        <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        <textarea 
          className="w-full text-xl font-bold text-slate-900 border-none outline-none resize-none mb-6 placeholder:text-slate-300"
          value={task.title}
          readOnly
          rows={2}
        />

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-4 text-sm">
            <div className="w-24 text-slate-500 flex items-center gap-2"><Layout size={16} /> Project</div>
            <div className="flex items-center gap-2 font-medium" style={{ color: project?.color || '#000' }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: project?.color || '#000' }} />
              {project?.name || 'No Project'}
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="w-24 text-slate-500 flex items-center gap-2"><Calendar size={16} /> Due Date</div>
            <div className="font-medium text-slate-700">{task.dueDate === '2026-06-19' ? 'Today' : 'Jun 21, 2026'}</div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="w-24 text-slate-500 flex items-center gap-2"><Flag size={16} /> Priority</div>
            <div className="font-medium text-slate-700 capitalize">{task.priority}</div>
          </div>
        </div>

        <div className="mb-8">
          <div className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <AlignLeft size={16} className="text-slate-400" /> Description
          </div>
          <textarea 
            className="w-full text-sm text-slate-600 border border-slate-200 rounded-lg p-3 outline-none focus:border-[#185FA5] transition-colors min-h-[100px] resize-none"
            placeholder="Add a more detailed description..."
            defaultValue="This is a dummy description for the task. Need to follow up on the specific action items discussed."
          />
        </div>

        {task.linkedNoteId && (
          <div className="mb-8">
            <div className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <LinkIcon size={16} className="text-slate-400" /> Linked Note
            </div>
            <div className="border border-blue-100 bg-blue-50/50 rounded-lg p-3 flex items-start gap-3 cursor-pointer hover:border-blue-200 transition-colors">
              <div className="p-2 bg-blue-100 text-[#185FA5] rounded-md mt-0.5">
                <Layout size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">React Native + Expo</p>
                <p className="text-xs text-slate-500 mt-0.5">From "Mozaic Project" board</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
