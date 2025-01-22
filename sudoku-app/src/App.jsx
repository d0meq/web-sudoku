import React, { useState } from "react";
import SudokuGrid from "./components/SudokuGrid";
import Controls from "./components/Controls";
import { generateSudokuPuzzle, solveSudoku } from "./utils/sudokuUtils";
import "./App.css";

const App = () => {
  const [grid, setGrid] = useState(Array(9).fill(Array(9).fill(0)));
  const [isSolved, setIsSolved] = useState(false);
  const [message, setMessage] = useState("");

  const handleGenerate = () => {
    const puzzle = generateSudokuPuzzle(30); // Generate a puzzle with 30 cells removed
    setGrid(puzzle);
    setIsSolved(false);
    setMessage("New puzzle generated. Good luck!");
  };

  const handleSolve = () => {
    const solvedGrid = JSON.parse(JSON.stringify(grid)); // Deep copy the grid
    if (solveSudoku(solvedGrid)) {
      setGrid(solvedGrid);
      setIsSolved(true);
      setMessage("Puzzle solved!");
    } else {
      setMessage("No solution exists!");
    }
  };

  const handleReset = () => {
    setGrid(Array(9).fill(Array(9).fill(0)));
    setIsSolved(false);
    setMessage("Grid reset. Ready for a new puzzle!");
  };

  const handleCellChange = (row, col, value) => {
    const newGrid = JSON.parse(JSON.stringify(grid)); // Deep copy the grid
    newGrid[row][col] = value === "" ? 0 : parseInt(value, 10);
    setGrid(newGrid);
    setMessage(""); // Clear message when user makes changes
  };

  const handleCheckSolution = () => {
    const isValid = isSudokuSolvedCorrectly(grid);
    if (isValid) {
      setMessage("Congratulations! The Sudoku is solved correctly.");
      setIsSolved(true);
    } else {
      setMessage("The Sudoku is not solved correctly. Please check your solution.");
    }
  };

  // Helper function to check if the Sudoku is solved correctly
  const isSudokuSolvedCorrectly = (grid) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0 || !isValidCell(grid, row, col)) {
          return false;
        }
      }
    }
    return true;
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

  return (
    <div className="App">
      <h1>Sudoku Generator and Solver</h1>
      <SudokuGrid grid={grid} onCellChange={handleCellChange} isSolved={isSolved} />
      <Controls
        onGenerate={handleGenerate}
        onSolve={handleSolve}
        onReset={handleReset}
        onCheckSolution={handleCheckSolution}
      />
      {message && <div className={`message ${isSolved ? "success" : "error"}`}>{message}</div>}
    </div>
  );
};

export default App;