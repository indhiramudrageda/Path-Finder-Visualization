class ShortestPath {
    start;
    target;
    grid;
    useDiagonals;

    constructor(start, target, grid, useDiagonals = false) {
        this.start = start;
        this.target = target;
        this.grid = grid;
        this.useDiagonals = useDiagonals;
    }

    runAlgorithm() {
        console.log("runAlgorithm: in shortest path");
    }

    showShortestPath(visitedCells, path, shortestDistance) {
        let i = 1;
        for(let visitedCell of visitedCells) {
            setTimeout(() => {
                visitedCell.tdElement.classList.add('visited-path');
            }, 10*i);
            i++;
        }

        setTimeout(() => {
            let j = 0;
            for(let cell of path) {
                setTimeout(() => {
                    const currCell = this.grid[cell[0]][cell[1]];
                    currCell.tdElement.classList.add('shortest-path');
                    currCell.tdElement.classList.remove('visited-path');
                }, 8*j);
                j++;
            }
        }, 10*visitedCells.length); 
        setTimeout(() => {
            enableActions();
            state = 'idle';
            shortestDistance = shortestDistance == Number.MAX_SAFE_INTEGER ? '--' : shortestDistance;
            updateResults(shortestDistance);
        }, 10*visitedCells.length+8*path.length);
    }

    getNeighbors() {
        if(this.useDiagonals == true) {
            return {rows: [-1, 0, 0, 1, -1, -1, 1, 1], cols: [0, -1, 1, 0, -1, 1, -1, 1]};
        } else {
            return {rows: [-1, 0, 0, 1], cols: [0, -1, 1, 0]};
        }
    }

    getPathNotFoundResult() {
        return {
            shortestPath : [],
            shortestDistance : Number.MAX_SAFE_INTEGER
        };
    }
}