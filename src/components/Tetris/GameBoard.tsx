import React from 'react';
import { TETROMINOES, TetrominoType, Tetromino } from './tetrisLogic';

type ActiveCell = { active: true; type: TetrominoType };
type GhostCell = { ghost: true; type: TetrominoType };
type BoardCell = TetrominoType | 0 | ActiveCell | GhostCell;
interface GameBoardProps {
  board: BoardCell[][];
  activeTetromino: Tetromino | null;
  ghostTetromino?: Tetromino | null;
  tetrominoColors: Record<TetrominoType, string>;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

export default React.memo(function GameBoard({ board, activeTetromino, ghostTetromino, tetrominoColors }: GameBoardProps) {
  // Copy the board to overlay the active and ghost tetromino
  const displayBoard = board.map(row => [...row]);

  // Overlay ghost tetromino first (so active piece overwrites it visually)
  if (ghostTetromino) {
    const { type, rotation, x, y } = ghostTetromino;
    const shape = TETROMINOES[type][rotation];
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (shape[i][j]) {
          const boardY = y + i;
          const boardX = x + j;
          if (
            boardY >= 0 && boardY < displayBoard.length &&
            boardX >= 0 && boardX < displayBoard[0].length
          ) {
            // Only place ghost if not already occupied by a locked or active cell
            if (displayBoard[boardY][boardX] === 0) {
              displayBoard[boardY][boardX] = { ghost: true, type };
            }
          }
        }
      }
    }
  }

  // Overlay active tetromino
  if (activeTetromino) {
    const { type, rotation, x, y } = activeTetromino;
    const shape = TETROMINOES[type][rotation];
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (shape[i][j]) {
          const boardY = y + i;
          const boardX = x + j;
          if (
            boardY >= 0 && boardY < displayBoard.length &&
            boardX >= 0 && boardX < displayBoard[0].length
          ) {
            displayBoard[boardY][boardX] = { active: true, type };
          }
        }
      }
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-1 mb-4">
      {displayBoard.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => {
            let colorClass = 'bg-gray-800';
            let extraClass = '';
            if (cell === 0) {
              colorClass = 'bg-gray-800';
            } else if (typeof cell === 'object' && 'active' in cell && cell.active) {
              colorClass = tetrominoColors[cell.type] || 'bg-white';
            } else if (typeof cell === 'object' && 'ghost' in cell && cell.ghost) {
              colorClass = tetrominoColors[cell.type] || 'bg-white';
              extraClass = 'opacity-30';
            } else if (typeof cell === 'string') {
              colorClass = tetrominoColors[cell as TetrominoType] || 'bg-white';
            }
            return (
              <div
                key={x}
                className={`w-6 h-6 border border-gray-700 ${colorClass} ${extraClass}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}); 