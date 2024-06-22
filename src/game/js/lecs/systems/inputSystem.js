
import { clickResetButton } from "../../script.js";
import { HEALTH_COMPONENT, MELEE_COMPONENT, POSITION_COMPONENT, PROJECTILE_COMPONENT } from "../components/constants.js";
import { FacingDirection } from "../components/positionComponent.js";
import { MOVEMENT_SPEED } from "../game.js";
import { BaseSystem } from "./baseSystem.js";

export class InputSystem extends BaseSystem{
    #movementSpeed
    #pressedKeys=new Set();

    #player1Id
    #player2Id
    #player1HealthComponent
    #player2HealthComponent

    #meleeOnly
    constructor(player1Id,player2Id,componentManager,config={movementSpeed:MOVEMENT_SPEED,meleeOnly:false},logger){
        super(componentManager,logger)
        this.#movementSpeed=config.movementSpeed || 1;
        this._initInput();
        this.#player1Id=player1Id
        this.#player2Id=player2Id
        this.#player1HealthComponent=this.componentManager.getEntityComponentByType(player1Id,HEALTH_COMPONENT);
        this.#player2HealthComponent=this.componentManager.getEntityComponentByType(player2Id,HEALTH_COMPONENT);

        this.#meleeOnly=config.meleeOnly
    }

    update(){

        this._updatePlayers();
        
    }

    _updatePlayers(){
        this._updatePlayer1()
        this._updatePlayer2()

    }

    _updatePlayer1(){
        if (!this.#player1HealthComponent.alive) return;
        let player1Pos=this.componentManager.getEntityComponentByType(this.#player1Id,POSITION_COMPONENT)
        let player1Melee=this.componentManager.getEntityComponentByType(this.#player1Id,MELEE_COMPONENT)
        let player1Projectile=this.componentManager.getEntityComponentByType(this.#player1Id,PROJECTILE_COMPONENT)
        if (this.#pressedKeys.has("ArrowRight") || this.#pressedKeys.has("Numpad3")){
            player1Pos.velocity.x+=1
        }
        if (this.#pressedKeys.has("ArrowLeft") || this.#pressedKeys.has("Numpad1")){
            player1Pos.velocity.x-=1
        }
        if (this.#pressedKeys.has("ArrowUp") || this.#pressedKeys.has("Numpad5")){
            player1Pos.velocity.y-=1
        }
        if (this.#pressedKeys.has("ArrowDown") || this.#pressedKeys.has("Numpad2")){
            player1Pos.velocity.y+=1
        }
        if (this.#pressedKeys.has("Backslash")){
            player1Melee.prepareAttack()
            //this.#pressedKeys.delete("Space")
        }
        if (this.#pressedKeys.has("Quote") && !this.#meleeOnly){
            player1Projectile.prepareAttack()
            //this.#pressedKeys.delete("KeyM")
        }
        this._setFacingDirection(player1Pos)
    }

    _updatePlayer2(){
        if (!this.#player2HealthComponent.alive) return;
        let player2Pos=this.componentManager.getEntityComponentByType(this.#player2Id,POSITION_COMPONENT)
        let player2Melee=this.componentManager.getEntityComponentByType(this.#player2Id,MELEE_COMPONENT)
        let player2Projectile=this.componentManager.getEntityComponentByType(this.#player2Id,PROJECTILE_COMPONENT)
        if (this.#pressedKeys.has("KeyD")){
            player2Pos.velocity.x+=1
        }
        if (this.#pressedKeys.has("KeyA")){
            player2Pos.velocity.x-=1
        }
        if (this.#pressedKeys.has("KeyW")){
            player2Pos.velocity.y-=1
        }
        if (this.#pressedKeys.has("KeyS")){
            player2Pos.velocity.y+=1
        }
        if (this.#pressedKeys.has("KeyG")){
            player2Melee.prepareAttack()
            //this.#pressedKeys.delete("KeyG")
        }
        if (this.#pressedKeys.has("KeyH") && !this.#meleeOnly){
            player2Projectile.prepareAttack()
            //this.#pressedKeys.delete("KeyH")
        }
        this._setFacingDirection(player2Pos)
    }

    _setFacingDirection(positionComponent){
        let velocity=positionComponent.velocity
        if (velocity.x == velocity.y){
            if (velocity.x==1){
                positionComponent.facingDirection=FacingDirection.DDOWNRIGHT
            }
            else if (velocity.x==-1){
                positionComponent.facingDirection=FacingDirection.DUPLEFT
            }
        }
        else if (velocity.x == velocity.y*-1){
            if (velocity.x==1){
                positionComponent.facingDirection=FacingDirection.DUPRIGHT
            }
            else if (velocity.x==-1){
                positionComponent.facingDirection=FacingDirection.DDOWNLEFT
            }
        }
        else if(velocity.x==1){
            positionComponent.facingDirection=FacingDirection.RIGHT
        }
        else if(velocity.x==-1){
            positionComponent.facingDirection=FacingDirection.LEFT
        }
        else if(velocity.y==1){
            positionComponent.facingDirection=FacingDirection.DOWN
        }
        else if(velocity.y==-1){
            positionComponent.facingDirection=FacingDirection.UP
        }
    }


    _initInput() {
        document.addEventListener("keydown", this._keyDown.bind(this));
        document.addEventListener("keyup",this._keyUp.bind(this));
    }

    _keyDown(event){
        this.#pressedKeys.add(event.code)

        console.log(event.code)
    }

    _keyUp(event){
        if (event.code=="KeyR"){
            clickResetButton()
        }
        this.#pressedKeys.delete(event.code)
    }

}