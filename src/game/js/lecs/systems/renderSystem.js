
import { HEALTH_COMPONENT, POSITION_COMPONENT, RENDER_COMPONENT } from "../components/constants.js";
import { BaseSystem } from "./baseSystem.js";


const DEATH_FILTER="invert(100%)";
export class RenderSystem extends BaseSystem{

    #player1Id
    #player2Id
    #player1HealthComponent
    #player2HealthComponent
    constructor(player1Id,player2Id,componentManager,config={},logger){
        super(componentManager,logger)
        this.#player1Id=player1Id
        this.#player2Id=player2Id
        this.#player1HealthComponent=componentManager.getEntityComponentByType(player1Id,HEALTH_COMPONENT)
        this.#player2HealthComponent=componentManager.getEntityComponentByType(player2Id,HEALTH_COMPONENT)

    }

    update(){
        this.componentManager.getComponentsByTypes(RENDER_COMPONENT,POSITION_COMPONENT).forEach(entityComponents => {
            const renderComponent = entityComponents[RENDER_COMPONENT];
            const positionComponent = entityComponents[POSITION_COMPONENT];
            renderComponent.htmlElement().style.top=positionComponent.y+"px"
            renderComponent.htmlElement().style.left=positionComponent.x+"px"

            let playerNum=renderComponent.entityId==this.#player2Id?-1:1
            if (positionComponent.direction.x==-1){
                renderComponent.flip(-1*playerNum)
            }
            else if (positionComponent.direction.x==1){
                renderComponent.flip(1*playerNum)
            }
            if (!this.#player1HealthComponent.alive && renderComponent.entityId==this.#player1Id && !renderComponent.playedDeathAnim){
                //renderComponent.htmlElement().style.filter=DEATH_FILTER
                renderComponent.death();
            }
            if (!this.#player2HealthComponent.alive && renderComponent.entityId==this.#player2Id && !renderComponent.playedDeathAnim){
                //renderComponent.htmlElement().style.filter=DEATH_FILTER
                renderComponent.death();
            }
        });

    }
    
}