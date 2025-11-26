export const bfs = (grid, start, end) => {
    const rows = grid.length;
    const cols = grid[0].length;
    const queue = [[...start]];
    const visited = new Set([`${start[0]},${start[1]}`]);
    const parent = {};
    const visitedOrder = [];

    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    while (queue.length > 0) {
        const [r, c] = queue.shift();
        visitedOrder.push([r, c]);

        if (r === end[0] && c === end[1]) {
            // Reconstruct path
            const path = [];
            let curr = `${end[0]},${end[1]}`;
            while (curr) {
                const [cr, cc] = curr.split(',').map(Number);
                path.push([cr, cc]);
                curr = parent[curr];
            }
            return { visitedOrder, path: path.reverse() };
        }

        for (let [dr, dc] of directions) {
            const nr = r + dr;
            const nc = c + dc;
            const key = `${nr},${nc}`;

            if (
                nr >= 0 && nr < rows &&
                nc >= 0 && nc < cols &&
                grid[nr][nc] !== 0 && // Not a wall
                !visited.has(key)
            ) {
                visited.add(key);
                parent[key] = `${r},${c}`;
                queue.push([nr, nc]);
            }
        }
    }

    return { visitedOrder, path: [] };
};
