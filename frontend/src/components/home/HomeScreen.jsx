import { useAppStore } from '../../store/useAppStore';
import { CheckCircle2, AlertCircle, Layout, ArrowRight } from 'lucide-react';

export default function HomeScreen() {
  const { collections, setMode, setActiveBoard } = useAppStore();

  return (
    <div className="w-full h-full bg-white overflow-y-auto text-slate-900">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Good morning, Enoch</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => { setActiveBoard(1); setMode('board'); }}
              className="px-5 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              Open Board <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => setMode('task')}
              className="px-5 py-2.5 bg-[#185FA5] text-white rounded-lg font-medium hover:bg-[#15508c] transition-colors flex items-center gap-2"
            >
              Go to Tasks <CheckCircle2 size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-16">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-start justify-between">
            <div>
              <p className="text-slate-500 font-medium mb-1">Today's tasks</p>
              <h2 className="text-3xl font-bold text-slate-900">3</h2>
            </div>
            <div className="p-3 bg-blue-100 text-[#185FA5] rounded-xl">
              <CheckCircle2 size={24} />
            </div>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start justify-between">
            <div>
              <p className="text-red-500 font-medium mb-1">Overdue</p>
              <h2 className="text-3xl font-bold text-red-600">1</h2>
            </div>
            <div className="p-3 bg-red-100 text-red-600 rounded-xl">
              <AlertCircle size={24} />
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <h2 className="text-2xl font-bold mb-6">Your Collections</h2>
          {collections.map(collection => (
            <div key={collection.id} className="mb-8">
              <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Layout size={20} className="text-slate-400" /> {collection.name}
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {collection.boards.map(board => (
                  <button
                    key={board.id}
                    onClick={() => { setActiveBoard(board.id); setMode('board'); }}
                    className="group bg-white border border-slate-200 p-5 rounded-xl hover:shadow-md hover:border-[#185FA5]/30 transition-all text-left flex flex-col h-32 justify-between"
                  >
                    <span className="font-semibold text-slate-900 group-hover:text-[#185FA5] transition-colors">
                      {board.name}
                    </span>
                    <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-md w-fit">
                      {board.noteCount} notes
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
