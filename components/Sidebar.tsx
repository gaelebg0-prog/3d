
import React from 'react';
import { 
  Box, Circle, Cylinder, Cone, Disc, Trash2, Move, RotateCcw, Maximize, 
  Activity, Hexagon, Diamond, Pill, Triangle, Star, Tent, Pipette
} from 'lucide-react';
import { ShapeObject, ShapeType } from '../types';

interface SidebarProps {
  objects: ShapeObject[];
  selectedId: string | null;
  onAdd: (type: ShapeType) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  transformMode: 'translate' | 'rotate' | 'scale';
  setTransformMode: (mode: 'translate' | 'rotate' | 'scale') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  objects, 
  selectedId, 
  onAdd, 
  onDelete, 
  onSelect,
  transformMode,
  setTransformMode
}) => {
  const shapeTemplates: { type: ShapeType, icon: any, label: string }[] = [
    { type: 'box', icon: Box, label: 'Cube' },
    { type: 'sphere', icon: Circle, label: 'Sphère' },
    { type: 'cylinder', icon: Cylinder, label: 'Cylindre' },
    { type: 'cone', icon: Cone, label: 'Cône' },
    { type: 'torus', icon: Disc, label: 'Tore' },
    { type: 'torusKnot', icon: Activity, label: 'Nœud' },
    { type: 'dodecahedron', icon: Hexagon, label: 'Dodeca' },
    { type: 'octahedron', icon: Diamond, label: 'Octa' },
    { type: 'capsule', icon: Pill, label: 'Capsule' },
    { type: 'tetrahedron', icon: Triangle, label: 'Tetra' },
    { type: 'icosahedron', icon: Hexagon, label: 'Icosa' },
    { type: 'tube', icon: Pipette, label: 'Tube' },
    { type: 'pyramid', icon: Tent, label: 'Pyramide' },
    { type: 'star', icon: Star, label: 'Étoile' },
  ];

  return (
    <div className="w-80 bg-slate-900/90 border-r border-white/5 h-full flex flex-col p-5 gap-6 overflow-y-auto shadow-2xl backdrop-blur-xl">
      <div>
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-4">Stock de Blocs</h2>
        <div className="grid grid-cols-4 gap-2">
          {shapeTemplates.map((item) => (
            <button
              key={item.type}
              onClick={() => onAdd(item.type)}
              title={item.label}
              className="flex flex-col items-center justify-center p-2.5 bg-slate-800/50 hover:bg-indigo-600 rounded-xl transition-all gap-1.5 border border-white/5 hover:border-indigo-400/50 group shadow-lg active:scale-90"
            >
              <item.icon size={18} className="text-slate-400 group-hover:text-white transition-colors" />
              <span className="text-[8px] text-slate-500 group-hover:text-white font-bold truncate w-full text-center uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-4">Manipulation</h2>
        <div className="flex bg-slate-800/50 rounded-xl p-1.5 gap-1.5 border border-white/5 shadow-inner">
          <button
            onClick={() => setTransformMode('translate')}
            title="Déplacer (W)"
            className={`flex-1 p-3 rounded-lg flex justify-center transition-all ${transformMode === 'translate' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700'}`}
          >
            <Move size={20} />
          </button>
          <button
            onClick={() => setTransformMode('rotate')}
            title="Pivoter (E)"
            className={`flex-1 p-3 rounded-lg flex justify-center transition-all ${transformMode === 'rotate' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700'}`}
          >
            <RotateCcw size={20} />
          </button>
          <button
            onClick={() => setTransformMode('scale')}
            title="Échelle (R)"
            className={`flex-1 p-3 rounded-lg flex justify-center transition-all ${transformMode === 'scale' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700'}`}
          >
            <Maximize size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-4">Explorateur ({objects.length})</h2>
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {objects.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 border border-dashed border-white/10 rounded-2xl bg-white/5">
               <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Zone de dépôt vide</p>
            </div>
          )}
          {objects.map((obj) => (
            <div 
              key={obj.id}
              onClick={() => onSelect(obj.id)}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer group transition-all ${
                selectedId === obj.id 
                  ? 'bg-indigo-600 border-indigo-400 shadow-xl shadow-indigo-600/20' 
                  : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-5 h-5 rounded-md border border-white/20 shadow-md ring-2 ring-black/20" 
                  style={{ backgroundColor: obj.color }}
                />
                <span className={`text-[12px] font-bold truncate max-w-[150px] ${selectedId === obj.id ? 'text-white' : 'text-slate-300'}`}>
                  {obj.name}
                </span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(obj.id); }}
                className={`p-1.5 rounded-lg transition-all ${selectedId === obj.id ? 'hover:bg-indigo-700 text-white' : 'opacity-0 group-hover:opacity-100 hover:bg-red-500 text-red-400 hover:text-white'}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
