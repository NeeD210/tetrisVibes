import React from 'react';

interface ScoreProps {
  score?: number;
}

export default function Score({ score = 0 }: ScoreProps) {
  return (
    <div className="text-white text-lg mb-2">Score: {score}</div>
  );
} 