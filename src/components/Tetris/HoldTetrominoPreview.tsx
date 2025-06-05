import React from 'react';
import { Tetromino, TetrominoType } from './tetrisLogic';

/**
 * Props for HoldTetrominoPreview component.
 */
export interface HoldTetrominoPreviewProps {
  heldTetromino: Tetromino | null;
  TETROMINOES: Record<TetrominoType, number[][][]>;
  TETROMINO_COLORS: Record<TetrominoType, string>;
}

const HoldTetrominoPreview: React.FC<HoldTetrominoPreviewProps> = ({ heldTetromino, TETROMINOES, TETROMINO_COLORS }) => {
  if (!heldTetromino) {
    return (
      <div className="inline-block bg-gray-700 rounded p-2 opacity-50">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="flex">
            {[0, 1, 2, 3].map(j => (
              <div key={j} className="w-4 h-4 border border-gray-600 bg-gray-700" />
            ))}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="inline-block bg-gray-700 rounded p-2">
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="flex">
          {[0, 1, 2, 3].map(j => {
            const shape = TETROMINOES[heldTetromino.type][0];
            const shapeRows = shape.length;
            const shapeCols = shape[0].length;
            const offsetY = Math.floor((4 - shapeRows) / 2);
            const offsetX = Math.floor((4 - shapeCols) / 2);
            let cell = 0;
            if (
              i >= offsetY && i < offsetY + shapeRows &&
              j >= offsetX && j < offsetX + shapeCols
            ) {
              cell = shape[i - offsetY][j - offsetX];
            }
            return (
              <div
                key={j}
                className={`w-4 h-4 border border-gray-600 ${cell ? TETROMINO_COLORS[heldTetromino.type] : 'bg-gray-700'}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default React.memo(HoldTetrominoPreview); 