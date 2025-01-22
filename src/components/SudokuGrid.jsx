import React from "react";

const SudokuGrid = ({ grid, fixedCells, onCellChange, isSolved }) => {
  return (
    <div className="sudoku-grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="sudoku-row">
          {row.map((cell, colIndex) => (
            <input
              key={colIndex}
              type="text"
              className={`sudoku-cell ${isSolved && !isValidCell(grid, rowIndex, colIndex) ? "incorrect" : ""}`}
              value={cell === 0 ? "" : cell}
              onChange={(e) => onCellChange(rowIndex, colIndex, e.target.value)}
              maxLength="1"
              disabled={fixedCells[rowIndex][colIndex] || isSolved} // Disable fixed cells and solved grid
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// Helper function to check if a cell is valid
const isValidCell = (grid, row, col) => {
  const num = grid[row][col];
  if (num === 0) return false; // Empty cell is invalid

  // Check row
  for (let i = 0; i < 9; i++) {
    if (i !== col && grid[row][i] === num) return false;
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (i !== row && grid[i][col] === num) return false;
  }

  // Check 3x3 subgrid
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (i !== row && j !== col && grid[i][j] === num) return false;
    }
  }

  return true;
};

export default SudokuGrid;