import React, { useState } from "react";
import SudokuGrid from "./components/SudokuGrid";
import Controls from "./components/Controls";
import { generateSudokuPuzzle, solveSudoku } from "./utils/SudokuUtils";
import "./App.css";

const App = () => {
  const [grid, setGrid] = useState(Array(9).fill(Array(9).fill(0)));
  const [initialGrid, setInitialGrid] = useState(Array(9).fill(Array(9).fill(0))); // Zachowujemy oryginalną planszę
  const [fixedCells, setFixedCells] = useState(Array(9).fill(Array(9).fill(false))); // Śledzenie stałych komórek
  const [isSolved, setIsSolved] = useState(false);
  const [message, setMessage] = useState("");
  const [difficulty, setDifficulty] = useState("medium"); // Domyślny poziom trudności
  const [selectedNumber, setSelectedNumber] = useState(null); // Wybrana liczba do wpisania

  const handleGenerate = () => {
    let numToRemove;
    switch (difficulty) {
      case "easy":
        numToRemove = 30;
        break;
      case "medium":
        numToRemove = 40;
        break;
      case "hard":
        numToRemove = 50;
        break;
      default:
        numToRemove = 40;
    }

    const puzzle = generateSudokuPuzzle(numToRemove);
    setGrid(puzzle);
    setInitialGrid(JSON.parse(JSON.stringify(puzzle))); // Zapamiętujemy wygenerowaną planszę
    setFixedCells(puzzle.map((row) => row.map((cell) => cell !== 0)));

    setIsSolved(false);
    setMessage(`New ${difficulty} puzzle generated. Good luck!`);
  };

  const handleSolve = () => {
    // Zrób kopię oryginalnej planszy
    const solvedGrid = JSON.parse(JSON.stringify(initialGrid)); 

    // Przeiteruj przez komórki i ustaw je na 0 tam, gdzie użytkownik wprowadził liczbę
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (!fixedCells[row][col]) {
          solvedGrid[row][col] = 0; // Ustawia komórki, które użytkownik edytował, na 0
        }
      }
    }

    // Rozwiąż sudoku bez uwzględniania wprowadzonych liczb
    if (solveSudoku(solvedGrid)) {
      setGrid(solvedGrid);
      setIsSolved(true);
      setMessage("Puzzle solved!");
    } else {
      setMessage("No solution exists!");
    }
  };

  const handleReset = () => {
    const resetGrid = initialGrid.map((row) => [...row]); // Przywracamy oryginalną planszę
    setGrid(resetGrid);
    setMessage("Your inputs have been cleared. Ready to try again!");
  };

  const handleCellClick = (row, col) => {
    if (!fixedCells[row][col]) {
      const newGrid = JSON.parse(JSON.stringify(grid));
      newGrid[row][col] = selectedNumber !== null ? selectedNumber : 0; // Usuń liczbę, jeśli wybrano "Delete"
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
    setDifficulty(e.target.value);
  };

  const handleNumberSelect = (number) => {
    setSelectedNumber(number);
  };

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

  const isValidCell = (grid, row, col) => {
    const num = grid[row][col];
    if (num === 0) return false;

    for (let i = 0; i < 9; i++) {
      if (i !== col && grid[row][i] === num) return false;
    }

    for (let i = 0; i < 9; i++) {
      if (i !== row && grid[i][col] === num) return false;
    }

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

      <SudokuGrid grid={grid} fixedCells={fixedCells} onCellClick={handleCellClick} isSolved={isSolved} />

      <div className="number-selector">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <button key={number} className={selectedNumber === number ? "selected" : ""} onClick={() => handleNumberSelect(number)}>
            {number}
          </button>
        ))}
        <button className={selectedNumber === null ? "selected" : ""} onClick={() => handleNumberSelect(null)}>
        🧽
        </button>
      </div>

      <Controls onGenerate={handleGenerate} onSolve={handleSolve} onReset={handleReset} onCheckSolution={handleCheckSolution} />

      {message && <div className={`message ${isSolved ? "success" : "error"}`}>{message}</div>}
    </div>
  );
};

export default App;
