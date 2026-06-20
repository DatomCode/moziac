import { Calendar, Inbox, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function Sidebar() {
  const projects = useAppStore(state => state.projects);
  const tasks = useAppStore(state => state.tasks);

  // Hardcoded current date for dummy data logic
  const overdueCount = tasks.filter(t => new Date(t.dueDate) < new Date('2026-06-19') && t.status !== 'done').length;
  const todayCount = tasks.filter(t => t.dueDate === '2026-06-19' && t.status !== 'done').length;

  return (
    <div className="w-[180px] h-full bg-slate-50 border-r border-slate-200 flex flex-col pt-6 shrink-0">
      <div className="px-4 mb-6">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Views</h3>
        <div className="space-y-1">
          <button className="w-full flex items-center justify-between px-2 py-1.5 bg-blue-50 text-[#185FA5] rounded-md text-sm font-medium">
            <span className="flex items-center gap-2"><Inbox size={16} /> Today</span>
            <span className="bg-[#185FA5] text-white text-[10px] px-1.5 py-0.5 rounded-full">{todayCount}</span>
          </button>
          <button className="w-full flex items-center justify-between px-2 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md text-sm font-medium transition-colors">
            <span className="flex items-center gap-2"><Calendar size={16} /> Upcoming</span>
          </button>
          <button className="w-full flex items-center justify-between px-2 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md text-sm font-medium transition-colors">
            <span className="flex items-center gap-2"><AlertCircle size={16} /> Overdue</span>
            <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded-full">{overdueCount || 1}</span>
          </button>
        </div>
      </div>

      <div className="px-4 flex-1">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Projects</h3>
        <div className="space-y-1">
          {projects.map(project => (
            <button key={project.id} className="w-full flex items-center gap-2 px-2 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md text-sm font-medium transition-colors">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
              {project.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
