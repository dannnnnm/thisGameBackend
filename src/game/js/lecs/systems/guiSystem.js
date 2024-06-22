import { HEALTH_COMPONENT, MANA_COMPONENT, MELEE_COMPONENT, POSITION_COMPONENT } from "../components/constants.js";
import { BaseSystem } from "./baseSystem.js";
import { overlaps } from "./collisionSystem.js";

export class GuiSystem extends BaseSystem{
    
    #player1HpBarElement
    #player2HpBarElement

    #player1HpTextElement
    #player2HpTextElement

    #player1ComboTextElement
    #player2ComboTextElement

    #player1HealthComponent
    #player2HealthComponent

    #player1MeleeComponent
    #player2MeleeComponent

    #player1ManaTextElement
    #player2ManaTextElement

    #player1ManaComponent
    #player2ManaComponent

    #player1ManaBar
    #player2ManaBar
    constructor(player1Id,player2Id,componentManager,config={},logger){
        super(componentManager,logger)
        this.#player1HpBarElement=document.getElementById("heroHealth")
        this.#player2HpBarElement=document.getElementById("enemyHealth")

        this.#player1HpTextElement=document.getElementById("p1-health")
        this.#player2HpTextElement=document.getElementById("p2-health")

        this.#player1ComboTextElement=document.getElementById("p1-combo")
        this.#player2ComboTextElement=document.getElementById("p2-combo")

        this.#player1ManaTextElement=document.getElementById("p1-mana")
        this.#player2ManaTextElement=document.getElementById("p2-mana")

        this.#player1ManaBar=document.getElementById("heroMana")
        this.#player2ManaBar=document.getElementById("enemyMana")


        this.#player1HealthComponent=componentManager.getEntityComponentByType(player1Id,HEALTH_COMPONENT)
        this.#player2HealthComponent=componentManager.getEntityComponentByType(player2Id,HEALTH_COMPONENT)

        this.#player1MeleeComponent=componentManager.getEntityComponentByType(player1Id,MELEE_COMPONENT)
        this.#player2MeleeComponent=componentManager.getEntityComponentByType(player2Id,MELEE_COMPONENT)

        this.#player1ManaComponent=componentManager.getEntityComponentByType(player1Id,MANA_COMPONENT)
        this.#player2ManaComponent=componentManager.getEntityComponentByType(player2Id,MANA_COMPONENT)
        //console.log("p1h ",this.#player1HealthComponent.currentHealth, "p2h ",this.#player2HealthComponent.currentHealth)
        this._setup()
    }

    _setup(){
        this.#player1HpBarElement.setAttribute("aria-valuemax",this.#player1HealthComponent.maxHealth);
        this.#player2HpBarElement.setAttribute("aria-valuemax",this.#player2HealthComponent.maxHealth);
        this.update();
        
    }

    _updateBars(){
        this.#player1HpTextElement.innerText="HP: "+this.#player1HealthComponent.currentHealth+"/"+this.#player1HealthComponent.maxHealth;
        this.#player2HpTextElement.innerText="HP: "+this.#player2HealthComponent.currentHealth+"/"+this.#player2HealthComponent.maxHealth;
        
        
        this.#player1ComboTextElement.innerText="Combo: "+this.#player1MeleeComponent.combo
        this.#player2ComboTextElement.innerText="Combo: "+this.#player2MeleeComponent.combo

        this.#player1ManaTextElement.innerText="Mana: "+this.#player1ManaComponent.currentMana
        this.#player2ManaTextElement.innerText="Mana: "+this.#player2ManaComponent.currentMana

        this.#player1ManaBar.style.width=this.#player1ManaComponent.percentage+"%"
        this.#player2ManaBar.style.width=this.#player2ManaComponent.percentage+"%"
        //let highestHealth=0;
        /*if (enemy.maxhealth>hero.maxhealth){
            highestHealth=enemy.maxhealth    
        }
        else{
            highestHealth=hero.maxhealth;
        }
        console.log("highest health ", highestHealth)*/

        

        //let heroPercentage=(index/hero.maxhealth)*100;
        //console.log("p1 hp percentage",this.#player1HealthComponent.percentage)
        this.#player1HpBarElement.setAttribute("aria-valuenow",this.#player1HealthComponent.percentage);
        this.#player1HpBarElement.style.width=this.#player1HealthComponent.percentage+"%";
        
        this.#player2HpBarElement.setAttribute("aria-valuenow",this.#player2HealthComponent.percentage);
        this.#player2HpBarElement.style.width=this.#player2HealthComponent.percentage+"%";
    }

    update(){
        this._updateBars();
    }

    

}