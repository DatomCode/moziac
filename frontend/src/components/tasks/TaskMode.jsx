import Sidebar from './Sidebar';
import TaskList from './TaskList';
import TaskDetailPanel from './TaskDetailPanel';
import { useState } from 'react';

export default function TaskMode() {
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  return (
    <div className="flex h-full w-full bg-white relative">
      <Sidebar />
      <TaskList onSelectTask={setSelectedTaskId} />
      <TaskDetailPanel taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
    </div>
  );
}
