import { CollisionComponent } from "../components/collisionComponent.js";
import { COLLISION_COMPONENT, HEALTH_COMPONENT, MANA_COMPONENT, MELEE_COMPONENT, POSITION_COMPONENT, PROJECTILE_COMPONENT } from "../components/constants.js";
import { ManaComponent } from "../components/manaComponent.js";
import { OwnerComponent } from "../components/ownerComponent.js";
import { PositionComponent, Vector2D } from "../components/positionComponent.js";
import { RenderComponent } from "../components/renderComponent.js";
import { MOVEMENT_SPEED } from "../game.js";
import { playSound } from "../utils/utils.js";
import { BaseSystem } from "./baseSystem.js";
import { overlaps } from "./collisionSystem.js";

export class ManaSystem extends BaseSystem{

    #player1Id
    #player2Id

    #player1Collisions
    #player2Collisions

    #player1Position
    #player2Position

    #player1Health
    #player2Health

    #player1Mana
    #player2Mana

   

    constructor(player1Id,player2Id,componentManager,config={},logger){
        super(componentManager,logger)
        this.#player1Mana=this.componentManager.getEntityComponentByType(player1Id,MANA_COMPONENT)
        this.#player2Mana=this.componentManager.getEntityComponentByType(player2Id,MANA_COMPONENT)

        this.#player1Id=player1Id
        this.#player2Id=player2Id
        


    }

    update(){
        this.regenMana(this.#player1Mana);
        this.regenMana(this.#player2Mana);
    }

    regenMana(manaComponent){
        if(manaComponent.currentMana<100 && !manaComponent.isRecovering){
            manaComponent.isRecovering=true
            manaComponent.recoverMana()
        }
    }

}