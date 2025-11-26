import React, { useState, useEffect } from 'react';
import Maze3D from './components/Maze3D';
import { Play, RefreshCw, Settings, Zap, Activity, Clock, Layers, GitBranch } from 'lucide-react';
import { generateMaze } from './utils/mazeGenerator';
import { bfs } from './algorithms/bfs';
import { dfs } from './algorithms/dfs';
import { quantumSearch } from './algorithms/quantum';

function App() {
  const [rows, setRows] = useState(21);
  const [cols, setCols] = useState(21);
  const [grid, setGrid] = useState([]);
  const [visitedCells, setVisitedCells] = useState([]);
  const [pathCells, setPathCells] = useState([]);
  const [isAutoChanging, setIsAutoChanging] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Ready');
  const [speed, setSpeed] = useState(50);

  useEffect(() => {
    handleRegenerate();
  }, []);

  useEffect(() => {
    if (!isAutoChanging || isRunning) return;

    const interval = setInterval(() => {
      setGrid(prevGrid => {
        if (!prevGrid.length) return prevGrid;
        const newGrid = prevGrid.map(row => [...row]);
        const r = Math.floor(Math.random() * (rows - 2)) + 1;
        const c = Math.floor(Math.random() * (cols - 2)) + 1;

        if ((r === 1 && c === 1) || (r === rows - 2 && c === cols - 2)) return prevGrid;

        if (newGrid[r][c] === 0) newGrid[r][c] = 1;
        else if (newGrid[r][c] === 1) newGrid[r][c] = 0;

        return newGrid;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isAutoChanging, isRunning, rows, cols]);

  const handleRegenerate = () => {
    const newMaze = generateMaze(rows, cols);
    setGrid(newMaze);
    setVisitedCells([]);
    setPathCells([]);
    setIsRunning(false);
    setStatus('Ready');
  };

  const visualizeSearch = async (algorithm, name) => {
    if (isRunning) return;
    setIsRunning(true);
    setStatus(`Running ${name}...`);
    setVisitedCells([]);
    setPathCells([]);

    const start = [1, 1];
    const end = [rows - 2, cols - 2];
    const { visitedOrder, path } = algorithm(grid, start, end);

    for (let i = 0; i < visitedOrder.length; i++) {
      const batch = Array.isArray(visitedOrder[i][0]) ? visitedOrder[i] : [visitedOrder[i]];
      setVisitedCells(prev => [...prev, ...batch]);
      await new Promise(resolve => setTimeout(resolve, speed));
    }

    if (path.length > 0) {
      setStatus('Path Found!');
      for (let i = 0; i < path.length; i++) {
        setPathCells(prev => [...prev, path[i]]);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    } else {
      setStatus('No Path Found');
    }

    setIsRunning(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans text-white">
      {/* 3D Background */}
      <Maze3D
        grid={grid}
        visitedCells={visitedCells}
        pathCells={pathCells}
      />

      {/* Header Overlay */}
      <div className="absolute top-0 left-0 w-full p-4 md:p-8 z-10 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white drop-shadow-2xl">
          QUANTUM<span className="text-orange-600">MAZE</span>
        </h1>
        <p className="text-gray-400 mt-2 text-sm md:text-lg font-medium tracking-wide flex items-center gap-2">
          <Activity className="w-4 h-4 text-orange-500" />
          Status: <span className="text-white">{status}</span>
        </p>
      </div>

      {/* Control Panel */}
      <div className="absolute bottom-0 left-0 w-full md:top-1/2 md:right-8 md:left-auto md:bottom-auto md:-translate-y-1/2 z-20 md:w-96 p-4 md:p-0">
        <div className="backdrop-blur-2xl bg-black/80 md:bg-black/60 border-t md:border border-white/10 p-6 md:p-8 rounded-t-3xl md:rounded-3xl shadow-2xl ring-1 ring-white/5 max-h-[60vh] md:max-h-none overflow-y-auto">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
              <Settings className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
              Control Panel
            </h2>
            <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-orange-500 animate-pulse' : 'bg-gray-600'}`} />
          </div>

          <div className="space-y-4 md:space-y-6">
            {/* Main Actions */}
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={handleRegenerate}
                disabled={isRunning}
                className="group relative overflow-hidden flex items-center justify-center gap-3 px-6 py-3 md:py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className="w-5 h-5 text-gray-300 group-hover:rotate-180 transition-transform duration-700" />
                <span className="font-semibold text-gray-200">Regenerate Universe</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => visualizeSearch(bfs, 'BFS')}
                disabled={isRunning}
                className="group flex flex-col items-center justify-center gap-2 px-2 py-3 md:py-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="p-2 bg-blue-500 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 md:w-5 md:h-5 text-white fill-current" />
                </div>
                <span className="font-bold text-[10px] md:text-xs text-blue-100">BFS</span>
              </button>

              <button
                onClick={() => visualizeSearch(dfs, 'DFS')}
                disabled={isRunning}
                className="group flex flex-col items-center justify-center gap-2 px-2 py-3 md:py-4 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="p-2 bg-orange-500 rounded-xl shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  <GitBranch className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <span className="font-bold text-[10px] md:text-xs text-orange-100">DFS</span>
              </button>

              <button
                onClick={() => visualizeSearch(quantumSearch, 'Quantum')}
                disabled={isRunning}
                className="group flex flex-col items-center justify-center gap-2 px-2 py-3 md:py-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="p-2 bg-purple-500 rounded-xl shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                  <Zap className="w-4 h-4 md:w-5 md:h-5 text-white fill-current" />
                </div>
                <span className="font-bold text-[10px] md:text-xs text-purple-100">Quantum</span>
              </button>
            </div>

            {/* Settings */}
            <div className="p-4 md:p-6 bg-black/40 rounded-2xl border border-white/5 space-y-4 md:space-y-6">
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-300">Entropy</span>
                </div>
                <button
                  onClick={() => setIsAutoChanging(!isAutoChanging)}
                  className={`w-12 h-7 md:w-14 md:h-8 rounded-full transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${isAutoChanging ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 left-1 w-5 h-5 md:w-6 md:h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${isAutoChanging ? 'translate-x-5 md:translate-x-6' : ''}`} />
                </button>
              </div>

              <div className="space-y-2 md:space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    <span className="font-medium text-gray-300">Speed</span>
                  </div>
                  <span className="text-blue-400 font-mono">{speed}ms</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
