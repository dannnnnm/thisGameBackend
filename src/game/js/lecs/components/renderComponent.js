import { BaseComponent } from "./baseComponent.js"


const animStatus={
    AN_ATTACK:"attack",
    AN_DIE:"die",
    AN_IDLE:"idle",
    AN_SPECIAL:"special",
    AN_MOVE:"move",
}

export class RenderComponent extends BaseComponent {
    spritePath = []
    status
    prevStatus
    initialPosition
    scale
    #htmlComponent

    playedDeathAnim

    constructor(entityId, spriteList, initialPosition, scale = 1.0) {
        super(entityId)


        this.playedDeathAnim=false

        

        this.status=animStatus.AN_IDLE
        this.prevStatus=animStatus.AN_IDLE
        this.spritePath=spriteList
        this.scale = scale
        this.initialPosition = initialPosition
        this.#htmlComponent = document.createElement("img")
        

        



        this.#htmlComponent.id = entityId;
        this.#htmlComponent.src = this.spritePath[0]
        this.#htmlComponent.className="playerImg"
        this.#htmlComponent.rel="preload"
        console.log("Sprites ",spriteList, "using ", this.spritePath[0])
        this.#htmlComponent.height = this.#htmlComponent.height * scale
        this.#htmlComponent.width = this.#htmlComponent.width * scale

        let preexistingElement = document.getElementById(entityId)
        if (preexistingElement != null) {
            console.log("preexisting")
            this.#htmlComponent = preexistingElement
            this.#htmlComponent.style.filter = null
            let dimensions=this.imgToScale(this.spritePath[0])
            this.#htmlComponent.src=this.spritePath[0]
            this.#htmlComponent.height=dimensions.height
            this.#htmlComponent.width=dimensions.width
            
        }
        else {
            console.log("not preexising", this.#htmlComponent)
            let innerArenaElement=document.getElementById("arenaZone")
            innerArenaElement.appendChild(this.#htmlComponent)
        }
        

        


        this.#htmlComponent.style.position = "absolute";
        this.#htmlComponent.style.top = initialPosition.y + "px"
        this.#htmlComponent.style.left = initialPosition.x + "px"
        this.#htmlComponent.style.visibility = "visible";
    }

    htmlElement() {
        return this.#htmlComponent
    }

    invisible() {
        this.#htmlComponent.style.visibility = "hidden";
    }

    blur() {
        this.#htmlComponent.style.filter = "sepia(100%)"
    }

    death(){
        this.playedDeathAnim=true
        if (this.spritePath.length<2){
            let imgSource="/images/deathdefault.gif"
            let image=new Image()
            image.src=imgSource
            image.onload = () => {
                let dimensions = this.imgToScale(imgSource)
                console.log("def death dime", dimensions)
                this.#htmlComponent.src = imgSource
                this.#htmlComponent.width = dimensions.width
                this.#htmlComponent.height = dimensions.height
            }
            
        }
        else{
            let dimensions=this.imgToScale(this.spritePath[1])
            this.#htmlComponent.src=this.spritePath[1]
            this.#htmlComponent.width=dimensions.width
            this.#htmlComponent.height=dimensions.height
            
        }
    }

    imgToScale(url){
        let image=new Image()
        image.src=url
        console.log("death img dim ",image.height,image.width, image.src)
        return {
            height:image.height*this.scale,
            width:image.width*this.scale
        }
    }

    flip(x){
        
        this.#htmlComponent.style.transform=`scaleX(${x})`;
    }

    cleanup(){
        //document.removeChild(this.#htmlComponent.parentNode)
    }

    
}

export const SPRITES_STATES = {
        
}