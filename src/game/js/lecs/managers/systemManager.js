export class SystemManager {
    #systems;
  
    constructor() {
      this.#systems = [];
    }
  
    addSystem(system) {
      this.#systems.push(system);
    }
  
    update(player1Id,player2Id) {
      this.#systems.forEach((system) => {
        system.update(player1Id,player2Id);
      });
    }
  
    info(humanReadable = false) {
      this.#systems.forEach((system) => {
        system.info(humanReadable);
      });
    }
  }