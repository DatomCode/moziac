import { Calendar, Inbox, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) { return twMerge(clsx(inputs)); }

const colors = ['#38bdf8', '#4ade80', '#fb923c', '#f87171', '#a78bfa', '#f472b6'];

export default function Sidebar() {
  const { projects, tasks, activeView, setActiveView, addProject, deleteProject } = useAppStore();
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectColor, setNewProjectColor] = useState(colors[0]);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const DUMMY_TODAY = '2026-06-19';

  const overdueCount = tasks.filter(t => t.dueDate < DUMMY_TODAY && t.status !== 'done').length;
  const todayCount = tasks.filter(t => t.dueDate === DUMMY_TODAY && t.status !== 'done').length;

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      addProject({ name: newProjectName.trim(), color: newProjectColor });
    }
    setIsAddingProject(false);
    setNewProjectName('');
  };

  const ViewItem = ({ id, icon: Icon, label, count, colorClass, activeClass }) => {
    const isActive = activeView === id;
    return (
      <button 
        onClick={() => setActiveView(id)}
        className={cn(
          "w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm font-medium transition-colors",
          isActive ? activeClass : "text-slate-600 hover:bg-slate-100"
        )}
      >
        <span className="flex items-center gap-2"><Icon size={16} /> {label}</span>
        {count > 0 && (
          <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full", colorClass)}>
            {count}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="w-[180px] h-full bg-slate-50 border-r border-slate-200 flex flex-col pt-6 shrink-0 overflow-y-auto">
      <div className="px-4 mb-6">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Views</h3>
        <div className="space-y-1">
          <ViewItem id="today" icon={Inbox} label="Today" count={todayCount} colorClass="bg-[#185FA5] text-white" activeClass="bg-blue-50 text-[#185FA5]" />
          <ViewItem id="upcoming" icon={Calendar} label="Upcoming" />
          <ViewItem id="overdue" icon={AlertCircle} label="Overdue" count={overdueCount} colorClass="bg-red-100 text-red-600" activeClass="bg-red-50 text-red-600" />
        </div>
      </div>

      <div className="px-4 flex-1 pb-6">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Projects</h3>
        <div className="space-y-1 mb-3">
          {projects.map(project => (
            <div key={project.id} className="group relative">
              {projectToDelete === project.id ? (
                <div className="w-full bg-red-50 rounded-md p-2 text-xs border border-red-100 shadow-sm z-10 relative">
                  <p className="text-red-700 font-medium mb-2 text-center">Delete project?</p>
                  <div className="flex justify-center gap-2">
                    <button onClick={() => deleteProject(project.id)} className="bg-red-600 text-white px-2 py-1 rounded">Yes</button>
                    <button onClick={() => setProjectToDelete(null)} className="bg-slate-200 text-slate-700 px-2 py-1 rounded">No</button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setActiveView(project.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm font-medium transition-colors",
                    activeView === project.id ? "bg-blue-50 text-[#185FA5]" : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <span className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: project.color }} />
                    <span className="truncate">{project.name}</span>
                  </span>
                  <Trash2 
                    size={14} 
                    className="text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all shrink-0 ml-1" 
                    onClick={(e) => { e.stopPropagation(); setProjectToDelete(project.id); }}
                  />
                </button>
              )}
            </div>
          ))}
        </div>

        {isAddingProject ? (
          <div className="bg-white border border-slate-200 rounded-md p-2 shadow-sm">
            <input 
              autoFocus
              type="text" 
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddProject(); if (e.key === 'Escape') setIsAddingProject(false); }}
              className="w-full text-sm outline-none mb-2 placeholder:text-slate-400"
            />
            <div className="flex gap-1 mb-2 justify-between">
              {colors.map(c => (
                <button key={c} onClick={() => setNewProjectColor(c)} className={cn("w-4 h-4 rounded-full", newProjectColor === c && "ring-2 ring-offset-1 ring-slate-400")} style={{ backgroundColor: c }} />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={handleAddProject} className="flex-1 bg-[#185FA5] text-white text-xs py-1 rounded font-medium">Save</button>
              <button onClick={() => setIsAddingProject(false)} className="flex-1 bg-slate-100 text-slate-600 text-xs py-1 rounded font-medium">Cancel</button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsAddingProject(true)}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md text-sm font-medium transition-colors"
          >
            <Plus size={16} /> Add project
          </button>
        )}
      </div>
    </div>
  );
}
