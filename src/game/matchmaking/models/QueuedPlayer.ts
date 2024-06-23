import { Socket } from "socket.io";

export class QueuedPlayer{
    user:string;
    websocket:Socket<any, any, any, any>;
    constructor(user:string,websocket){
        this.user=user;
        this.websocket=websocket;
    }
}