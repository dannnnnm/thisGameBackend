export const ENTITY_PREFIX_GLUE = ":";
export class EntityManager{
    #entities:Array<string>
    constructor(){
        this.#entities=[]
    }
    addEntity(entityidPrefix=""){
        const entityId=`${
            entityidPrefix ? entityidPrefix + ENTITY_PREFIX_GLUE : ""
          }${this.#entities.length + 1}`;

        this.#entities.push(entityId);

        return entityId;
    }

    entityExists(entityId:string){
        return this.#entities.includes(entityId);
    }
}