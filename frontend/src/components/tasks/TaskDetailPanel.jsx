import { X, Calendar, Flag, Layout, Link as LinkIcon, AlignLeft, Tag, CheckSquare, Trash2, Plus } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useState } from 'react';

export default function TaskDetailPanel({ taskId, onClose }) {
  const { tasks, projects, updateTask, deleteTask, completeTask } = useAppStore();
  const task = tasks.find(t => t.id === taskId);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newSubtask, setNewSubtask] = useState('');

  if (!task) return null;

  const handleChange = (field, value) => updateTask(taskId, { [field]: value });

  const addTag = () => {
    if (newTag.trim() && !task.tags?.includes(newTag.trim())) {
      handleChange('tags', [...(task.tags || []), newTag.trim()]);
    }
    setNewTag('');
  };

  const removeTag = (tag) => handleChange('tags', task.tags.filter(t => t !== tag));

  const addSubtask = () => {
    if (newSubtask.trim()) {
      handleChange('subtasks', [...(task.subtasks || []), { id: Date.now(), title: newSubtask.trim(), done: false }]);
    }
    setNewSubtask('');
  };

  const toggleSubtask = (subId) => {
    handleChange('subtasks', task.subtasks.map(s => s.id === subId ? { ...s, done: !s.done } : s));
  };

  const removeSubtask = (subId) => handleChange('subtasks', task.subtasks.filter(s => s.id !== subId));

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
          className="w-full text-xl font-bold text-slate-900 border-none outline-none resize-none mb-6 placeholder:text-slate-300 leading-tight"
          value={task.title}
          onChange={(e) => handleChange('title', e.target.value)}
          rows={2}
          placeholder="Task title"
        />

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-4 text-sm">
            <div className="w-24 text-slate-500 flex items-center gap-2"><CheckSquare size={16} /> Status</div>
            <select 
              value={task.status} 
              onChange={e => handleChange('status', e.target.value)}
              className="font-medium text-slate-700 outline-none hover:bg-slate-50 p-1 -ml-1 rounded"
            >
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="w-24 text-slate-500 flex items-center gap-2"><Layout size={16} /> Project</div>
            <select 
              value={task.projectId || ''} 
              onChange={e => handleChange('projectId', Number(e.target.value))}
              className="font-medium outline-none hover:bg-slate-50 p-1 -ml-1 rounded flex-1"
            >
              <option value="">No Project</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="w-24 text-slate-500 flex items-center gap-2"><Calendar size={16} /> Due Date</div>
            <input 
              type="date" 
              value={task.dueDate || ''} 
              onChange={e => handleChange('dueDate', e.target.value)}
              className="font-medium text-slate-700 outline-none hover:bg-slate-50 p-1 -ml-1 rounded"
            />
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="w-24 text-slate-500 flex items-center gap-2"><Flag size={16} /> Priority</div>
            <select 
              value={task.priority} 
              onChange={e => handleChange('priority', e.target.value)}
              className="font-medium text-slate-700 outline-none capitalize hover:bg-slate-50 p-1 -ml-1 rounded"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="mb-8">
          <div className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <AlignLeft size={16} className="text-slate-400" /> Description
          </div>
          <textarea 
            className="w-full text-sm text-slate-600 border border-slate-200 rounded-lg p-3 outline-none focus:border-[#185FA5] transition-colors min-h-[100px] resize-none"
            placeholder="Add a more detailed description..."
            value={task.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>

        <div className="mb-8">
          <div className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Tag size={16} className="text-slate-400" /> Tags
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {(task.tags || []).map(tag => (
              <span key={tag} onClick={() => removeTag(tag)} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md cursor-pointer hover:bg-red-50 hover:text-red-600">
                #{tag}
              </span>
            ))}
          </div>
          <input 
            type="text" 
            placeholder="Add a tag and press Enter" 
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTag()}
            className="w-full text-sm outline-none border-b border-slate-200 py-1 focus:border-[#185FA5] transition-colors"
          />
        </div>

        <div className="mb-8">
          <div className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <CheckSquare size={16} className="text-slate-400" /> Subtasks
          </div>
          <div className="space-y-2 mb-3">
            {(task.subtasks || []).map(sub => (
              <div key={sub.id} className="flex items-center justify-between group">
                <label className="flex items-center gap-2 text-sm cursor-pointer w-full">
                  <input type="checkbox" checked={sub.done} onChange={() => toggleSubtask(sub.id)} className="w-4 h-4 rounded text-[#185FA5]" />
                  <span className={sub.done ? "line-through text-slate-400" : "text-slate-700"}>{sub.title}</span>
                </label>
                <Trash2 size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500 cursor-pointer shrink-0" onClick={() => removeSubtask(sub.id)} />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Plus size={16} />
            <input 
              type="text" 
              placeholder="Add subtask" 
              value={newSubtask}
              onChange={e => setNewSubtask(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSubtask()}
              className="flex-1 bg-transparent outline-none border-b border-slate-200 focus:border-[#185FA5]"
            />
          </div>
        </div>

        {task.linkedNoteId && (
          <div className="mb-8">
            <div className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <LinkIcon size={16} className="text-slate-400" /> Linked Note
            </div>
            <div className="border border-blue-100 bg-blue-50/50 rounded-lg p-3 flex items-start gap-3 hover:border-blue-200 transition-colors cursor-pointer">
              <div className="p-2 bg-blue-100 text-[#185FA5] rounded-md mt-0.5"><Layout size={16} /></div>
              <div>
                <p className="text-sm font-medium text-slate-800">Board Note</p>
                <p className="text-xs text-slate-500 mt-0.5">Click to jump to board</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 pt-6 border-t border-slate-100">
          {isDeleting ? (
            <div className="bg-red-50 border border-red-100 rounded-lg p-4">
              <p className="text-sm text-red-700 font-medium mb-3">Are you sure you want to delete this task?</p>
              <div className="flex gap-2">
                <button onClick={() => deleteTask(taskId)} className="flex-1 bg-red-600 text-white text-sm font-medium py-1.5 rounded">Confirm</button>
                <button onClick={() => setIsDeleting(false)} className="flex-1 bg-white border border-slate-200 text-slate-600 text-sm font-medium py-1.5 rounded">Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setIsDeleting(true)} className="w-full flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 py-2 rounded-lg text-sm font-medium transition-colors">
              <Trash2 size={16} /> Delete task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
