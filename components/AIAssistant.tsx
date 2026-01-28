
import React, { useState } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { generateDesignAssistant } from '../services/geminiService';
import { ShapeObject } from '../types';

interface AIAssistantProps {
  onAddObjects: (newObjects: Partial<ShapeObject>[]) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onAddObjects }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    try {
      const suggestedObjects = await generateDesignAssistant(input);
      onAddObjects(suggestedObjects);
      setInput('');
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la génération avec l'IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-80 bg-slate-800 border-l border-slate-700 h-full flex flex-col p-4 gap-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="text-indigo-400" size={20} />
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Assistant Magic 3D</h2>
      </div>
      
      <p className="text-xs text-slate-400">
        Décris ce que tu veux créer (ex: "un porte-crayon", "une fusée") et l'IA ajoutera les formes pour toi.
      </p>

      <div className="relative mt-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ex: Une petite voiture..."
          rows={4}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          disabled={loading}
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !input.trim()}
          className="absolute bottom-3 right-3 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 rounded-md transition-colors"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mt-4">
        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
          <h3 className="text-xs font-semibold text-slate-300 mb-2">Conseils :</h3>
          <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-4">
            <li>Sois précis sur les formes</li>
            <li>L'IA utilise des primitives de base</li>
            <li>Tu peux modifier les formes après</li>
            <li>Idéal pour dégrossir un projet</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
