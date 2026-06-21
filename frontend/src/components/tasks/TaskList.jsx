import { Filter, Plus, Mic, Search, X } from 'lucide-react';
import TaskItem from './TaskItem';
import { useAppStore } from '../../store/useAppStore';
import { useState } from 'react';

export default function TaskList() {
  const { tasks, projects, activeView, searchQuery, setSearchQuery, addTask, setActiveTaskId } = useAppStore();
  
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProject, setNewTaskProject] = useState(projects[0]?.id || '');
  const [newTaskPriority, setNewTaskPriority] = useState('low');
  const [newTaskDate, setNewTaskDate] = useState('2026-06-19');

  const DUMMY_TODAY = '2026-06-19';

  const getViewTitle = () => {
    if (activeView === 'today') return 'Today';
    if (activeView === 'upcoming') return 'Upcoming';
    if (activeView === 'overdue') return 'Overdue';
    const proj = projects.find(p => p.id === activeView);
    return proj ? proj.name : 'Tasks';
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    // View filter
    if (activeView === 'today') {
      filtered = filtered.filter(t => t.dueDate === DUMMY_TODAY);
    } else if (activeView === 'upcoming') {
      filtered = filtered.filter(t => t.dueDate > DUMMY_TODAY);
    } else if (activeView === 'overdue') {
      filtered = filtered.filter(t => t.dueDate < DUMMY_TODAY && t.status !== 'done');
    } else {
      // Must be a projectId
      filtered = filtered.filter(t => t.projectId === activeView);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Sort: done tasks at bottom
    return filtered.sort((a, b) => {
      if (a.status === 'done' && b.status !== 'done') return 1;
      if (a.status !== 'done' && b.status === 'done') return -1;
      return 0;
    });
  };

  const handleSaveTask = () => {
    if (newTaskTitle.trim()) {
      addTask({
        title: newTaskTitle.trim(),
        projectId: Number(newTaskProject),
        priority: newTaskPriority,
        dueDate: newTaskDate,
        status: 'not_started',
        tags: [],
        subtasks: []
      });
    }
    setIsAddingTask(false);
    setNewTaskTitle('');
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-white overflow-hidden pb-24 relative">
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0 h-[88px]">
        {isSearching ? (
          <div className="flex-1 flex items-center bg-slate-100 rounded-md px-4 py-2">
            <Search size={18} className="text-slate-400 mr-2" />
            <input 
              autoFocus
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Escape') { setIsSearching(false); setSearchQuery(''); } }}
              className="flex-1 bg-transparent border-none outline-none text-slate-900"
            />
            <button onClick={() => { setIsSearching(false); setSearchQuery(''); }} className="text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{getViewTitle()}</h1>
              <p className="text-sm text-slate-500">{activeView === 'today' ? 'Friday June 19' : ''}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setIsSearching(true)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-md transition-colors">
                <Search size={20} />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-md transition-colors">
                <Filter size={20} />
              </button>
              <button 
                onClick={() => setIsAddingTask(true)}
                className="px-4 py-2 bg-[#185FA5] text-white rounded-md font-medium hover:bg-[#15508c] transition-colors flex items-center gap-2 text-sm"
              >
                <Plus size={16} /> Add Task
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        {isAddingTask ? (
          <div className="mb-6 border border-slate-300 rounded-lg p-4 bg-white shadow-sm">
            <input 
              autoFocus
              type="text" 
              placeholder="Task title" 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSaveTask(); if (e.key === 'Escape') setIsAddingTask(false); }}
              className="w-full text-base font-medium outline-none placeholder:text-slate-400 mb-4"
            />
            <div className="flex items-center gap-4 text-sm mb-4">
              <select value={newTaskProject} onChange={e => setNewTaskProject(e.target.value)} className="border rounded p-1 outline-none">
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <select value={newTaskPriority} onChange={e => setNewTaskPriority(e.target.value)} className="border rounded p-1 outline-none capitalize">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <input type="date" value={newTaskDate} onChange={e => setNewTaskDate(e.target.value)} className="border rounded p-1 outline-none" />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setIsAddingTask(false)} className="px-4 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded">Cancel</button>
              <button onClick={handleSaveTask} className="px-4 py-1.5 text-sm font-medium text-white bg-[#185FA5] hover:bg-[#15508c] rounded">Save task</button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => setIsAddingTask(true)}
            className="mb-6 flex items-center border border-dashed border-slate-300 rounded-lg px-4 py-3 bg-slate-50 text-slate-500 hover:border-[#185FA5] hover:bg-white transition-colors cursor-text"
          >
            <Plus size={18} className="mr-3" />
            <span className="flex-1 text-sm text-slate-400">Add a task...</span>
            <button className="p-1 text-slate-400 hover:text-[#185FA5] rounded transition-colors ml-2">
              <Mic size={18} />
            </button>
          </div>
        )}

        <div className="flex flex-col gap-1">
          {getFilteredTasks().map(task => (
            <TaskItem key={task.id} task={task} onClick={() => setActiveTaskId(task.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}
