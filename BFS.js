class BFS extends ShortestPath {
    visited;
    rowLen;
    colLen;

    constructor(start, target, grid, useDiagonals = false) {
        super(start, target, grid, useDiagonals);
        this.rowLen = grid.length;
        this.colLen = grid[0].length;
        this.visited = Array(this.rowLen).fill().map(() => Array(this.colLen).fill(false));
    }

    runAlgorithm() {
        const visitedCells = [];
        const result = this.executeBFS(visitedCells);
        this.showShortestPath(visitedCells, result.shortestPath, result.shortestDistance);         
    }

    executeBFS(visitedCells) {
        const queue = [];
        const paths = [];
        const neighbors = this.getNeighbors();
        const rows = neighbors.rows;
        const cols = neighbors.cols;

        queue.push(this.start);
        paths.push([this.start]);
        this.visited[this.start[0]][this.start[1]] = true;
        visitedCells.push(this.grid[this.start[0]][this.start[1]]);
        let dist = 0;

        while(queue.length != 0) {
            let size = queue.length;
            while(size-- > 0) {
                const curr = queue.shift();
                const currPath = paths.shift();
                if(curr[0] == this.target[0] && curr[1] == this.target[1]) {
                    return {
                        shortestPath : currPath,
                        shortestDistance : dist
                    };
                }
    
                for(let k=0;k<rows.length;k++) {
                    const neighborR = curr[0]+rows[k];
                    const neighborC = curr[1]+cols[k];
                    if(neighborR >= 0 && neighborR < this.rowLen && neighborC >= 0 && neighborC < this.colLen 
                        && !this.visited[neighborR][neighborC] && this.grid[neighborR][neighborC].status != 'obstacle') {
                            queue.push([neighborR, neighborC]);
                            let newPath = [...currPath];
                            newPath.push([neighborR, neighborC]);
                            paths.push(newPath);
                            this.visited[neighborR][neighborC] = true;
                    }
                }
                visitedCells.push(this.grid[curr[0]][curr[1]]);
            }
            dist++;
        }
        return this.getPathNotFoundResult();
    }
}