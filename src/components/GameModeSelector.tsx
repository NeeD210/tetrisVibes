"use client";

import React from 'react';
import Image from 'next/image';
import { GameMode } from '../types';

interface GameModeSelectorProps {
  onSelectMode: (mode: GameMode) => void;
  onOpenSettings: () => void;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({ onSelectMode, onOpenSettings }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="mb-10 text-center">
        <Image src="/tetris_logo.png" alt="Tetris Logo" width={250} height={125} priority />
      </div>
      <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
        <button
          onClick={() => onSelectMode('endless')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded text-lg transition-colors"
        >
          Endless
        </button>
        <button
          onClick={() => onSelectMode('survival')}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded text-lg transition-colors"
        >
          Survival
        </button>
        <button
          onClick={() => onSelectMode('zen')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded text-lg transition-colors"
        >
          Zen
        </button>
        <button
          onClick={() => onSelectMode('dig')}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded text-lg transition-colors"
        >
          Dig Race
        </button>
        <button
          onClick={() => onSelectMode('sprint')}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded text-lg transition-colors"
        >
          Sprint
        </button>
        <button
          disabled
          className="bg-gray-800 text-gray-500 font-bold py-3 px-4 rounded text-lg cursor-not-allowed"
        >
          Multiplayer
        </button>
      </div>
      <div className="w-full max-w-md">
        <button
          onClick={onOpenSettings}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded text-lg transition-colors w-1/2 mx-auto block"
        >
          Settings
        </button>
      </div>
    </div>
  );
};

export default GameModeSelector;