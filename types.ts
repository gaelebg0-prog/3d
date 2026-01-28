
export type ShapeType = 'box' | 'sphere' | 'cylinder' | 'cone' | 'torus' | 'torusKnot' | 'dodecahedron' | 'octahedron' | 'capsule';

export interface ShapeObject {
  id: string;
  type: ShapeType;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  name: string;
}

export interface AppState {
  objects: ShapeObject[];
  selectedId: string | null;
  transformMode: 'translate' | 'rotate' | 'scale';
}
