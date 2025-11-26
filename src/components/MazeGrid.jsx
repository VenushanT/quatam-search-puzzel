import React from 'react';

const MazeGrid = ({ grid, visitedCells = [], pathCells = [] }) => {
  const getCellColor = (r, c, cell) => {
    const isVisited = visitedCells.some(([vr, vc]) => vr === r && vc === c);
    const isPath = pathCells.some(([pr, pc]) => pr === r && pc === c);

    if (isPath) return 'bg-yellow-400 animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.8)]';
    if (cell === 2) return 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)] z-10'; // Start
    if (cell === 3) return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] z-10'; // End
    if (isVisited) return 'bg-blue-500/50 animate-fade-in';

    switch (cell) {
      case 0: return 'bg-gray-800 border border-gray-700/50'; // Wall
      case 1: return 'bg-gray-900/50'; // Path
      default: return 'bg-gray-900/50';
    }
  };

  if (!grid || grid.length === 0) return null;

  const rows = grid.length;
  const cols = grid[0].length;

  return (
    <div
      className="grid gap-0.5 bg-gray-900 p-3 rounded-xl shadow-2xl border border-gray-800 backdrop-blur-sm"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
      }}
    >
      {grid.map((row, rIndex) => (
        row.map((cell, cIndex) => (
          <div
            key={`${rIndex}-${cIndex}`}
            className={`w-6 h-6 ${getCellColor(rIndex, cIndex, cell)} rounded-sm transition-all duration-300`}
          />
        ))
      ))}
    </div>
  );
};

export default MazeGrid;
