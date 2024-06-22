import { getRndInteger } from "../utils/utils.js";
import { BaseComponent } from "./baseComponent.js";

export class MeleeComponent extends BaseComponent{
    willAttack:boolean
    #damageMax:number
    #damageMin:number
    cooledDown:boolean
    #coolDownTime:number
    combo:number
    constructor(entityId,damageMin=5,damageMax=10,coolDownTime=450){
        super(entityId)
        this.willAttack=false;
        this.#damageMin=damageMin
        this.#damageMax=damageMax
        this.cooledDown=true
        this.#coolDownTime=coolDownTime
        this.combo=0
    }


    prepared(){
        return this.willAttack
    }

    recoverAttack(){
        let cancellationId=setTimeout(function(){
            this.cooledDown=true
            clearTimeout(cancellationId)
        }.bind(this),this.#coolDownTime)
    }


    prepareAttack(){
        //console.log("on preparing...", this)
        if(this.cooledDown){
            this.willAttack=true
            this.cooledDown=false
        }
        
    }

    forceUnprepare(){
        this.willAttack=false;
        this.cooledDown=true
    }



    attack(){
        if (this.willAttack){
            this.willAttack=false
            this.recoverAttack()
            let damage=this.#damageMin+getRndInteger(this.#damageMin,this.#damageMax)*this.combo
            this.combo++
            return damage
        }
        return 0;
    }


    miss(){
        this.willAttack=false
        this.recoverAttack()
        this.combo=0
    }

    
}