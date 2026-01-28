
import React, { Suspense, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, TransformControls, Environment, ContactShadows } from '@react-three/drei';
import { ShapeObject } from '../types';
import Shape from './Shape';
import { Edit3, Type } from 'lucide-react';

interface EditorProps {
  objects: ShapeObject[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  transformMode: 'translate' | 'rotate' | 'scale';
  updateObject: (id: string, updates: Partial<ShapeObject>) => void;
}

// Sub-component to handle TransformControls correctly
const TransformHandler: React.FC<{
  selectedId: string | null;
  transformMode: 'translate' | 'rotate' | 'scale';
  onUpdate: (id: string, updates: any) => void;
}> = ({ selectedId, transformMode, onUpdate }) => {
  const { scene } = useThree();
  const selectedObjectInScene = useMemo(() => {
    if (!selectedId) return null;
    return scene.getObjectByName(selectedId);
  }, [selectedId, scene]);

  if (!selectedId || !selectedObjectInScene) return null;

  return (
    <TransformControls
      object={selectedObjectInScene}
      mode={transformMode}
      onMouseUp={(e) => {
        const target = e?.target?.object;
        if (target && selectedId) {
          onUpdate(selectedId, {
            position: [target.position.x, target.position.y, target.position.z],
            rotation: [target.rotation.x, target.rotation.y, target.rotation.z],
            scale: [target.scale.x, target.scale.y, target.scale.z]
          });
        }
      }}
    />
  );
};

const Editor: React.FC<EditorProps> = ({ 
  objects, 
  selectedId, 
  onSelect, 
  transformMode,
  updateObject 
}) => {
  const selectedObject = objects.find(obj => obj.id === selectedId);

  return (
    <div className="w-full h-full relative overflow-hidden group">
      {/* Floating Name Input Overlay - High Visibility */}
      {selectedId && selectedObject && (
        <div className="absolute top-4 left-4 z-[60] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="glass-panel p-2 rounded-xl flex items-center gap-3 shadow-2xl ring-1 ring-white/20">
            <div className="bg-indigo-500 p-2 rounded-lg text-white shadow-lg">
              <Type size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Nom de l'objet</span>
              <input
                type="text"
                value={selectedObject.name}
                autoFocus
                onChange={(e) => updateObject(selectedId, { name: e.target.value })}
                className="bg-transparent text-sm font-bold text-white border-none focus:outline-none focus:ring-0 min-w-[180px] p-0"
                placeholder="Entrez un nom..."
              />
            </div>
          </div>
        </div>
      )}

      <Canvas
        shadows
        camera={{ position: [8, 8, 8], fov: 45 }}
        onPointerMissed={() => onSelect(null)}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={2} castShadow />
          <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} intensity={2.5} castShadow />
          
          <Grid 
            infiniteGrid 
            fadeDistance={50} 
            sectionSize={1} 
            sectionColor="#6366f1" 
            cellColor="#334155"
            cellThickness={0.8}
            sectionThickness={1.5}
            position={[0, -0.01, 0]}
          />

          {objects.map((obj) => (
            <Shape 
              key={obj.id} 
              object={obj} 
              isSelected={selectedId === obj.id} 
              onSelect={onSelect} 
            />
          ))}

          <TransformHandler 
            selectedId={selectedId} 
            transformMode={transformMode} 
            onUpdate={updateObject} 
          />

          <Environment preset="night" />
          <ContactShadows resolution={1024} scale={20} blur={3} opacity={0.5} far={10} color="#000000" />
          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Editor;
