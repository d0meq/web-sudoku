import React, { useState } from "react";
import SudokuGrid from "./components/SudokuGrid";
import Controls from "./components/Controls";
import { generateSudokuPuzzle, solveSudoku } from "./utils/SudokuUtils";
import "./App.css";

const App = () => {
  const [grid, setGrid] = useState(Array(9).fill(Array(9).fill(0)));
  const [fixedCells, setFixedCells] = useState(Array(9).fill(Array(9).fill(false))); // Track fixed cells
  const [isSolved, setIsSolved] = useState(false);
  const [message, setMessage] = useState("");
  const [difficulty, setDifficulty] = useState("medium"); // Default difficulty
  const [selectedNumber, setSelectedNumber] = useState(null); // Track selected number

  const handleGenerate = () => {
    let numToRemove;
    switch (difficulty) {
      case "easy":
        numToRemove = 30; // Fewer blanks for easy difficulty
        break;
      case "medium":
        numToRemove = 40; // Moderate blanks for medium difficulty
        break;
      case "hard":
        numToRemove = 50; // More blanks for hard difficulty
        break;
      default:
        numToRemove = 40; // Default to medium
    }

    const puzzle = generateSudokuPuzzle(numToRemove); // Generate puzzle based on difficulty
    setGrid(puzzle);

    // Mark pre-filled cells as fixed
    const newFixedCells = puzzle.map((row) => row.map((cell) => cell !== 0));
    setFixedCells(newFixedCells);

    setIsSolved(false);
    setMessage(`New ${difficulty} puzzle generated. Good luck!`);
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
    setFixedCells(Array(9).fill(Array(9).fill(false))); // Reset fixed cells
    setIsSolved(false);
    setMessage("Grid reset. Ready for a new puzzle!");
  };

  const handleCellClick = (row, col) => {
    if (!fixedCells[row][col] && selectedNumber !== null) {
      const newGrid = JSON.parse(JSON.stringify(grid)); // Deep copy the grid
      newGrid[row][col] = selectedNumber;
      setGrid(newGrid);
    }
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

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value); // Update difficulty
  };

  const handleNumberSelect = (number) => {
    setSelectedNumber(number); // Set the selected number
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
      <div className="difficulty-selector">
        <label htmlFor="difficulty">Select Difficulty: </label>
        <select id="difficulty" value={difficulty} onChange={handleDifficultyChange}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <SudokuGrid
        grid={grid}
        fixedCells={fixedCells}
        onCellClick={handleCellClick}
        isSolved={isSolved}
      />
      <div className="number-selector">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <button
            key={number}
            className={selectedNumber === number ? "selected" : ""}
            onClick={() => handleNumberSelect(number)}
          >
            {number}
          </button>
        ))}
      </div>
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