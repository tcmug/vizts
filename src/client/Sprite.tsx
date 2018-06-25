import { Scene } from "./Scene";
import { Entity } from "./Entity";
import { GraphicsComponent } from "./Component";

import * as Konva from "konva";

export class SpriteSequence {
  start: number;
  count: number;
  speed: number;
  loop: boolean;
}

interface SpriteSequenceMap {
  [name: string]: SpriteSequence;
}

export class SpriteGraphics extends GraphicsComponent {
  image: any;
  frameWidth: number;
  frameHeight: number;
  sequence: string;
  frame: number;
  frames: number;
  framesPerRow: number;
  interval: any;
  sequenceName: string;
  activeSequence: SpriteSequence;
  sequences: SpriteSequenceMap;

  constructor(scene: Scene, entity: Entity, image: any) {
    super();

    this.image = new Konva.Image({
      x: -16,
      y: -32,
      image: image,
      width: 32,
      height: 32
    });
    this.image.transformsEnabled("position");
    entity.group.add(this.image);

    this.sequences = {};
    this.sequences["walk-right"] = {
      start: 0,
      count: 4,
      speed: 400,
      loop: true
    } as SpriteSequence;
    this.sequences["walk-left"] = {
      start: 4,
      count: 4,
      speed: 400,
      loop: true
    } as SpriteSequence;
    this.sequences["idle"] = {
      start: 8,
      count: 4,
      speed: 400,
      loop: true
    } as SpriteSequence;

    this.frame = 0;
    this.frameHeight = 8;
    this.frameWidth = 8;
    this.framesPerRow = 4;
    this._show();
    //scene.getLayer().add(entity.group);
  }

  _show() {
    let y = Math.floor(this.frame / this.framesPerRow) * this.frameHeight;
    let x = this.frame * this.frameWidth - y * this.framesPerRow;
    this.image.crop({
      x: x,
      y: y,
      width: this.frameWidth,
      height: this.frameHeight
    });
  }

  update = (entity: Entity) => {};

  play = (sequence: string) => {
    if (this.sequenceName == sequence) {
      return;
    }
    this.activeSequence = this.sequences[sequence];
    this.frame = this.activeSequence.start;
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.sequenceName = sequence;
    this._update();
    this.interval = setInterval(
      () => this._update(),
      this.activeSequence.speed
    );
  };

  stop = () => {
    clearInterval(this.interval);
    this.interval = null;
  };

  _update() {
    if (this.frame >= this.activeSequence.start + this.activeSequence.count) {
      if (this.activeSequence.loop) {
        this.frame = this.activeSequence.start;
      } else {
        this.stop();
        return;
      }
    }

    this._show();
    this.frame++;
  }
}
