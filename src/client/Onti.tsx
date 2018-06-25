import { Actor } from "./Actor";
import { SpriteGraphics } from "./Sprite";
import { Scene } from "./Scene";
import { Point } from "./Point";
import { World } from "./World";
import { Player } from "./Player";
import * as Konva from "konva";

let ontimg = new Image();
ontimg.src = require("../../assets/onti.png");

const STATE_WANDERING = 1;
const STATE_FOLLOWING = 2;

const Audibles = ["Graagh", "Grh", "Mrh?"];

export class Onti extends Actor {
  state: number;
  followTarget: null | Actor;
  followResolution: number;

  constructor(scene: Scene) {
    super(scene, ontimg);
    this.state = STATE_WANDERING;
    this.followTarget = null;
    this.followResolution = 10;
    this.walkTo(Math.random() * 500, Math.random() * 500);
  }

  update(world: World) {
    super.update(world);
  }

  reachTarget(world: World) {
    var rand = Audibles[Math.floor(Math.random() * Audibles.length)];
    this.speak(rand);
    this.play("idle");

    const closest = world.getClosestEntity(this);
    if (
      closest instanceof Player &&
      closest.position.distanceTo(this.position) < 200
    ) {
      this.state = STATE_FOLLOWING;
      this.followTarget = closest;
      this.walkTo(closest.position.x, closest.position.y);
    } else {
      setTimeout(() => {
        this.walkTo(
          this.position.x + Math.random() * 50,
          this.position.y + Math.random() * 50
        );
      }, 1500 + Math.random() * 2000);
    }
  }
}
