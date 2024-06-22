import { MOVEMENT_SPEED } from "../game.js";
import { BaseComponent } from "./baseComponent.js";






export class Vector2D{
    x:number;
    y:number;
    constructor(x=0,y=0){
        this.x=x
        this.y=y
    }

    normalized():Vector2D{
        let length=Math.sqrt((this.x*this.x)+(this.y*this.y))
        return new Vector2D(this.x/length,this.y/length)
    }
}

export class FacingDirection{
    #innerVector
    constructor(x,y){
        this.#innerVector=new Vector2D(x,y)
    }

    static LEFT=new FacingDirection(-1,0)
    static RIGHT=new FacingDirection(1,0)
    static UP=new FacingDirection(0,-1)
    static DOWN=new FacingDirection(0,1)
    static DUPRIGHT=new FacingDirection(1,-1)
    static DUPLEFT=new FacingDirection(-1,-1)
    static DDOWNRIGHT=new FacingDirection(1,1)
    static DDOWNLEFT=new FacingDirection(-1,1)


    get facingDirectionVector(){
        return this.#innerVector
    }
    get x(){
        return this.#innerVector.x
    }
}


export class PositionComponent extends BaseComponent{
    x:number;
    y:number;
    movementSpeed:number;
    velocity:Vector2D;
    inputControlled:boolean;
    direction:FacingDirection
    moving:boolean
    constructor(entityId,x,y,facingDirection=FacingDirection.RIGHT,movementSpeed=MOVEMENT_SPEED,inputControlled=false) {
        super(entityId)
        this.moving=false
        this.x=x
        this.y=y
        this.inputControlled=inputControlled
        this.velocity=new Vector2D();
        this.movementSpeed=movementSpeed
        this.direction=facingDirection
        console.log("iniitial direction ", facingDirection)
        
    }

    asVector(){
        return new Vector2D(this.x,this.y)
    }

    set facingDirection(value){
        this.direction=value
    }

    get facingDirection(){
        return this.direction
    }

    facingDirectionAsVector(){
        return this.direction.facingDirectionVector
    }

}