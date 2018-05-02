
import { Actor } from './Actor';
import { SpriteGraphics } from './Sprite';
import { Scene } from './Scene';
import { Point } from './Point';

import * as Konva from 'Konva';

let ontimg = new Image();
ontimg.src = require('../../assets/onti.png');;

export class Onti extends Actor {

	constructor(scene: Scene) {
		super(scene, ontimg);
	}

}
