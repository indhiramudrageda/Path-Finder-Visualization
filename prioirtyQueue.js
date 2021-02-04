class PriorityQueue {
    collection;
    algo;

    constructor(compareHandler) {
        this.compareHandler = compareHandler;
        this.collection = [];
    }

    offer(element){
        if (this.isEmpty()){ 
           this.collection.push(element);
        } else {
            let added = false;
            for (let i = 0; i < this.collection.length; i++){
                if (this.compareHandler(element, this.collection[i])){ 
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
}