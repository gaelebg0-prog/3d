
import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import AIAssistant from './components/AIAssistant';
import { ShapeObject, ShapeType } from './types';
import { Download, Layers, MousePointer2, Type as TypeIcon } from 'lucide-react';

const App: React.FC = () => {
  const [objects, setObjects] = useState<ShapeObject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  
  const handleAddObject = useCallback((type: ShapeType) => {
    const newObj: ShapeObject = {
      id: uuidv4(),
      type,
      position: [0, 0.5, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: '#4f46e5',
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${objects.length + 1}`
    };
    setObjects(prev => [...prev, newObj]);
    setSelectedId(newObj.id);
  }, [objects.length]);

  const handleAddAIObjects = useCallback((suggested: Partial<ShapeObject>[]) => {
    const newObjects = suggested.map((s, i) => ({
      id: uuidv4(),
      type: (s.type || 'box') as ShapeType,
      position: (s.position || [0, 0, 0]) as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      scale: (s.scale || [1, 1, 1]) as [number, number, number],
      color: s.color || '#4f46e5',
      name: s.name || `Objet IA ${objects.length + i + 1}`
    }));
    setObjects(prev => [...prev, ...newObjects]);
  }, [objects.length]);

  const handleDeleteObject = useCallback((id: string) => {
    setObjects(prev => prev.filter(obj => obj.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const handleUpdateObject = useCallback((id: string, updates: Partial<ShapeObject>) => {
    setObjects(prev => prev.map(obj => obj.id === id ? { ...obj, ...updates } : obj));
  }, []);

  const exportSTL = () => {
    const exporter = new STLExporter();
    const scene = new THREE.Scene();

    objects.forEach(obj => {
      let geometry: THREE.BufferGeometry;
      switch (obj.type) {
        case 'box': geometry = new THREE.BoxGeometry(1, 1, 1); break;
        case 'sphere': geometry = new THREE.SphereGeometry(0.5, 32, 32); break;
        case 'cylinder': geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32); break;
        case 'cone': geometry = new THREE.ConeGeometry(0.5, 1, 32); break;
        case 'torus': geometry = new THREE.TorusGeometry(0.4, 0.1, 16, 100); break;
        case 'torusKnot': geometry = new THREE.TorusKnotGeometry(0.4, 0.1, 128, 32); break;
        case 'dodecahedron': geometry = new THREE.DodecahedronGeometry(0.5); break;
        case 'octahedron': geometry = new THREE.OctahedronGeometry(0.5); break;
        case 'capsule': geometry = new THREE.CapsuleGeometry(0.3, 0.4, 4, 16); break;
        default: geometry = new THREE.BoxGeometry(1, 1, 1);
      }
      
      const mesh = new THREE.Mesh(geometry);
      mesh.position.set(...obj.position);
      mesh.rotation.set(...obj.rotation);
      mesh.scale.set(...obj.scale);
      mesh.updateMatrixWorld();
      scene.add(mesh);
    });

    const result = exporter.parse(scene, { binary: true });
    const blob = new Blob([result], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `design_maker3d_${new Date().getTime()}.stl`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const selectedObject = objects.find(o => o.id === selectedId);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-slate-900/40 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Layers size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-black text-lg leading-tight tracking-tight text-white">MAKER3D<span className="text-indigo-400">AI</span></h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Creative Lab</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full text-[10px] text-slate-400 font-medium border border-white/10 uppercase tracking-wider">
            <MousePointer2 size={12} className="text-indigo-400" />
            <span>Sélectionne pour éditer</span>
          </div>
          <button 
            onClick={exportSTL}
            disabled={objects.length === 0}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
          >
            <Download size={18} />
            Exporter STL
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 pt-14">
        <Sidebar 
          objects={objects} 
          selectedId={selectedId}
          onAdd={handleAddObject}
          onDelete={handleDeleteObject}
          onSelect={setSelectedId}
          transformMode={transformMode}
          setTransformMode={setTransformMode}
        />
        
        <main className="flex-1 bg-slate-950 relative overflow-hidden">
          <Editor 
            objects={objects}
            selectedId={selectedId}
            onSelect={setSelectedId}
            transformMode={transformMode}
            updateObject={handleUpdateObject}
          />

          {/* Bottom Selection Info Bar */}
          {selectedId && selectedObject && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl shadow-2xl flex items-center gap-10 min-w-[580px] ring-1 ring-white/5">
                <div className="flex flex-col gap-1 min-w-[140px]">
                  <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest flex items-center gap-1">
                    <TypeIcon size={10} className="text-indigo-400" /> Identification
                  </span>
                  <input
                    type="text"
                    value={selectedObject.name}
                    onChange={(e) => handleUpdateObject(selectedId, { name: e.target.value })}
                    className="bg-slate-800/50 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 w-full"
                  />
                </div>

                <div className="h-10 w-px bg-white/5" />

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Coordonnées</span>
                  <div className="flex gap-2">
                     {['X','Y','Z'].map((axis, i) => (
                       <div key={axis} className="bg-slate-800/50 px-2.5 py-1.5 rounded-lg text-xs border border-white/5 flex items-center">
                         <span className="text-indigo-400 font-black mr-1.5">{axis}</span>
                         <span className="text-white font-mono">{selectedObject.position[i].toFixed(1)}</span>
                       </div>
                     ))}
                  </div>
                </div>

                <div className="h-10 w-px bg-white/5" />

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Apparence</span>
                  <div className="flex items-center gap-3">
                    <div className="relative w-24 h-9">
                      <input 
                        type="color" 
                        value={selectedObject.color}
                        onChange={(e) => handleUpdateObject(selectedId, { color: e.target.value })}
                        className="absolute inset-0 w-full h-full bg-transparent border-none cursor-pointer p-0 opacity-0 z-10"
                      />
                      <div 
                        className="w-full h-full rounded-lg border border-white/10 shadow-inner flex items-center justify-center text-[10px] font-bold"
                        style={{ backgroundColor: selectedObject.color, color: parseInt(selectedObject.color.slice(1), 16) > 0xffffff / 2 ? 'black' : 'white' }}
                      >
                        {selectedObject.color.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          )}
        </main>

        <AIAssistant onAddObjects={handleAddAIObjects} />
      </div>
    </div>
  );
};

export default App;
