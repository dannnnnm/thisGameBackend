import { COLLISION_COMPONENT, HEALTH_COMPONENT, OWNER_COMPONENT, POSITION_COMPONENT, RENDER_COMPONENT } from "../components/constants.js";
import { OwnerComponent } from "../components/ownerComponent.js";
import { PositionComponent } from "../components/positionComponent.js";
import { MOVEMENT_SPEED } from "../game.js";
import { getRndInteger, playSound } from "../utils/utils.js";
import { BaseSystem } from "./baseSystem.js";


const epsilon=0.05
export class CollisionSystem extends BaseSystem{
    #player1Collisions
    #player2Collisions
    #player1Position
    #player2Position

    //mutaciones
    #bouncingBetty
    #staticBetty
    #risingTension
    #repelPhys
    arenaElement
    constructor(player1Id,player2Id,componentManager,config:any={},logger){
        
        super(componentManager,logger)
        this.arenaElement=document.getElementById("arenaZone")
        this.#player1Collisions=this.componentManager.getEntityComponentByType(player1Id,COLLISION_COMPONENT)
        this.#player2Collisions=this.componentManager.getEntityComponentByType(player2Id,COLLISION_COMPONENT)
        this.#player1Position=this.componentManager.getEntityComponentByType(player1Id,POSITION_COMPONENT)
        this.#player2Position=this.componentManager.getEntityComponentByType(player2Id,POSITION_COMPONENT)
        this.#bouncingBetty=config.bouncingBetty
        this.#staticBetty=config.staticBetty
        this.#risingTension=config.risingTension!=null?config.risingTension:1
        console.log("rising tension is",this.#risingTension)
        this.#repelPhys=config.repelPhys
    }

    update(){
        this._checkPlayersInbounds()
        this._checkPlayersCollision()
        this._checkProjectileCollision()
    }
    _checkPlayersInbounds(){
        this._playerInbounds(this.#player1Position,this.#player1Collisions)
        this._playerInbounds(this.#player2Position,this.#player2Collisions)
    }

    _playerInbounds(positionComponent,collisionComponent){
        let futureX=positionComponent.x+(positionComponent.velocity.x*MOVEMENT_SPEED);
        let futureY=positionComponent.y+(positionComponent.velocity.y*MOVEMENT_SPEED);
        let result=true;

        this._OOBFailsafe(positionComponent,collisionComponent);

        if (futureX<this.arenaElement.getBoundingClientRect().left || futureX+collisionComponent.width>this.arenaElement.getBoundingClientRect().right){
            positionComponent.velocity.x=0;
            result=false
        }
        if (futureY<this.arenaElement.getBoundingClientRect().top || futureY+collisionComponent.height>this.arenaElement.getBoundingClientRect().bottom){
            positionComponent.velocity.y=0;
            result=false
        }

        
        return result
        
    }

    _projectileInbounds(positionComponent,collisionComponent){
        let futureX=positionComponent.x+(positionComponent.velocity.x*MOVEMENT_SPEED);
        let futureY=positionComponent.y+(positionComponent.velocity.y*MOVEMENT_SPEED);
        let result=true;

        
        //TODO: función de OOB especial para projectiles, eliminarlos si es necesario
        if (futureX<this.arenaElement.getBoundingClientRect().left || futureX+collisionComponent.width>this.arenaElement.getBoundingClientRect().right){
            result=false
        }
        if (futureY<this.arenaElement.getBoundingClientRect().top || futureY+collisionComponent.height>this.arenaElement.getBoundingClientRect().bottom){
            result=false
        }


        
        return result
        
    }

    _OOBFailsafe(positionComponent,collisionComponent){
        let arenaBounds=this.arenaElement.getBoundingClientRect()
        if (positionComponent.x<arenaBounds.left || positionComponent.x+collisionComponent.width>arenaBounds.right){
            positionComponent.x=getRndInteger(arenaBounds.left+10,arenaBounds.right-10)    
        }
        if (positionComponent.x+collisionComponent.width<arenaBounds.left || positionComponent.x>arenaBounds.right){
            positionComponent.x=getRndInteger(arenaBounds.left+10,arenaBounds.right-10)    
        }
        if (positionComponent.y<arenaBounds.top || positionComponent.y+collisionComponent.height>arenaBounds.bottom){
            positionComponent.y=getRndInteger(arenaBounds.top+10,arenaBounds.bottom-10)
        }
        if (positionComponent.y+positionComponent.height<arenaBounds.top || positionComponent.y>arenaBounds.bottom){
            positionComponent.y=getRndInteger(arenaBounds.top+10,arenaBounds.bottom-10)
        }
    }

    _checkPlayersCollision(){
        let player1Width=this.#player1Collisions.width
        let player2Width=this.#player2Collisions.width
        let player1Height=this.#player1Collisions.height
        let player2Height=this.#player2Collisions.height

        let overlapResult=overlaps(this.#player1Position.asVector(),this.#player2Position.asVector(),player1Width,player2Width,player1Height,player2Height)
        if (overlapResult[0] && overlapResult[1]){
            console.log("player overlap!!!111")
            //estas dos líneas son honestamente magia de chatgpt: tiene que ver con encontrar si es más distante el componente X o Y para decidir en qué eje
            //pueden moverse los jugadores al estar chocando.
            const overlapX = Math.abs((this.#player1Position.x + this.#player1Collisions.width / 2) - (this.#player2Position.x + this.#player2Collisions.width / 2));
            const overlapY = Math.abs((this.#player1Position.y + this.#player1Collisions.height / 2) - (this.#player2Position.y + this.#player2Collisions.height / 2));

            if (overlapX > overlapY) {
                // Move along Y axis
                let newPos1=this.#player1Position.asVector();
                newPos1.x+=this.#player1Position.velocity.x*this.#player1Position.movementSpeed;
                let newPos2=this.#player2Position.asVector();
                newPos2.x+=this.#player2Position.velocity.x*this.#player2Position.movementSpeed;
                let futurePosOverlap=overlaps(newPos1,newPos2,player1Width,player2Width,player1Height,player2Height);
                if (this.#player1Position.velocity.x==this.#player2Position.velocity.x){

                }
                else if (futurePosOverlap[0] && futurePosOverlap[1]){
                    this.#player1Position.velocity.x=0;
                    this.#player2Position.velocity.x=0;
                }
            } else {
                // Move along X axis
                let newPos1=this.#player1Position.asVector();
                newPos1.y+=this.#player1Position.velocity.y*this.#player1Position.movementSpeed;;
                let newPos2=this.#player2Position.asVector();
                newPos2.y+=this.#player2Position.velocity.y*this.#player2Position.movementSpeed;;
                // evitar que no puedan retroceder.
                let futurePosOverlap=overlaps(newPos1,newPos2,player1Width,player2Width,player1Height,player2Height);
                if (this.#player1Position.velocity.y==this.#player2Position.velocity.y){

                }
                else if (futurePosOverlap[0] && futurePosOverlap[1]){
                    this.#player1Position.velocity.y=0;
                    this.#player2Position.velocity.y=0;
                }
                
            }
        }

    }

    
    _checkProjectileCollision(){
        this.componentManager.getComponentsByType(OWNER_COMPONENT).forEach((ownerComponent:OwnerComponent) => {
            if (!ownerComponent.enabled) return; //continue 
            
            let projectilePositionComponent=this.componentManager.getEntityComponentByType(ownerComponent.entityId,POSITION_COMPONENT)
            let projectileCollisionComponent=this.componentManager.getEntityComponentByType(ownerComponent.entityId,COLLISION_COMPONENT)
            let projectileRenderComponent=this.componentManager.getEntityComponentByType(ownerComponent.entityId,RENDER_COMPONENT)
            if (!this._projectileInbounds(projectilePositionComponent,projectileCollisionComponent)){
                if(this.#bouncingBetty){
                    this._bounceProjectile(ownerComponent,projectilePositionComponent,projectileCollisionComponent,projectileRenderComponent,this.arenaElement.getBoundingClientRect())
                    
                    playSound("audio/bounce.wav",0.2)
                }
                else{
                    this._disableProjectile(ownerComponent,projectilePositionComponent)
                }
            
            }
            this._checkProjectileOverlaps(ownerComponent,projectilePositionComponent,projectileCollisionComponent)        
        });
    }

    _bounceProjectile(ownerComponent,projectilePositionComponent,projectileCollisionComponent,projectileRenderComponent,boundingBox){
        //hacer que el creador sea vulnerable
        ownerComponent.ownerId="NONE"
        //let arenaBound=arenaElement.getBoundingClientRect();
        let changedDirection=false;
        let futureX=projectilePositionComponent.x+projectilePositionComponent.velocity.x*projectilePositionComponent.movementSpeed;
        let futureY=projectilePositionComponent.y+projectilePositionComponent.velocity.y*projectilePositionComponent.movementSpeed;
        if(futureY<boundingBox.top){
            projectilePositionComponent.velocity.y*=-1;
            changedDirection=true
            ownerComponent.bounces++
        }
        if(futureY+projectileCollisionComponent.height>boundingBox.bottom){
            projectilePositionComponent.velocity.y*=-1;
            changedDirection=true
            ownerComponent.bounces++
        }
        if(futureX<boundingBox.left){
            projectilePositionComponent.velocity.x*=-1;
            changedDirection=true
            ownerComponent.bounces++
        }
        if(futureX+projectileCollisionComponent.width>boundingBox.right){
            projectilePositionComponent.velocity.x*=-1;
            changedDirection=true
            ownerComponent.bounces++
        }

        //looks good to me!
        let newProjPost=new PositionComponent(projectileCollisionComponent.entityId,projectilePositionComponent.x,projectilePositionComponent.y,projectileCollisionComponent.movementSpeed)
        newProjPost.x+=newProjPost.velocity.x*newProjPost.movementSpeed
        newProjPost.y+=newProjPost.velocity.y*newProjPost.movementSpeed
        this._OOBFailsafe(newProjPost,projectileCollisionComponent);
        
        //variacion de rebote
        let shouldVary=getRndInteger(0,99)%6==0
        let positiveCoordinate=getRndInteger(0,99)%7==0
        if (changedDirection){
            projectileRenderComponent.blur()
        }
        if (projectilePositionComponent.velocity.x==0 && shouldVary && !this.#staticBetty){
            projectilePositionComponent.velocity.x=positiveCoordinate?1:-1
        }
        if (projectilePositionComponent.velocity.y==0 && shouldVary && !this.#staticBetty){
            projectilePositionComponent.velocity.y=positiveCoordinate?1:-1
        }

        
        if (this.#risingTension && changedDirection){
            console.log("damage b4",ownerComponent.damage)
            ownerComponent.damage+=this.#risingTension;
            console.log("damage l8r",ownerComponent.damage)
        }
    }

    _disableProjectile(ownerComponent,projectilePositionComponent){
        ownerComponent.disable()
        projectilePositionComponent.velocity.x=0
        projectilePositionComponent.velocity.y=0
        //this.componentManager.getEntityComponentByType(ownerComponent.entityId,RENDER_COMPONENT).invisible()
    }

    _checkProjectileOverlaps(ownerComponent,projectilePositionComponent,projectileCollisionComponent){
        this.componentManager.getComponentsByTypes(COLLISION_COMPONENT,POSITION_COMPONENT,HEALTH_COMPONENT).forEach((components)=>{
            if (components.size<1) return; //continue
            //console.log("components",components)
            let otherCollisionComponent=components[COLLISION_COMPONENT]
            let otherPositionComponent=components[POSITION_COMPONENT]
            let otherHealthComponent=components[HEALTH_COMPONENT]

            let sameEntity=otherCollisionComponent.entityId==projectileCollisionComponent.entityId
            let otherIsOwner=otherCollisionComponent.entityId==ownerComponent.ownerId

            if (sameEntity || otherIsOwner) return //continue
            
            if (otherHealthComponent){
                let positionOverlaps=overlaps(projectilePositionComponent.asVector(),otherPositionComponent.asVector(),
                                                projectileCollisionComponent.width,otherCollisionComponent.width,
                                                    projectileCollisionComponent.height,otherCollisionComponent.height)
                if (positionOverlaps[0] && positionOverlaps[1]){
                    if (this.#repelPhys && otherHealthComponent.alive){
                        let roll=getRndInteger(0,otherHealthComponent.maxHealth)//*(2/3)
                        console.log("roll",roll)
                        let bounces=ownerComponent.bounces==0?1:ownerComponent.bounces
                        if (roll>=otherHealthComponent.percentage && roll%bounces==0){
                            let projectileRenderComponent=this.componentManager.getEntityComponentByType(projectileCollisionComponent.entityId,RENDER_COMPONENT)
                            let otherRenderComponent=this.componentManager.getEntityComponentByType(otherCollisionComponent.entityId,RENDER_COMPONENT)
                            this._bounceProjectile(ownerComponent,projectilePositionComponent,projectileCollisionComponent,projectileRenderComponent,otherRenderComponent.htmlElement().getBoundingClientRect())
                            ownerComponent.divertedBy=otherHealthComponent.entityId
                            ownerComponent.ownerId=otherHealthComponent.entityId
                            return
                        }
                        else if (ownerComponent.divertedBy==otherHealthComponent.entityId){
                            ownerComponent.divertedBy=null
                            ownerComponent.ownerId="NONE"
                            return
                        }
                    }
                    
                    otherHealthComponent.hurt(ownerComponent.damage)
                    ownerComponent.disable()
                    projectilePositionComponent.velocity.x=0
                    projectilePositionComponent.velocity.y=0
                    this.componentManager.getEntityComponentByType(ownerComponent.entityId,RENDER_COMPONENT).invisible()
                    
                    playSound("audio/projhit.wav",0.25)
                }
            }
        })
    }
    

    
}

export function overlaps(pos1,pos2,w1,w2,h1,h2){
    //console.log("x1", pos1.x,"y1",pos1.y)
    //console.log("w1 ",w1, "h1 ",h1)
    //console.log("w2 ",w2, "h2 ",h2)
    let overlapX=(pos1.x>=pos2.x && pos1.x<=pos2.x+w2) || (pos2.x>=pos1.x && pos2.x<=pos1.x+w1);
    let overlapY=(pos1.y>=pos2.y && pos1.y<=pos2.y+h2) || (pos2.y>=pos1.y && pos2.y<=pos1.y+h1);
    return [overlapX,overlapY]
}