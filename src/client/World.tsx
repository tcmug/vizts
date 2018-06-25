import { Point } from "./Point";
import { Entity, EntityList } from "./Entity";

export class World {
  entities: EntityList;

  constructor() {
    this.entities = [];
  }

  getClosestEntity(entity: Entity) {
    let closest = null;
    let closestDistance = 10000;
    this.entities.forEach((a: Entity, index: number) => {
      if (entity.id != a.id) {
        let len = a.position.distanceTo(entity.position);
        if (len < closestDistance) {
          closest = a;
          closestDistance = len;
        }
      }
    });
    return closest;
  }
}
