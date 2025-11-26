// 0 = Wall, 1 = Path, 2 = Start, 3 = End

export const generateMaze = (rows, cols) => {
    const grid = Array(rows).fill().map(() => Array(cols).fill(0));

    const directions = [
        [0, 2], [2, 0], [0, -2], [-2, 0]
    ];

    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const isValid = (r, c) => {
        return r > 0 && r < rows - 1 && c > 0 && c < cols - 1;
    };

    const carve = (r, c) => {
        grid[r][c] = 1;
        const dirs = shuffle([...directions]);

        for (let [dr, dc] of dirs) {
            const nr = r + dr;
            const nc = c + dc;

            if (isValid(nr, nc) && grid[nr][nc] === 0) {
                grid[r + dr / 2][c + dc / 2] = 1; // Carve path between
                carve(nr, nc);
            }
        }
    };

    // Start carving from (1, 1)
    carve(1, 1);

    // Set Start and End
    grid[1][1] = 2;
    grid[rows - 2][cols - 2] = 3;

    return grid;
};
