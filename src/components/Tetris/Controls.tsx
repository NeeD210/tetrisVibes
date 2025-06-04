import React from 'react';

interface ControlsProps {
  onLeft?: () => void;
  onRight?: () => void;
  onDown?: () => void;
  onRotate?: () => void;
}

export default function Controls({ onLeft, onRight, onDown, onRotate }: ControlsProps) {
  return (
    <div className="flex justify-center gap-4 mt-4">
      <button onClick={onLeft} className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow">◀️</button>
      <button onClick={onRotate} className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow">🔄</button>
      <button onClick={onRight} className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow">▶️</button>
      <button onClick={onDown} className="bg-yellow-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow">⬇️</button>
    </div>
  );
} 