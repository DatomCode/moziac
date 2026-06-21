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
    tags: ['backend', 'setup'],
    subtasks: [{ id: 1, title: 'Install deps', done: true }]
  },
  {
    id: 2,
    title: 'Build Supabase auth integration',
    status: 'not_started',
    projectId: 1,
    priority: 'urgent',
    dueDate: '2026-06-19',
    linkedNoteId: 1,
    tags: [],
    subtasks: []
  },
  {
    id: 3,
    title: 'Design task list UI mockup',
    status: 'in_progress',
    projectId: 1,
    priority: 'medium',
    dueDate: '2026-06-19',
    linkedNoteId: null,
    tags: ['design'],
    subtasks: []
  },
  {
    id: 4,
    title: 'Write Tauri desktop app scaffold',
    status: 'not_started',
    projectId: 3,
    priority: 'low',
    dueDate: '2026-06-21',
    linkedNoteId: null,
    tags: [],
    subtasks: []
  }
];

const dummyNotes = [
  {
    id: '1',
    position: { x: 250, y: 150 },
    data: { color: '#facc15', category: 'Core feature', content: 'Spatial canvas where notes connect to tasks directly', tag: 'board', width: 220 },
    type: 'noteNode'
  },
  {
    id: '2',
    position: { x: 600, y: 100 },
    data: { color: '#38bdf8', category: 'Design', content: 'Dark canvas, graph paper grid, glowing notes per category', width: 220 },
    type: 'noteNode'
  },
  {
    id: '3',
    position: { x: 650, y: 350 },
    data: { color: '#4ade80', category: 'Backend', content: 'Django REST + Supabase auth, deploy on Render', width: 220 },
    type: 'noteNode'
  },
  {
    id: '4',
    position: { x: 950, y: 200 },
    data: { color: '#f472b6', category: 'Mobile', content: 'React Native + Expo, same Django API', linkedTaskId: 2, width: 220 },
    type: 'noteNode'
  }
];

const dummyEdges = [
  { 
    id: 'e1-2', source: '1', target: '2', type: 'connectionEdge', 
    data: { color: '#facc15', lineType: 'bezier', lineStyle: 'solid', thickness: 2, arrowStyle: 'none' } 
  },
  { 
    id: 'e1-3', source: '1', target: '3', type: 'connectionEdge', 
    data: { color: '#facc15', lineType: 'bezier', lineStyle: 'solid', thickness: 2, arrowStyle: 'none' } 
  },
  { 
    id: 'e2-4', source: '2', target: '4', type: 'connectionEdge', 
    data: { color: '#38bdf8', lineType: 'bezier', lineStyle: 'solid', thickness: 2, arrowStyle: 'none' } 
  }
];

export const useAppStore = create((set, get) => ({
  currentMode: 'home', // 'home', 'board', 'task'
  activeBoardId: 1,
  activeView: 'today',
  activeTaskId: null,
  activeTool: 'select',
  activeNoteColor: '#facc15',
  sidebarOpen: false,
  searchQuery: '',
  
  collections: dummyCollections,
  projects: dummyProjects,
  tasks: dummyTasks,
  notes: dummyNotes,
  edges: dummyEdges,
  
  setMode: (mode) => set({ currentMode: mode }),
  setActiveBoard: (boardId) => set({ activeBoardId: boardId, currentMode: 'board' }),
  setActiveView: (view) => set({ activeView: view }),
  setActiveTaskId: (id) => set({ activeTaskId: id }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setActiveNoteColor: (color) => set({ activeNoteColor: color }),
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, { ...task, id: Date.now() }] })),
  updateTask: (taskId, updates) => set((state) => ({
    tasks: state.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
  })),
  deleteTask: (taskId) => set(state => ({
    tasks: state.tasks.filter(t => t.id !== taskId),
    activeTaskId: state.activeTaskId === taskId ? null : state.activeTaskId
  })),
  completeTask: (taskId) => set(state => ({
    tasks: state.tasks.map(t => {
      if (t.id === taskId) {
        const next = t.status === 'not_started' ? 'in_progress' : t.status === 'in_progress' ? 'done' : 'not_started';
        return { ...t, status: next };
      }
      return t;
    })
  })),

  addProject: (project) => set(state => ({ projects: [...state.projects, { ...project, id: Date.now() }] })),
  deleteProject: (projectId) => set(state => ({
    projects: state.projects.filter(p => p.id !== projectId),
    tasks: state.tasks.map(t => t.projectId === projectId ? { ...t, projectId: null } : t),
    activeView: state.activeView === projectId ? 'today' : state.activeView
  })),

  addNote: (note) => set(state => ({ notes: [...state.notes, { ...note, id: Date.now().toString() }] })),
  updateNote: (noteId, updates) => set((state) => ({
    notes: state.notes.map(n => n.id === noteId ? { ...n, data: { ...n.data, ...updates } } : n)
  })),
  deleteNote: (noteId) => set(state => ({
    notes: state.notes.filter(n => n.id !== noteId),
    edges: state.edges.filter(e => e.source !== noteId && e.target !== noteId)
  })),
  updateNotePosition: (noteId, position) => set((state) => ({
    notes: state.notes.map(n => n.id === noteId ? { ...n, position } : n)
  })),

  addConnection: (edge) => set(state => ({ edges: [...state.edges, { ...edge, id: `e${Date.now()}` }] })),
  updateConnectionStyle: (edgeId, updates) => set(state => ({
    edges: state.edges.map(e => e.id === edgeId ? { ...e, data: { ...e.data, ...updates } } : e)
  })),
  deleteConnection: (edgeId) => set(state => ({ edges: state.edges.filter(e => e.id !== edgeId) })),

  addTextNode: (textNode) => set(state => ({ notes: [...state.notes, { ...textNode, id: Date.now().toString() }] })),
  updateTextNode: (nodeId, updates) => set((state) => ({
    notes: state.notes.map(n => n.id === nodeId ? { ...n, data: { ...n.data, ...updates } } : n)
  })),

  addCollection: (name) => set(state => ({
    collections: [...state.collections, { id: Date.now(), name, boards: [] }]
  })),
  addBoard: (collectionId, name) => set(state => ({
    collections: state.collections.map(c => {
      if (c.id === collectionId) {
        return { ...c, boards: [...c.boards, { id: Date.now(), name, noteCount: 0 }] };
      }
      return c;
    })
  }))
}));
