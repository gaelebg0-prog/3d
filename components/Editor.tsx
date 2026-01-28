
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, TransformControls, Environment, ContactShadows } from '@react-three/drei';
import { ShapeObject } from '../types';
import Shape from './Shape';
import { Edit3 } from 'lucide-react';

interface EditorProps {
  objects: ShapeObject[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  transformMode: 'translate' | 'rotate' | 'scale';
  updateObject: (id: string, updates: Partial<ShapeObject>) => void;
}

const Editor: React.FC<EditorProps> = ({ 
  objects, 
  selectedId, 
  onSelect, 
  transformMode,
  updateObject 
}) => {
  const selectedObject = objects.find(obj => obj.id === selectedId);

  return (
    <div className="w-full h-full relative group">
      {/* Floating Name Input Overlay */}
      {selectedId && selectedObject && (
        <div className="absolute top-6 left-6 z-10 transition-all">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-1.5 rounded-lg flex items-center gap-2 shadow-2xl ring-1 ring-white/10">
            <div className="bg-indigo-600/20 p-1.5 rounded text-indigo-400">
              <Edit3 size={16} />
            </div>
            <input
              type="text"
              value={selectedObject.name}
              onChange={(e) => updateObject(selectedId, { name: e.target.value })}
              className="bg-transparent text-sm font-medium text-white border-none focus:outline-none focus:ring-0 min-w-[120px] px-2"
              placeholder="Nom de l'objet..."
            />
          </div>
        </div>
      )}

      <Canvas
        shadows
        camera={{ position: [10, 10, 10], fov: 50 }}
        onPointerMissed={() => onSelect(null)}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
          <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
          
          <Grid 
            infiniteGrid 
            fadeDistance={40} 
            sectionSize={1} 
            sectionColor="#4f46e5" 
            cellColor="#1e293b"
            cellThickness={0.5}
            sectionThickness={1}
          />

          {objects.map((obj) => (
            <Shape 
              key={obj.id} 
              object={obj} 
              isSelected={selectedId === obj.id} 
              onSelect={onSelect} 
            />
          ))}

          {selectedId && (
            <TransformControls 
              mode={transformMode} 
              onMouseUp={(e) => {
                const target = e?.target?.object;
                if (target) {
                  updateObject(selectedId, {
                    position: [target.position.x, target.position.y, target.position.z],
                    rotation: [target.rotation.x, target.rotation.y, target.rotation.z],
                    scale: [target.scale.x, target.scale.y, target.scale.z]
                  });
                }
              }}
            />
          )}

          <Environment preset="city" />
          <ContactShadows resolution={1024} scale={20} blur={2.5} opacity={0.4} far={10} color="#000000" />
          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Editor;
