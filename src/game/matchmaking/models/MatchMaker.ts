import { GameMatch } from "./GameMatch.js";
import { QueuedPlayer } from "./QueuedPlayer.js";

export class MatchMaker{
    private matches:Map<string,GameMatch>;
    private queue:QueuedPlayer[] //TODO: cambiar por usuario

    public createMatch():string{
        let id=this.matches.values.length+""
        this.matches.set(id,null);
        return id
    }
    public enqueue(item:QueuedPlayer){
        this.queue.unshift(item)
    }

    public dequeue():QueuedPlayer|undefined{
        return this.queue.shift()
    }

    public queueLength():number{
        return this.queue.length
    }
}

