import { POSITION_COMPONENT } from "../components/constants.js";
import { PositionComponent } from "../components/positionComponent.js";
import { MOVEMENT_SPEED } from "../game.js";
import { BaseSystem } from "./baseSystem.js";

export class MovementSystem extends BaseSystem{
    #doomMove:boolean
    constructor(componentManager,config={doomMove:false},logger){
        super(componentManager,logger)
        this.#doomMove=config.doomMove
    }

    update(){
        this.componentManager.getComponentsByType(POSITION_COMPONENT).forEach((positionComponent:PositionComponent) => {
            positionComponent.moving=positionComponent.velocity.x!=0 || positionComponent.velocity.y!=0
            let normalizedVelocityVector=positionComponent.velocity.normalized()
            if (this.#doomMove) normalizedVelocityVector=positionComponent.velocity
            if (positionComponent.velocity.x!=0){
                //console.log("x normalized ", positionComponent.velocity.normalized().x)
                positionComponent.x+=normalizedVelocityVector.x*positionComponent.movementSpeed;
                if (positionComponent.inputControlled) positionComponent.velocity.x=0;
                
            }
            if (positionComponent.velocity.y!=0){
                positionComponent.y+=normalizedVelocityVector.normalized().y*positionComponent.movementSpeed;
                if (positionComponent.inputControlled) positionComponent.velocity.y=0;
            }
        
            
        });
    }
}