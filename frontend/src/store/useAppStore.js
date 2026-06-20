import { create } from 'zustand';

const dummyCollections = [
  {
    id: 1,
    name: 'Work',
    boards: [
      { id: 1, name: 'Mozaic Project', noteCount: 4 },
      { id: 2, name: 'Backend Planning', noteCount: 2 }
    ]
  },
  {
    id: 2,
    name: 'Personal',
    boards: [
      { id: 3, name: 'Life Goals', noteCount: 3 }
    ]
  }
];

const dummyProjects = [
  { id: 1, name: 'Mozaic', color: '#185FA5' },
  { id: 2, name: 'LAUTECH', color: '#1D9E75' },
  { id: 3, name: 'Personal', color: '#D85A30' }
];

const dummyTasks = [
  {
    id: 1,
    title: 'Set up Django project structure',
    status: 'done',
    projectId: 1,
    priority: 'medium',
    dueDate: '2026-06-19',
    linkedNoteId: null,
  },
  {
    id: 2,
    title: 'Build Supabase auth integration',
    status: 'not_started',
    projectId: 1,
    priority: 'urgent',
    dueDate: '2026-06-19',
    linkedNoteId: 1,
  },
  {
    id: 3,
    title: 'Design task list UI mockup',
    status: 'in_progress',
    projectId: 1,
    priority: 'medium',
    dueDate: '2026-06-19',
    linkedNoteId: null,
  },
  {
    id: 4,
    title: 'Write Tauri desktop app scaffold',
    status: 'not_started',
    projectId: 3,
    priority: 'low',
    dueDate: '2026-06-21',
    linkedNoteId: null,
  }
];

const dummyNotes = [
  {
    id: '1',
    position: { x: 250, y: 150 },
    data: {
      color: '#facc15',
      category: 'Core feature',
      content: 'Spatial canvas where notes connect to tasks directly',
      tag: 'board'
    },
    type: 'noteNode'
  },
  {
    id: '2',
    position: { x: 600, y: 100 },
    data: {
      color: '#38bdf8',
      category: 'Design',
      content: 'Dark canvas, graph paper grid, glowing notes per category'
    },
    type: 'noteNode'
  },
  {
    id: '3',
    position: { x: 650, y: 350 },
    data: {
      color: '#4ade80',
      category: 'Backend',
      content: 'Django REST + Supabase auth, deploy on Render'
    },
    type: 'noteNode'
  },
  {
    id: '4',
    position: { x: 950, y: 200 },
    data: {
      color: '#f472b6',
      category: 'Mobile',
      content: 'React Native + Expo, same Django API',
      linkedTaskId: 2
    },
    type: 'noteNode'
  }
];

const dummyEdges = [
  { id: 'e1-2', source: '1', target: '2', type: 'connectionEdge', data: { color: '#facc15' } },
  { id: 'e1-3', source: '1', target: '3', type: 'connectionEdge', data: { color: '#facc15' } },
  { id: 'e2-4', source: '2', target: '4', type: 'connectionEdge', data: { color: '#38bdf8' } }
];

export const useAppStore = create((set, get) => ({
  currentMode: 'home', // 'home', 'board', 'task'
  activeBoardId: 1,
  
  collections: dummyCollections,
  projects: dummyProjects,
  tasks: dummyTasks,
  notes: dummyNotes,
  edges: dummyEdges,
  
  setMode: (mode) => set({ currentMode: mode }),
  setActiveBoard: (boardId) => set({ activeBoardId: boardId, currentMode: 'board' }),
  
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, { ...task, id: Date.now() }] })),
  updateTask: (taskId, updates) => set((state) => ({
    tasks: state.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
  })),
  
  updateNotePosition: (noteId, position) => set((state) => ({
    notes: state.notes.map(n => n.id === noteId ? { ...n, position } : n)
  })),
}));
