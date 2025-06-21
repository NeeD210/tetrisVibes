"use client";

import React from 'react';
import { GameMode } from '../types';

interface GameModeSelectorProps {
  onSelectMode: (mode: GameMode) => void;
  onOpenSettings: () => void;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({ onSelectMode, onOpenSettings }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-12 font-geist-mono">Vibe Tetris</h1>
      <div className="grid grid-cols-1 gap-4 w-64">
        <button
          onClick={() => onSelectMode('endless')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded text-lg transition-colors"
        >
          Endless
        </button>
        <button
          onClick={() => onSelectMode('zen')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded text-lg transition-colors"
        >
          Zen
        </button>
        <button
          onClick={() => onSelectMode('sprint')}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded text-lg transition-colors"
        >
          Sprint
        </button>
        <button
          onClick={() => onSelectMode('survival')}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded text-lg transition-colors"
        >
          Survival
        </button>
        <button
          onClick={() => onSelectMode('dig')}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded text-lg transition-colors"
        >
          Dig Race
        </button>
        <button
          onClick={onOpenSettings}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded text-lg transition-colors mt-8"
        >
          Settings
        </button>
        <button
          disabled
          className="bg-gray-700 text-gray-400 font-bold py-3 px-4 rounded text-lg cursor-not-allowed"
        >
          Multiplayer
          <div className="text-center">(Coming Soon)</div>
        </button>
      </div>
    </div>
  );
};

export default GameModeSelector; 