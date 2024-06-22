import { getRndInteger } from "../utils/utils.js";
import { BaseComponent } from "./baseComponent.js";

export class ProjectileComponent extends BaseComponent{
    #willAttack:boolean
    #damageMax:number;
    #damageMin:number;
    ownerId:string
    cooledDown:boolean
    #cooldownTime:number
    constructor(entityId,damageMin=5+3,damageMax=10+3,coolDownTime=800){
        super(entityId)
        this.#willAttack=false;
        this.#damageMin=damageMin
        this.#damageMax=damageMax
        this.cooledDown=true
        this.#cooldownTime=coolDownTime
    }

    get canAttack(){
        return this.cooledDown
    }

    recoverAttack(){
        let cancellationId=setTimeout(function(){
            this.cooledDown=true
            clearTimeout(cancellationId)
        }.bind(this),this.#cooldownTime)
    }

    
    



    prepared(){
        return this.#willAttack
    }



    prepareAttack(){
        if (this.cooledDown){
            this.#willAttack=true
            this.cooledDown=false
        }
        
    }



    attack(){
        if (this.#willAttack){
            this.#willAttack=false
            this.recoverAttack()
            return getRndInteger(this.#damageMin,this.#damageMax)
        }
        return 0;
    }


    miss(){
        this.#willAttack=false
    }

    forceUnprepare(){
        this.cooledDown=true
        this.#willAttack=false
    }
}