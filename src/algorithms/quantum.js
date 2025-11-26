// Simulates a "quantum" search by exploring all paths "simultaneously" (layer by layer but faster/different visual)
// In a real quantum computer, this would be Grover's algorithm or a quantum walk.
// Here we simulate the "superposition" by returning layers of exploration.

export const quantumSearch = (grid, start, end) => {
    const rows = grid.length;
    const cols = grid[0].length;
    let currentLayer = [[...start]];
    const visited = new Set([`${start[0]},${start[1]}`]);
    const parent = {};
    const visitedOrder = []; // Will contain arrays of nodes visited in each "time step" (layer)

    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    let found = false;

    while (currentLayer.length > 0) {
        const nextLayer = [];
        const currentLayerNodes = [];

        for (const [r, c] of currentLayer) {
            currentLayerNodes.push([r, c]);

            if (r === end[0] && c === end[1]) {
                found = true;
            }

            for (let [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;
                const key = `${nr},${nc}`;

                if (
                    nr >= 0 && nr < rows &&
                    nc >= 0 && nc < cols &&
                    grid[nr][nc] !== 0 &&
                    !visited.has(key)
                ) {
                    visited.add(key);
                    parent[key] = `${r},${c}`;
                    nextLayer.push([nr, nc]);
                }
            }
        }

        visitedOrder.push(currentLayerNodes);
        if (found) break;
        currentLayer = nextLayer;
    }

    // Reconstruct path
    let path = [];
    if (found) {
        let curr = `${end[0]},${end[1]}`;
        while (curr) {
            const [cr, cc] = curr.split(',').map(Number);
            path.push([cr, cc]);
            curr = parent[curr];
        }
        path = path.reverse();
    }

    return { visitedOrder, path };
};
