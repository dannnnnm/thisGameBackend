import { CollisionComponent } from "./components/collisionComponent.js";
import { RENDER_COMPONENT} from "./components/constants.js";
import { HealthComponent } from "./components/healthComponent.js";
import { ManaComponent } from "./components/manaComponent.js";
import { MeleeComponent } from "./components/meleeComponent.js";
import { FacingDirection, PositionComponent } from "./components/positionComponent.js";
import { ProjectileComponent } from "./components/projectileComponent.js";
import { RenderComponent } from "./components/renderComponent.js";
import { ComponentManager } from "./managers/componentManager.js";
import { EntityManager } from "./managers/entityManager.js";
import { SystemManager } from "./managers/systemManager.js";
import { AttackSystem } from "./systems/attackSystem.js";
import { CollisionSystem } from "./systems/collisionSystem.js";
import { GuiSystem } from "./systems/guiSystem.js";
import { InputSystem } from "./systems/inputSystem.js";
import { ManaSystem } from "./systems/manaSystem.js";
import { MovementSystem } from "./systems/movementSystem.js";
import { RenderSystem } from "./systems/renderSystem.js";

export const MOVEMENT_SPEED = 10;
const ENGINE_SPEED = 20;
export class Game{
  #componentManager;
  #systemManager;
  #entityManager;
  #player1Id;
  #player2Id;
  gameUpdateId
  #projectilesplayer
  #speed;

  constructor(p1char,p2char,config = {}) {

    let searchParams=new URLSearchParams(window.location.search)

    config = {
      /*canvasWidth: RESOLUTION_WIDTH,
      canvasHeight: RESOLUTION_HEIGHT,
      scaleFactor: SCALE_FACTOR,
      engineSpeed: ENGINE_SPEED,
      loggingEnabled: true,
      ...config,*/
      engineSpeed: ENGINE_SPEED,
      ...config
    };

    this.#speed = config.engineSpeed;

    this.#componentManager = new ComponentManager();
    this.#systemManager = new SystemManager();
    this.#entityManager = new EntityManager();

    // Entities & components
    this.#player1Id = this.#entityManager.addEntity("player1");
    this.#player2Id = this.#entityManager.addEntity("player2");

    
    let fairGamePresence=searchParams.get("fairGame")
    let fairGameValue=fairGamePresence!=''?parseInt(fairGamePresence):fairGamePresence
    this._initComponents(fairGameValue,p1char,p2char)

    let meleeOnly=searchParams.has("meleeOnly")
    // Systems
    const inputSystem = new InputSystem(
      this.#player1Id,this.#player2Id,
      this.#componentManager,
      {
        movementSpeed: MOVEMENT_SPEED,
        meleeOnly: meleeOnly
      },

    );

    let isManaSystem=searchParams.has("manaSystem");
    let manaSystem= new ManaSystem(this.#player1Id, this.#player2Id, this.#componentManager)
    this.#systemManager.addSystem(manaSystem)
    
    
    let risingTensionPresence=searchParams.get("risingTension")
    let risingTensionValue=risingTensionPresence!=''?parseInt(risingTensionPresence):1
    const collisionSystem= new CollisionSystem(
      this.#player1Id,
      this.#player2Id,
      this.#componentManager,
      {
        bouncingBetty: searchParams.has("bouncingBetty"),
        staticBetty: searchParams.has("staticBetty"),
        risingTension: risingTensionValue!=NaN?risingTensionValue:null ,
        repelPhys: searchParams.has("repelPhys")
      },
    );


    const attackSystem= new AttackSystem(this.#player1Id,this.#player2Id,this.#componentManager,this.#entityManager,{},)

    let doomMove=searchParams.has("doomMove")
    const movementSystem = new MovementSystem(
      this.#componentManager,
      {
        doomMove: doomMove
      }, // No config

    );
    const renderSystem = new RenderSystem(
      this.#player1Id,
      this.#player2Id,
      this.#componentManager,
      {},

    );

    //const guiSystem= new GuiSystem(this.#player1Id,this.#player2Id,this.#componentManager,{},)

    this.#systemManager.addSystem(inputSystem);
    this.#systemManager.addSystem(attackSystem); //ataque antes de colision para que pueda tirar proyectiles mientras chocan
    this.#systemManager.addSystem(collisionSystem);
    this.#systemManager.addSystem(movementSystem);
    this.#systemManager.addSystem(renderSystem);

    //this.#systemManager.addSystem(guiSystem);

    //this.#systemManager.info();
  }

  _initComponents(fairGame,p1char,p2char){
    let arenaBounds=document.getElementById("arenaZone").getBoundingClientRect();



    const positionComponent1 = new PositionComponent(this.#player1Id, arenaBounds.left+10, arenaBounds.top+10,FacingDirection.RIGHT,MOVEMENT_SPEED,true);
    this.#componentManager.addComponent(positionComponent1);

    const positionComponent2 = new PositionComponent(this.#player2Id, 100, 75,FacingDirection.LEFT,MOVEMENT_SPEED,true);
    



    const renderComponent1 = new RenderComponent(this.#player1Id, p1char.anims, positionComponent1.asVector(), p1char.scale);
    this.#componentManager.addComponent(renderComponent1);
    
    const renderComponent2 = new RenderComponent(this.#player2Id, p2char.anims, positionComponent2.asVector(), p2char.scale);
    this.#componentManager.addComponent(renderComponent2);

    


    //depende del rendercomponent
    positionComponent2.x=arenaBounds.right-renderComponent2.htmlElement().width-10;
    positionComponent2.y=arenaBounds.bottom-renderComponent2.htmlElement().height-10;
    this.#componentManager.addComponent(positionComponent2);


    let maxHealth
    if (fairGame==''){
      maxHealth=100
    }
    else if (fairGame){
      maxHealth=fairGame
    }
    console.log("fairgaem",fairGame)
    const healthComponent1= new HealthComponent(this.#player1Id,maxHealth);
    const healthComponent2= new HealthComponent(this.#player2Id,maxHealth);
    
    this.#componentManager.addComponent(healthComponent1)
    this.#componentManager.addComponent(healthComponent2)

    //mana
    const ManaComponent1 = new ManaComponent(this.#player1Id)
    const ManaComponent2 = new ManaComponent(this.#player2Id)
    this.#componentManager.addComponent(ManaComponent1)
    this.#componentManager.addComponent(ManaComponent2)

    //melee
    const meleeComponent1= new MeleeComponent(this.#player1Id);
    this.#componentManager.addComponent(meleeComponent1)

    const meleeComponent2= new MeleeComponent(this.#player2Id);
    this.#componentManager.addComponent(meleeComponent2)


    //projectile

    const projectileComponent1=new ProjectileComponent(this.#player1Id)
    this.#componentManager.addComponent(projectileComponent1)

    const projectileComponent2=new ProjectileComponent(this.#player2Id)
    this.#componentManager.addComponent(projectileComponent2)



    const player1SpriteDimensions=renderComponent1.htmlElement();
    const collisionComponentPlayer1= new CollisionComponent(this.#player1Id,positionComponent1.asVector(),player1SpriteDimensions.width,player1SpriteDimensions.height)
    this.#componentManager.addComponent(collisionComponentPlayer1)

    const player2SpriteDimensions=renderComponent2.htmlElement();
    const collisionComponentPlayer2= new CollisionComponent(this.#player2Id,positionComponent2.asVector(),player2SpriteDimensions.width,player2SpriteDimensions.height)
    this.#componentManager.addComponent(collisionComponentPlayer2)
  }

  

  start() {
    this._update();
  }

  _update() {
    this.#systemManager.update(this.#player1Id,this.#player2Id);
    this.gameUpdateId = setTimeout(this._update.bind(this), this.#speed);
  }

  stop(){
    this.#componentManager.getComponentsByType(RENDER_COMPONENT).forEach(renderComp=>{
      renderComp.invisible()
      renderComp.cleanup()
    })
  }

  getPlayer1(){
    return this.#componentManager.getEntityComponents(this.#player1Id)
  }

  getPlayer2(){
    return this.#componentManager.getEntityComponents(this.#player2Id)
  }
}