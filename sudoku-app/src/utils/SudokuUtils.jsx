import { random } from "lodash";

export const isSafe = (grid, row, col, num) => {
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num || grid[x][col] === num) {
      return false;
    }
  }
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) {
        return false;
      }
    }
  }
  return true;
};

export const solveSudoku = (grid) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) {
              return true;
            }
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

export const generateCompleteSudoku = () => {
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
  solveSudoku(grid);
  return grid;
};

export const removeNumbers = (grid, numToRemove) => {
  for (let i = 0; i < numToRemove; i++) {
    while (true) {
      const row = random(0, 8);
      const col = random(0, 8);
      if (grid[row][col] !== 0) {
        const backup = grid[row][col];
        grid[row][col] = 0;
        const tempGrid = JSON.parse(JSON.stringify(grid));
        if (solveSudoku(tempGrid)) {
          break;
        } else {
          grid[row][col] = backup;
        }
      }
    }
  }
  return grid;
};

export const generateSudokuPuzzle = (numToRemove = 30) => {
  const completeGrid = generateCompleteSudoku();
  return removeNumbers(completeGrid, numToRemove);
};