
import React, { useRef } from 'react';
import { ShapeObject } from '../types';
import * as THREE from 'three';
import { Outlines } from '@react-three/drei';

interface ShapeProps {
  object: ShapeObject;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const Shape: React.FC<ShapeProps> = ({ object, isSelected, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const getGeometry = () => {
    switch (object.type) {
      case 'box': return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere': return <sphereGeometry args={[0.5, 32, 32]} />;
      case 'cylinder': return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
      case 'cone': return <coneGeometry args={[0.5, 1, 32]} />;
      case 'torus': return <torusGeometry args={[0.4, 0.1, 16, 100]} />;
      case 'torusKnot': return <torusKnotGeometry args={[0.4, 0.1, 128, 32]} />;
      case 'dodecahedron': return <dodecahedronGeometry args={[0.5]} />;
      case 'octahedron': return <octahedronGeometry args={[0.5]} />;
      case 'capsule': return <capsuleGeometry args={[0.3, 0.4, 4, 16]} />;
      case 'tetrahedron': return <tetrahedronGeometry args={[0.5]} />;
      case 'icosahedron': return <icosahedronGeometry args={[0.5]} />;
      case 'tube': return <cylinderGeometry args={[0.5, 0.5, 1, 32, 1, true]} />;
      case 'pyramid': return <coneGeometry args={[0.5, 1, 4]} />;
      case 'star': return <octahedronGeometry args={[0.5]} />; // Placeholder for star
      default: return <boxGeometry />;
    }
  };

  return (
    <mesh
      ref={meshRef}
      name={object.id}
      position={object.position}
      rotation={object.rotation}
      scale={object.scale}
      castShadow
      receiveShadow
      onClick={(e) => {
        e.stopPropagation();
        onSelect(object.id);
      }}
    >
      {getGeometry()}
      <meshStandardMaterial 
        color={object.color} 
        emissive={isSelected ? object.color : 'black'}
        emissiveIntensity={isSelected ? 0.3 : 0}
        roughness={0.1}
        metalness={0.6}
      />
      {isSelected && <Outlines thickness={2} color="#6366f1" />}
    </mesh>
  );
};

export default Shape;
