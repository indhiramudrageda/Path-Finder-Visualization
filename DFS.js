class DFS extends ShortestPath {
    visited;
    rowLen;
    colLen;
    minDist;
    shortestPath;

    constructor(start, target, grid, useDiagonals = false) {
        super(start, target, grid, useDiagonals);
        this.rowLen = grid.length;
        this.colLen = grid[0].length;
        this.visited = Array(this.rowLen).fill().map(() => Array(this.colLen).fill(false));
        this.minDist = Number.MAX_SAFE_INTEGER;
        this.shortestPath = [];
    }

    runAlgorithm() {
        const visitedCells = [];
        const result = this.executeDFS(this.grid[this.start[0]][this.start[1]], visitedCells, [], 0);  
        this.showShortestPath(visitedCells, result.shortestPath, result.shortestDistance);
    }

    executeDFS(src, visitedCells, currPath, dist) {
        visitedCells.push(src);
        this.visited[src.row][src.col] = true;
        let newPath = [...currPath];
        newPath.push([src.row, src.col]);
        if(src.row == this.target[0] && src.col == this.target[1]) {
            return {
                shortestPath : newPath,
                shortestDistance : dist
            };
        }

        const neighbors = this.getNeighbors();
        const rows = neighbors.rows;
        const cols = neighbors.cols;

        for(let k=0;k<rows.length;k++) {
            const neighborR = src.row+rows[k];
            const neighborC = src.col+cols[k];
            if(neighborR >= 0 && neighborR < this.rowLen && neighborC >= 0 && neighborC < this.colLen 
                && !this.visited[neighborR][neighborC] && this.grid[neighborR][neighborC].status != 'obstacle') {
                    const shortestPath = this.executeDFS(this.grid[neighborR][neighborC], visitedCells, newPath, dist+1);
                    if(shortestPath.length != 0) {
                        return shortestPath;
                    }
            }
        }
        return this.getPathNotFoundResult();
    }
}