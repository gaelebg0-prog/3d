
import { GoogleGenAI, Type } from "@google/genai";
import { ShapeObject, ShapeType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDesignAssistant = async (prompt: string): Promise<Partial<ShapeObject>[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Conçois un objet 3D simple pour l'impression 3D basé sur la demande suivante : "${prompt}".
    Réponds uniquement par un tableau JSON d'objets contenant :
    - type: 'box' | 'sphere' | 'cylinder' | 'cone' | 'torus' | 'torusKnot' | 'dodecahedron' | 'octahedron' | 'capsule'
    - position: [x, y, z] (entre -10 et 10)
    - scale: [x, y, z] (entre 0.5 et 5)
    - color: code hexadécimal
    - name: nom court descriptif
    Assure-toi que les objets sont posés sur le plateau (y >= 0).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ['box', 'sphere', 'cylinder', 'cone', 'torus', 'torusKnot', 'dodecahedron', 'octahedron', 'capsule'] },
            position: { 
                type: Type.ARRAY, 
                items: { type: Type.NUMBER },
                description: "Array of [x, y, z]"
            },
            scale: { 
                type: Type.ARRAY, 
                items: { type: Type.NUMBER },
                description: "Array of [x, y, z]"
            },
            color: { type: Type.STRING },
            name: { type: Type.STRING }
          },
          required: ['type', 'position', 'scale', 'color', 'name']
        }
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return [];
  }
};
