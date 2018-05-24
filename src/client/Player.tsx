
import { Actor } from './Actor';
import { SpriteGraphics } from './Sprite';
import { Scene } from './Scene';
import { Point } from './Point';

import * as Konva from 'Konva';

let ontimg = new Image();
ontimg.src = require('../../assets/dude.png');;

export class Player extends Actor {

	constructor(scene: Scene) {
		super(scene, ontimg);
		this.speed = 1.2;
	}

    reachTarget() {
        this.play("idle");
    }

}
