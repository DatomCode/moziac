import { CheckCircle2, Circle, Link, Flame } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) { return twMerge(clsx(inputs)); }

export default function TaskItem({ task, onClick }) {
  const { projects, completeTask, activeTaskId } = useAppStore();
  const project = projects.find(p => p.id === task.projectId);
  const isDone = task.status === 'done';
  const isInProgress = task.status === 'in_progress';
  const isActive = activeTaskId === task.id;

  const handleStatusClick = (e) => {
    e.stopPropagation();
    completeTask(task.id);
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group flex items-center px-4 py-3 rounded-lg border border-transparent hover:border-slate-200 cursor-pointer transition-all",
        isDone ? "opacity-60 hover:opacity-100" : "",
        isActive ? "bg-slate-50 border-slate-200 shadow-sm ring-1 ring-[#185FA5]/20" : "hover:bg-slate-50"
      )}
    >
      <div 
        className="mr-4 shrink-0 mt-0.5 self-start cursor-pointer" 
        onClick={handleStatusClick}
      >
        {isDone ? (
          <CheckCircle2 size={20} className="text-[#185FA5] fill-blue-50" />
        ) : isInProgress ? (
          <div className="relative w-5 h-5 rounded-full border-2 border-[#185FA5] overflow-hidden hover:bg-blue-50 transition-colors">
            <div className="absolute inset-0 bg-[#185FA5] w-1/2 h-full" />
          </div>
        ) : (
          <Circle size={20} className="text-slate-300 group-hover:text-[#185FA5] transition-colors" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className={cn(
          "text-sm font-medium mb-1 truncate transition-all",
          isDone ? "text-slate-500 line-through" : "text-slate-900"
        )}>
          {task.title}
        </h4>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>{task.dueDate === '2026-06-19' ? 'Today' : task.dueDate}</span>
          
          {task.priority === 'urgent' && (
            <span className="flex items-center gap-1 text-red-600 bg-red-50 px-1.5 py-0.5 rounded font-medium">
              <Flame size={12} /> Urgent
            </span>
          )}
          {task.priority === 'medium' && (
            <span className="px-1.5 py-0.5 rounded text-orange-600 bg-orange-50 font-medium">Medium</span>
          )}
          {task.priority === 'high' && (
            <span className="px-1.5 py-0.5 rounded text-pink-600 bg-pink-50 font-medium">High</span>
          )}

          {task.linkedNoteId && (
            <span className="flex items-center gap-1 text-[#185FA5] bg-blue-50 px-1.5 py-0.5 rounded font-medium">
              <Link size={12} /> Note attached
            </span>
          )}
        </div>
      </div>

      {project && (
        <div className="ml-4 shrink-0 flex items-center">
          <span 
            className="text-[11px] font-medium px-2 py-1 rounded-full border flex items-center gap-1.5"
            style={{ 
              borderColor: `${project.color}30`, 
              color: project.color,
              backgroundColor: `${project.color}10`
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project.color }} />
            {project.name}
          </span>
        </div>
      )}
    </div>
  );
}
