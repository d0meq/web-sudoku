import React from "react";

const Controls = ({ onGenerate, onSolve, onReset }) => {
  return (
    <div className="controls">
      <button onClick={onGenerate}>Generate Puzzle</button>
      <button onClick={onSolve}>Solve Puzzle</button>
      <button onClick={onReset}>Reset</button>
    </div>
  );
};

export default Controls;