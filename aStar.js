class AStar extends ShortestPath{
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
        const result = this.executeAStar(visitedCells);
        this.showShortestPath(visitedCells, result.shortestPath, result.shortestDistance);
    }

    executeAStar(visitedCells) {
        const open = new PriorityQueue('aStar');
        const closed = [];
        const distances = Array(this.rowLen).fill().map(() => Array(this.colLen).fill(Number.MAX_SAFE_INTEGER));
        const neighbors = this.getNeighbors();
        const rows = neighbors.rows;
        const cols = neighbors.cols;

        let node = {
            loc : this.start,
            g : 0,
            h : 0,
            path : [this.start]
        };
        open.offer(node);
        while(!open.isEmpty()) {
            let curr = open.poll();
            if(this.visited[curr.loc[0]][curr.loc[1]]) {
                continue;
            }
                        
            closed.push(curr);
            visitedCells.push(this.grid[curr.loc[0]][curr.loc[1]]);
            this.visited[curr.loc[0]][curr.loc[1]] = true;
            if(curr.loc[0] == this.target[0] && curr.loc[1] == this.target[1]) {
                return {
                    shortestPath : curr.path,
                    shortestDistance : curr.g+curr.h
                };
            }
            
            for(let k=0;k<rows.length;k++) {
                const neighborR = curr.loc[0]+rows[k];
                const neighborC = curr.loc[1]+cols[k];

                if(neighborR >= 0 && neighborR < this.rowLen && neighborC >= 0 && neighborC < this.colLen && 
                    this.grid[neighborR][neighborC].status != 'obstacle' && !this.visited[neighborR][neighborC]) {
                    let newPath = [...curr.path];
                    newPath.push([neighborR, neighborC]);
                    node = {
                        loc : [neighborR, neighborC],
                        path : newPath,
                        g : curr.g+1,     
                        h : this.useDiagonals ? this.getDiagonalDistance([neighborR,neighborC], this.target) : this.getManhattanDistance([neighborR,neighborC], this.target)
                    }
                    
                    if(!this.lowerFPresent(open, [neighborR,neighborC], node.g+node.h) && !this.lowerFPresent(closed, [neighborR,neighborC], node.g+node.h)) {
                        open.offer(node);
                    }
                }
            } 
        }
        return this.getPathNotFoundResult();
    }

    getManhattanDistance(start, target) {
        return Math.abs(start[0] - target[0]) + Math.abs(start[1] - target[1]);
    }

    getDiagonalDistance(start, target) {
        return Math.max(Math.abs(start[0] - target[0]) + Math.abs(start[1] - target[1]));
    }

    lowerFPresent(list, loc, dist) {
        let lowerPresent = false;
        for (let i = 0; i < list.length; i++){
            let element = list[i];
            if(element.loc[0] == loc[0] && element.loc[1] == loc[1] && element.g+element.h <= dist) {
                lowerPresent = true;
            } 
        }
        return lowerPresent;
    }
}