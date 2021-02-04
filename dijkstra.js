class Dijkstra extends ShortestPath {
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
        const result = this.executeDijkstra(visitedCells);
        this.showShortestPath(visitedCells, result.shortestPath, result.shortestDistance);
    }

    executeDijkstra(visitedCells) {
        const queue = new PriorityQueue(this.compare);
        const distances = Array(this.rowLen).fill().map(() => Array(this.colLen).fill(Number.MAX_SAFE_INTEGER));
        const neighbors = this.getNeighbors();
        const rows = neighbors.rows;
        const cols = neighbors.cols;

        let node = {
            loc : this.start,
            dist : 0,
            path : [this.start]
        };
        queue.offer(node);
        while(visitedCells.length != rowsLen*colsLen && !queue.isEmpty()) {
            let curr = queue.poll();
            if(curr.loc[0] == this.target[0] && curr.loc[1] == this.target[1]) {
                return {
                    shortestPath : curr.path,
                    shortestDistance : curr.dist
                };
            }
            for(let k=0;k<rows.length;k++) {
                const neighborR = curr.loc[0]+rows[k];
                const neighborC = curr.loc[1]+cols[k];
                if(neighborR >= 0 && neighborR < this.rowLen && neighborC >= 0 && neighborC < this.colLen 
                    && !this.visited[neighborR][neighborC] && distances[neighborR][neighborC] > curr.dist+1 && this.grid[neighborR][neighborC].status != 'obstacle') {
                        let newPath = [...curr.path];
                        newPath.push([neighborR, neighborC]);
                        node = {
                            loc : [neighborR, neighborC],
                            dist : curr.dist+1,
                            path : newPath
                        }
                        distances[neighborR][neighborC] = curr.dist+1;
                        queue.offer(node);
                }
            }
            this.visited[curr.loc[0]][curr.loc[1]] = true;
            visitedCells.push(this.grid[curr.loc[0]][curr.loc[1]]);
        }
        return this.getPathNotFoundResult();
    }

    compare(element1, element2) {
        return element1.dist < element2.dist;
    }
}