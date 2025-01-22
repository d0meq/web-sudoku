import React from "react";

const SudokuGrid = ({ grid, onCellChange }) => {
  return (
    <div className="sudoku-grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="sudoku-row">
          {row.map((cell, colIndex) => (
            <input
              key={colIndex}
              type="text"
              className="sudoku-cell"
              value={cell === 0 ? "" : cell}
              onChange={(e) => onCellChange(rowIndex, colIndex, e.target.value)}
              maxLength="1"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SudokuGrid;