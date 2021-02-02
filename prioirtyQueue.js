class PriorityQueue {
    collection;
    algo;

    constructor(algo) {
        this.collection = [];
        this.algo = algo;
    }

    offer(element){
        if (this.isEmpty()){ 
           this.collection.push(element);
        } else {
            let added = false;
            for (let i = 0; i < this.collection.length; i++){
                if (this.compare(element, this.collection[i])){ 
                    this.collection.splice(i, 0, element);
                    added = true;
                    break;
                }
            }
            if (!added){
                this.collection.push(element);
            }
        }
    }

    remove(element) {
        const copy = [...this.collection];
        this.collection = [];
        for(let i=0;i<copy.length;i++) {
            let elem = copy[i];
            if(elem.loc[0] == element.loc[0] && elem.loc[1] == element.loc[1]) {
                continue;
            }
            this.offer(elem);
        }
    }

    poll() {
        let element = this.collection.shift();
        return element;
    }

    peek() {
        let element = this.collection.peek();
        return element;
    }

    isEmpty() {
        return (this.collection.length === 0) 
    }

    compare(element1, element2) {
        if(this.algo == 'dijkstra') {
            return element1.dist < element2.dist;
        } else if(this.algo == 'aStar') {
            return element1.g + element1.h < element2.g + element2.h;
        } else {
            return element1 < element2;
        }
    }
}