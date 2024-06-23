import { Server, Socket } from "socket.io";
import { MatchMaker } from "./models/MatchMaker.js";
import { QueuedPlayer } from "./models/QueuedPlayer.js";

let gameSock:Server;

export function initSocket(server){
    gameSock=new Server(server);
    let matchMaker=new MatchMaker();
    gameSock.on("connection",(socket)=>{
        let user=socket.handshake.headers
        let decoded:any=user //decodificar un jwt o algo idk
        if (matchMaker.queueLength()==0){
            //no hay nadie en cola, debe esperar
            let enqueued=new QueuedPlayer(decoded.name,socket)
            matchMaker.enqueue(enqueued)
        }
        else{
            let p1=matchMaker.dequeue();
            let p2=decoded;
            let matchId=matchMaker.createMatch();
            p1.websocket.join(matchId)
            socket.join(matchId);
            
        }


        
        


    })
}

function setSocketCallbacks(gameSocket:Socket<any, any, any, any>,playerPair:playerSocketPair,matchId:string){
    playerPair.socket.on(GameEvents.move,()=>{
        gameSocket.to(matchId).emit(GameEvents.move,
            {
                //emitir posicion y todo eso
            }
        )
    })
}

export let GameEvents={
    move:"move",
    melee:"melee",
    throw:"throw",
    bounce:"bounce",


}

type playerSocketPair={player:string,socket:Socket<any, any, any, any>}


