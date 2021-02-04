const body = document.querySelector('body');
const visualizeBtn = document.getElementById('visualize');
const resetBtn = document.getElementById('reset-visualize');
const selectedAlgo = body.querySelector('#algorithms');
const useDiagonals = body.querySelector('#useDiagonals');
const results = body.querySelector('#results');
const rowsLen = 20;
const colsLen = 40;
let state = 'idle'; 

class Cell {
    row;
    col;
    status;
    tdElement;

    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.status = 'normal';
    }
 
}

class Table {
    grid = [];
    start;
    target; 
    movingCell;

    constructor(rows, cols) {
        for(let r=0;r<rows;r++) {
            this.grid[r] = [];
            for(let c=0;c<cols;c++) {
                this.grid[r][c] = new Cell(r, c);
            }
        }

        //TO-DO
        this.start = [10,20];
        this.target = [16,32];
        this.movingCell = {};
    }

    render() {
        const table = document.createElement('table');
        table.classList.add('table');
        this.grid.forEach(row => {
            const tr = document.createElement('tr');
            table.appendChild(tr);
            row.forEach(cell => {
                const td = document.createElement('td');
                td.classList.add('cell');
                if(cell.row == this.start[0] && cell.col == this.start[1]) {
                    cell.status = 'start';
                    td.classList.add('start-cell');
                }
                else if(cell.row == this.target[0] && cell.col == this.target[1]) {
                    cell.status = 'target';
                    td.classList.add('target-cell');
                } else {
                    td.classList.add('normal');
                }
                cell.tdElement = td;
                td.addEventListener('mousedown', this.mouseDownHandle.bind(this, cell));
                td.addEventListener('mouseup', this.mouseUpHandle.bind(this, cell));
                td.addEventListener('mouseenter', this.mouseEnterHandle.bind(this, cell));
                tr.appendChild(td);
            });
        });
        body.querySelector('.main-grid').appendChild(table);
    }

    mouseDownHandle(cell) {
        event.preventDefault();
        if(state == 'running') {
            return;
        }
        if(cell.status == 'normal' || cell.status == 'obstacle') {
            cell.tdElement.classList.toggle('obstacle');
            cell.tdElement.classList.toggle('normal');
            cell.status = cell.status == 'normal' ? 'obstacle' : 'normal';
        } 
        this.movingCell = cell;
    }

    mouseUpHandle(cell) {
        event.preventDefault();
        if(this.movingCell.status === undefined || cell.status == 'obstacle' || state == 'running') {
            this.movingCell = {};
            return;
        }
        if(this.movingCell.status == 'start' && cell.status != 'target') {
            this.movingCell.tdElement.classList.remove('start-cell');
            cell.tdElement.classList.add('start-cell');
            cell.status = 'start';
            this.start = [cell.row, cell.col];
        } else if(this.movingCell.status == 'target' && cell.status != 'start') {
            this.movingCell.tdElement.classList.remove('target-cell');
            cell.tdElement.classList.add('target-cell');
            cell.status = 'target';
            this.target = [cell.row, cell.col];
        } 
        this.movingCell = {};
     }

     mouseEnterHandle(cell) {
         event.preventDefault();
         if(this.movingCell.status === undefined || state == 'running') {
             return;
         }
         if(this.movingCell.status == 'obstacle') {
            if(cell.status == 'normal' || cell.status == 'obstacle') {
                cell.tdElement.classList.toggle('obstacle');
                cell.tdElement.classList.toggle('normal');
                cell.status = cell.status == 'normal' ? 'obstacle' : 'normal';
            }
         } 
     }

    runAlgorithm() {
        if(state == 'running') {
            return;
        }
        this.clearAlgorithm();
        const selectedAlgoVal = selectedAlgo.value;
        let algo;

        if(selectedAlgoVal == 'BFS') {
            algo = new BFS(this.start, this.target, this.grid, useDiagonals.checked);
        } else if(selectedAlgoVal == 'Dijkstra') {
            algo = new Dijkstra(this.start, this.target, this.grid, useDiagonals.checked);
        } else if(selectedAlgoVal == 'A*') {
            algo = new AStar(this.start, this.target, this.grid, useDiagonals.checked);
        } else if(selectedAlgoVal == 'DFS') {
            algo = new DFS(this.start, this.target, this.grid, useDiagonals.checked);
        }
        disableActions();
        state = 'running';
        algo.runAlgorithm();
    }

    resetTable() {
        if(state == 'running') {
            return;
        }
        this.start = [10,20];
        this.target = [16,32];
        this.movingCell = {};
        updateResults('--');
        this.clearAlgorithm(true);
    }

    clearAlgorithm(clearObstacles = false) {
        for(let r=0;r<rowsLen;r++) {
            for(let c=0;c<colsLen;c++) {
                const cell = this.grid[r][c];
                if(cell.status == 'obstacle' && !clearObstacles) {
                    continue;
                }
                cell.status = 'normal';
                cell.tdElement.classList.remove(...cell.tdElement.classList);
                cell.tdElement.classList.add('cell');
                if(cell.row == this.start[0] && cell.col == this.start[1]) {
                    cell.status = 'start';
                    cell.tdElement.classList.add('start-cell');
                } else if(cell.row == this.target[0] && cell.col == this.target[1]) {
                    cell.status = 'target';
                    cell.tdElement.classList.add('target-cell');
                } else {
                    cell.tdElement.classList.add('normal');
                }
            }
        }
    }
}

const updateAlgoithmDescription = function() {
    if(state == 'running') {
        return;
    }
    const desc = body.querySelector('#description');
    const selectedAlgoVal = selectedAlgo.value;
    desc.innerHTML = body.querySelector("[value='" + selectedAlgoVal + "']").dataset.info;
};

const disableActions = function() {
    visualizeBtn.setAttribute('disabled', true);
    resetBtn.setAttribute('disabled', true);
    useDiagonals.setAttribute('disabled', true);
    selectedAlgo.setAttribute('disabled', true);
};

const enableActions = function() {
    visualizeBtn.removeAttribute('disabled');
    resetBtn.removeAttribute('disabled');
    useDiagonals.removeAttribute('disabled');
    selectedAlgo.removeAttribute('disabled');
};

const updateResults = function(shortestDistance) {
    results.innerText = "distance: "+ shortestDistance;
};

const table = new Table(rowsLen, colsLen);
table.render();
updateAlgoithmDescription();
visualizeBtn.addEventListener('click', table.runAlgorithm.bind(table));
resetBtn.addEventListener('click', table.resetTable.bind(table));
selectedAlgo.addEventListener('change', updateAlgoithmDescription);
body.onmouseup = function() {
  table.movingCell = {};
}