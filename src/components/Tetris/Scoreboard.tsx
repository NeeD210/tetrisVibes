import React from 'react';

/**
 * Props for Scoreboard component.
 */
export interface ScoreboardProps {
  level: number;
  score: number;
  linesCleared: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ level, score, linesCleared }) => (
  <div className="flex flex-col items-center mt-4">
    <div className="text-white text-lg font-mono mb-2 text-center w-full flex justify-center">
      Level: {level}
    </div>
    <div className="text-white text-lg font-mono mb-2 text-center w-full flex justify-center">
      Score: {score}
    </div>
    <div className="text-white text-lg font-mono text-center w-full flex justify-center">
      Lines Cleared: {linesCleared}
    </div>
  </div>
);

export default React.memo(Scoreboard); 