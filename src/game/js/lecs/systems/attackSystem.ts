import { CollisionComponent } from "../components/collisionComponent.js";
import { COLLISION_COMPONENT, HEALTH_COMPONENT, MANA_COMPONENT, MELEE_COMPONENT, POSITION_COMPONENT, PROJECTILE_COMPONENT } from "../components/constants.js";
import { OwnerComponent } from "../components/ownerComponent.js";
import { FacingDirection, PositionComponent, Vector2D } from "../components/positionComponent.js";
import { RenderComponent } from "../components/renderComponent.js";
import { MOVEMENT_SPEED } from "../game.js";
import { playSound } from "../utils/utils.js";
import { BaseSystem } from "./baseSystem.js";
import { overlaps } from "./collisionSystem.js";

export class AttackSystem extends BaseSystem {

    #player1Id:string
    #player2Id:string

    #player1Collisions
    #player2Collisions

    #player1Position
    #player2Position

    #player1Health
    #player2Health
    #player1Mana
    #player2Mana
    #player1Attack
    #player2Attack
    #entityManager

    constructor(player1Id, player2Id, componentManager, entitiyManager, config = {}, logger) {
        super(componentManager, logger)
        this.#player1Collisions = this.componentManager.getEntityComponentByType(player1Id, COLLISION_COMPONENT)
        this.#player2Collisions = this.componentManager.getEntityComponentByType(player2Id, COLLISION_COMPONENT)

        this.#player1Position = this.componentManager.getEntityComponentByType(player1Id, POSITION_COMPONENT)
        this.#player2Position = this.componentManager.getEntityComponentByType(player2Id, POSITION_COMPONENT)

        this.#player1Health = this.componentManager.getEntityComponentByType(player1Id, HEALTH_COMPONENT)
        this.#player2Health = this.componentManager.getEntityComponentByType(player2Id, HEALTH_COMPONENT)

        this.#player1Mana = this.componentManager.getEntityComponentByType(player1Id, MANA_COMPONENT)
        this.#player2Mana = this.componentManager.getEntityComponentByType(player2Id, MANA_COMPONENT)

        this.#player1Attack = this.componentManager.getEntityComponentByType(player1Id, MELEE_COMPONENT)
        this.#player2Attack = this.componentManager.getEntityComponentByType(player2Id, MELEE_COMPONENT)

        this.#player1Id = player1Id
        this.#player2Id = player2Id
        this.#entityManager = entitiyManager


    }

    update() {
        this._meleeAttack()
        this._projectileAttack()

    }

    _meleeAttack() {
        let playersOverlap = this._playersOverlap()
        if (playersOverlap[0] && playersOverlap[1]) {
            this._attackOther(this.#player1Attack, this.#player1Health, this.#player2Health, this.#player1Mana)
            this._attackOther(this.#player2Attack, this.#player2Health, this.#player1Health, this.#player2Mana)
        }
        else {
            //ataque desperdiciado
            if (this.#player1Attack.prepared()) {
                this._playerMissAttack(this.#player1Attack, this.#player1Mana)
            }
            if (this.#player2Attack.prepared()) {
                this._playerMissAttack(this.#player2Attack, this.#player2Mana)
            }


        }
    }

    _playerMissAttack(attackComponent, manaComponent) {
        if (manaComponent.currentMana > manaComponent.meleeDrainAmount) {
            attackComponent.miss();
            manaComponent.drainMelee()
            playSound("audio/whoosh.m4a")
        }
        else{
            attackComponent.forceUnprepare()
        }

    }

    _projectileAttack() {
        let player1Projectile = this.componentManager.getEntityComponentByType(this.#player1Id, PROJECTILE_COMPONENT)
        let player2Projectile = this.componentManager.getEntityComponentByType(this.#player2Id, PROJECTILE_COMPONENT)
        this._checkPlayerProjectile(player1Projectile, this.#player1Position, this.#player1Collisions,this.#player1Mana)
        this._checkPlayerProjectile(player2Projectile, this.#player2Position, this.#player2Collisions,this.#player2Mana)

    }

    _checkPlayerProjectile(playerProjectileComponent, playerPosition, playerCollision,playerMana) {

        if (playerProjectileComponent.prepared()) {
            if (playerMana.currentMana<playerMana.proyectileDrainAmount){
                playerProjectileComponent.forceUnprepare()
                return
            }

            let projectileId = this.#entityManager.addEntity("projectile")
            let damage = playerProjectileComponent.attack()

            let facingDirection=playerPosition.facingDirectionAsVector()
            let direction = new Vector2D(facingDirection.x, facingDirection.y)
            if (direction.x == 0 && direction.x == direction.y) {
                direction.x = 1;
            }


            let projectileX = playerPosition.x + playerCollision.width / 2
            let projectileY = playerPosition.y + playerCollision.height / 2
            let projectilePositionComponent = new PositionComponent(projectileId, projectileX, projectileY,FacingDirection.RIGHT, 1.25 * MOVEMENT_SPEED)
            projectilePositionComponent.velocity = direction;
            this.componentManager.addComponent(projectilePositionComponent)

            let projectileRenderComponent = new RenderComponent(projectileId, ["images/kinball.png"], projectilePositionComponent.asVector(), 0.04)
            this.componentManager.addComponent(projectileRenderComponent)

            let projectileSpriteDimensions = projectileRenderComponent.htmlElement();
            let collisionComponent = new CollisionComponent(projectileId, new Vector2D(), projectileSpriteDimensions.width, projectileSpriteDimensions.height)
            this.componentManager.addComponent(collisionComponent);
            projectilePositionComponent.x -= collisionComponent.width / 2
            projectilePositionComponent.y -= collisionComponent.height / 2

            let projectileOwnerComponent = new OwnerComponent(projectileId, playerCollision.entityId, damage);
            this.componentManager.addComponent(projectileOwnerComponent)

            playerMana.drainShoot()
            playSound("audio/projthrow.wav", 0.3)
        }
    }

    _attackOther(selfAttack, selfHealth, otherHealth, manaComponent) {

        if (selfAttack.prepared()) {
            if (manaComponent.currentMana < manaComponent.meleeDrainAmount) {
                console.log("no hay mana suficiente")
                selfAttack.forceUnprepare()
                return;
            }
            manaComponent.drainMelee()
            console.log(manaComponent.currentMana)
            otherHealth.hurt(selfAttack.attack())

            playSound("audio/bonk.m4a", 0.5)
        }

    }

    _playersOverlap() {
        let range = 30
        let player1Position = new Vector2D(this.#player1Position.x, this.#player1Position.y)
        let player2Position = new Vector2D(this.#player2Position.x, this.#player2Position.y)
        return overlaps(player1Position, player2Position,
            this.#player1Collisions.width + range, this.#player2Collisions.width + range,
            this.#player1Collisions.height + range, this.#player2Collisions.height + range)
    }

}