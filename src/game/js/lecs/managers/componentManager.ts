import { BaseComponent } from "../components/baseComponent.js";

export class ComponentManager{
    #componentsByEntity:Map<String,Array<BaseComponent>>

    constructor(){
        this.#componentsByEntity=new Map();
    }

    get components(){
        return this.#componentsByEntity
    }

    addComponent(component){
        if (!this.#componentsByEntity[component.entityId]) {
            this.#componentsByEntity[component.entityId] = [];
        }
            this.#componentsByEntity[component.entityId].push(component);
    }

    getEntityComponents(entityId:string):Array<BaseComponent>{
        return this.#componentsByEntity[entityId] || []
    }

    getEntityComponentByType(entityId, componentType) {
        const components = this.getEntityComponents(entityId);
        return components.find((component) => component.type === componentType);
    }

        // Intended to be used with "singleton" components
  getComponentByType(componentType:string) : BaseComponent|undefined {
    const entityWithComponent : Array<BaseComponent>= Object.values(this.#componentsByEntity).find(
      (entityComponents:Array<BaseComponent>) =>
        entityComponents.find((component:BaseComponent) => component.type === componentType)
    );

    if (entityWithComponent) {
      return entityWithComponent.find(
        (component) => component.type === componentType
      );
    }
    return undefined;
  }

  getComponentsByType(componentType:string) {
    const components : Array<BaseComponent> = [];

    Object.values(this.#componentsByEntity).forEach((entityComponents:Array<BaseComponent>) => {
      entityComponents.forEach((component) => {
        if (componentType === component.type) {
          components.push(component);
          // For now, assume that there is only one component of each type per entity
          return;
        }
      });
    });

    return components;
  }

  // Intended to be used with 2+ component types, due to the extra complexity
  getComponentsByTypes(...componentTypes:string[]):Array<Map<string,BaseComponent>> {
    const componentsMapTemplate = componentTypes.reduce(
      (acc, componentType) => {
        acc[componentType] = undefined;
        return acc;
      },
      {}
    );

    const componentsByTypes = [];

    Object.values(this.#componentsByEntity).forEach((entityComponents: Array<BaseComponent>) => {
      let foundComponents = 0;
      const componentsMap = { ...componentsMapTemplate };

      entityComponents.forEach((component) => {
        if (componentTypes.includes(component.type)) {
          componentsMap[component.type] = component;
          foundComponents++;
        }
      });

      if (foundComponents === componentTypes.length) {
        componentsByTypes.push(componentsMap);
      }
    });

    return componentsByTypes;
    }
}