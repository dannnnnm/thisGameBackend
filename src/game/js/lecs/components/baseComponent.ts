export class BaseComponent{
    entityId:string
    type:string

    constructor(entityId:string){
        this.entityId=entityId;
        this.type=this.constructor.name
    }
}