import React from "react";

const SudokuGrid = ({ grid, fixedCells, onCellClick, isSolved }) => {
  return (
    <div className="sudoku-container">
      <div className="sudoku-grid">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`sudoku-cell ${fixedCells[rowIndex][colIndex] ? "generated" : ""} ${
                isSolved ? "solved" : ""
              }`}
              onClick={() => onCellClick(rowIndex, colIndex)}
            >
              {cell !== 0 ? cell : ""}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SudokuGrid;