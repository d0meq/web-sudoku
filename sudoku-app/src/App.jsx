import React, { useState } from "react";
import SudokuGrid from "./components/SudokuGrid";
import Controls from "./components/Controls";
import { generateSudokuPuzzle, solveSudoku } from "./utils/sudokuUtils";
import "./App.css";

const App = () => {
  const [grid, setGrid] = useState(Array(9).fill(Array(9).fill(0)));

  const handleGenerate = () => {
    const puzzle = generateSudokuPuzzle(30); // Generate a puzzle with 30 cells removed
    setGrid(puzzle);
  };

  const handleSolve = () => {
    const solvedGrid = JSON.parse(JSON.stringify(grid)); // Deep copy the grid
    if (solveSudoku(solvedGrid)) {
      setGrid(solvedGrid);
    } else {
      alert("No solution exists!");
    }
  };

  const handleReset = () => {
    setGrid(Array(9).fill(Array(9).fill(0)));
  };

  const handleCellChange = (row, col, value) => {
    const newGrid = JSON.parse(JSON.stringify(grid)); // Deep copy the grid
    newGrid[row][col] = value === "" ? 0 : parseInt(value, 10);
    setGrid(newGrid);
  };

  return (
    <div className="App">
      <h1>Sudoku Generator and Solver</h1>
      <SudokuGrid grid={grid} onCellChange={handleCellChange} />
      <Controls onGenerate={handleGenerate} onSolve={handleSolve} onReset={handleReset} />
    </div>
  );
};

export default App;