import React from 'react';
import { GameMode } from '../../types';

/**
 * Props for Scoreboard component.
 */
export interface ScoreboardProps {
  gameMode: GameMode | null;
  level: number;
  score: number;
  linesCleared: number;
  timer: number;
  sprintGoal: number;
  digGoal: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ gameMode, level, score, linesCleared, timer, sprintGoal, digGoal }) => {

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderContent = () => {
    switch (gameMode) {
      case 'sprint':
        return (
          <>
            <div className="text-white text-lg font-mono mb-2 text-center w-full flex justify-center">
              Time: {formatTime(timer)}
            </div>
            <div className="text-white text-lg font-mono text-center w-full flex justify-center">
              Lines: {linesCleared} / {sprintGoal}
            </div>
          </>
        );
      case 'dig':
        return (
          <>
            <div className="text-white text-lg font-mono mb-2 text-center w-full flex justify-center">
              Time: {formatTime(timer)}
            </div>
            <div className="text-white text-lg font-mono text-center w-full flex justify-center">
              Cleared: {linesCleared} / {digGoal}
            </div>
          </>
        );
      case 'zen':
        return (
          <>
            <div className="text-white text-lg font-mono mb-2 text-center w-full flex justify-center">
              Score: {score}
            </div>
            <div className="text-white text-lg font-mono text-center w-full flex justify-center">
              Lines: {linesCleared}
            </div>
          </>
        );
      case 'endless':
      default:
        return (
          <>
            <div className="text-white text-lg font-mono mb-2 text-center w-full flex justify-center">
              Level: {level}
            </div>
            <div className="text-white text-lg font-mono mb-2 text-center w-full flex justify-center">
              Score: {score}
            </div>
            <div className="text-white text-lg font-mono text-center w-full flex justify-center">
              Lines: {linesCleared}
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex flex-col items-center mt-4">
      {renderContent()}
    </div>
  )
};

export default React.memo(Scoreboard); 