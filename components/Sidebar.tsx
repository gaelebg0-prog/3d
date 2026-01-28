
import React from 'react';
import { Box, Circle, Cylinder, Cone, Disc, Trash2, Move, RotateCcw, Maximize, Activity, Hexagon, Diamond, Pill } from 'lucide-react';
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
  ];

  return (
    <div className="w-72 bg-slate-900 border-r border-slate-800 h-full flex flex-col p-4 gap-6 overflow-y-auto shadow-2xl">
      <div>
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Bibliothèque de formes</h2>
        <div className="grid grid-cols-3 gap-2">
          {shapeTemplates.map((item) => (
            <button
              key={item.type}
              onClick={() => onAdd(item.type)}
              title={item.label}
              className="flex flex-col items-center justify-center p-2 bg-slate-800 hover:bg-indigo-600/80 rounded-lg transition-all gap-1.5 border border-slate-700/50 hover:border-indigo-400/50 group"
            >
              <item.icon size={18} className="text-slate-400 group-hover:text-white transition-colors" />
              <span className="text-[9px] text-slate-500 group-hover:text-white truncate w-full text-center">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Outils de Transformation</h2>
        <div className="flex bg-slate-800/50 rounded-lg p-1 gap-1 border border-slate-700/50">
          <button
            onClick={() => setTransformMode('translate')}
            title="Déplacer"
            className={`flex-1 p-2 rounded flex justify-center transition-all ${transformMode === 'translate' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
          >
            <Move size={18} />
          </button>
          <button
            onClick={() => setTransformMode('rotate')}
            title="Pivoter"
            className={`flex-1 p-2 rounded flex justify-center transition-all ${transformMode === 'rotate' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={() => setTransformMode('scale')}
            title="Redimensionner"
            className={`flex-1 p-2 rounded flex justify-center transition-all ${transformMode === 'scale' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
          >
            <Maximize size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Structure ({objects.length})</h2>
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-slate-700">
          {objects.length === 0 && (
            <div className="flex flex-col items-center justify-center h-20 border border-dashed border-slate-700 rounded-lg">
               <p className="text-[10px] text-slate-600">Aucun bloc</p>
            </div>
          )}
          {objects.map((obj) => (
            <div 
              key={obj.id}
              onClick={() => onSelect(obj.id)}
              className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer group transition-all ${
                selectedId === obj.id 
                  ? 'bg-indigo-600/10 border-indigo-500/50' 
                  : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3.5 h-3.5 rounded-sm border border-white/20 shadow-sm" 
                  style={{ backgroundColor: obj.color }}
                />
                <span className={`text-[11px] font-medium truncate max-w-[140px] ${selectedId === obj.id ? 'text-indigo-300' : 'text-slate-300'}`}>
                  {obj.name}
                </span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(obj.id); }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
