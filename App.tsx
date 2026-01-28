
import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import AIAssistant from './components/AIAssistant';
import { ShapeObject, ShapeType } from './types';
import { Download, Layers, MousePointer2, Settings2, Palette, Box } from 'lucide-react';

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
      color: '#6366f1',
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} #${objects.length + 1}`
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
      color: s.color || '#6366f1',
      name: s.name || `IA Object ${objects.length + i + 1}`
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
    if (objects.length === 0) return;
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
        case 'tetrahedron': geometry = new THREE.TetrahedronGeometry(0.5); break;
        case 'icosahedron': geometry = new THREE.IcosahedronGeometry(0.5); break;
        case 'tube': geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32, 1, true); break;
        case 'pyramid': geometry = new THREE.ConeGeometry(0.5, 1, 4); break;
        case 'star': geometry = new THREE.OctahedronGeometry(0.5); break;
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
    link.download = `MAKER3D_${new Date().toISOString().replace(/[:.]/g, '-')}.stl`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const selectedObject = objects.find(o => o.id === selectedId);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Dynamic Background Decoration */}
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Header Bar */}
      <header className="absolute top-0 left-0 right-0 h-16 bg-slate-900/50 backdrop-blur-2xl border-b border-white/5 z-[100] flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-indigo-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 rotate-3">
            <Layers size={22} className="text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-black text-xl leading-none tracking-tight">MAKER3D<span className="text-indigo-400"> STUDIO</span></h1>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-1">
              <Box size={8} /> Prototypage IA Rapide
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4 px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">
              <MousePointer2 size={12} className="text-indigo-400" />
              <span>Clic Gauche: Sélectionner</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">
              <Settings2 size={12} className="text-indigo-400" />
              <span>Clic Droit: Pivoter Caméra</span>
            </div>
          </div>
          
          <button 
            onClick={exportSTL}
            disabled={objects.length === 0}
            className="group relative overflow-hidden bg-white text-slate-950 px-6 py-2.5 rounded-2xl text-sm font-black transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:grayscale shadow-2xl"
          >
            <div className="relative z-10 flex items-center gap-2">
              <Download size={18} />
              Exporter STL
            </div>
          </button>
        </div>
      </header>

      {/* Main UI Body */}
      <div className="flex flex-1 pt-16 h-full w-full">
        <Sidebar 
          objects={objects} 
          selectedId={selectedId}
          onAdd={handleAddObject}
          onDelete={handleDeleteObject}
          onSelect={setSelectedId}
          transformMode={transformMode}
          setTransformMode={setTransformMode}
        />
        
        <main className="flex-1 relative bg-[#020617]">
          <Editor 
            objects={objects}
            selectedId={selectedId}
            onSelect={setSelectedId}
            transformMode={transformMode}
            updateObject={handleUpdateObject}
          />

          {/* Bottom Control Bar */}
          {selectedId && selectedObject && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 glass-panel p-6 rounded-3xl shadow-2xl flex items-center gap-10 min-w-[700px] border border-white/10 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col gap-2 flex-1">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Palette size={12} /> Personnalisation
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 flex flex-col gap-1">
                      <span className="text-[9px] text-slate-500 uppercase font-bold">Identifiant Unique</span>
                      <div className="bg-slate-800/80 rounded-xl px-3 py-2 text-xs font-mono text-slate-400 border border-white/5">
                        {selectedId.split('-')[0]}...
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-slate-500 uppercase font-bold">Couleur</span>
                      <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl border border-white/5">
                        <input 
                          type="color" 
                          value={selectedObject.color}
                          onChange={(e) => handleUpdateObject(selectedId, { color: e.target.value })}
                          className="w-10 h-8 bg-transparent border-none cursor-pointer rounded-lg overflow-hidden"
                        />
                        <span className="text-[10px] font-mono text-white pr-2 uppercase">{selectedObject.color}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-14 w-px bg-white/10" />

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Transformations</span>
                  <div className="flex gap-2">
                     {['X','Y','Z'].map((axis, i) => (
                       <div key={axis} className="bg-slate-800/80 px-3 py-2 rounded-xl text-xs border border-white/5 flex flex-col items-center min-w-[60px]">
                         <span className="text-indigo-400 font-black text-[8px] mb-1">{axis} AXIS</span>
                         <span className="text-white font-mono font-bold">{selectedObject.position[i].toFixed(1)}</span>
                       </div>
                     ))}
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
