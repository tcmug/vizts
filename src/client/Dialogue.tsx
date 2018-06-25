import { Entity } from "./Entity";
import { SpriteGraphics } from "./Sprite";
import { Scene } from "./Scene";
import { Point } from "./Point";
import { World } from "./World";

import * as Konva from "konva";

export class Dialogue extends Entity {
  constructor(scene: Scene) {
    super(scene);
  }
}
