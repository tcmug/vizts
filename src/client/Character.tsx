import { Actor } from "./Actor";
import { SpriteGraphics } from "./Sprite";
import { Scene } from "./Scene";
import { Point } from "./Point";

import * as Konva from "konva";

let ontimg = new Image();
ontimg.src = require("../../assets/dude.png");

export class Character extends Actor {
  constructor(scene: Scene) {
    super(scene, ontimg);
    this.speed = 1.2;
  }

  reachTarget() {
    this.play("idle");
  }
}
