import { getRndInteger } from "../utils/utils.js";
import { BaseComponent } from "./baseComponent.js";

export const OVERGUARD=15
export class HealthComponent extends BaseComponent{
    maxHealth:number;
    currentHealth:number;
    constructor(entityId,maxHealth=getRndInteger(1,100)){
        super(entityId)
        this.maxHealth=maxHealth
        this.currentHealth=this.maxHealth
    }

    hurt(damage){
        this.currentHealth-=damage
        if (this.currentHealth<0){
            this.currentHealth=0
        }
    }
    heal(amount){
        this.currentHealth+=amount
        if (this.currentHealth>this.maxHealth+OVERGUARD){
            this.currentHealth=this.maxHealth
        }
    }
    get percentage(){
        return (this.currentHealth/this.maxHealth)*100
    }
    

    get alive(){
        return this.currentHealth>0
    }
}