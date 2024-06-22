import { BaseComponent } from "./baseComponent.js"
import { Vector2D } from "./positionComponent.js"

export class CollisionComponent extends BaseComponent{
    x:number;
    y:number;
    width:number;
    height:number;
    onCollision:any;
    constructor(entityId,positionVector,width,height,onCollision=null){
        super(entityId)
        this.x=positionVector.x
        this.y=positionVector.y
        this.width=width
        this.height=height
    }
}