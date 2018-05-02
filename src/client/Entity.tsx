
import { Point } from './Point';
import { InputComponent, GraphicsComponent } from './Component';
import { Scene } from './Scene';

export class Entity {

	constructor(scene: Scene) {
	}

	update = () => {
	}

	group: any;
    position: Point;
    inputHandler: InputComponent | null;
    graphicsHandler: GraphicsComponent | null;

}

export type EntityList = Entity[];
