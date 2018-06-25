import { Point } from "./Point";
import { InputComponent, GraphicsComponent } from "./Component";
import { Scene } from "./Scene";
import { World } from "./World";

let _id = 1;

export class Entity {
  id: number;
  scene: Scene;

  constructor(scene: Scene) {
    this.id = _id;
    this.scene = scene;
    _id = _id + 1;
  }

  setPosition(point: Point) {
    this.position = point;
  }

  update(world: World) {}

  group: any;
  position: Point;
  inputHandler: InputComponent | null;
  graphicsHandler: GraphicsComponent | null;
}

export type EntityList = Entity[];
