
import { Entity } from './Entity';
import { SpriteGraphics } from './Sprite';
import { Scene } from './Scene';
import { Point } from './Point';
import { World } from './World';

import * as Konva from 'Konva';

export class Actor extends Entity {

	group: any;
    voice: any;
    target: Point;
    speed: number;

	constructor(scene: Scene, sheet: any) {
		super(scene);

        this.speed = 1;
		this.position = new Point(0, 0);
		this.position.random(0, 0, 500, 500);

		this.group = new Konva.Group({
			x: this.position.x,
			y: this.position.y
		});

        this.group.owner = this;

        this.voice = new Konva.Text({
          x: -16,
          y: -32 - 16,
          text: '',
          fontSize: 15,
          fontFamily: 'Munro',
          fill: '#fff',
          align: 'center',
          shadowEnabled: true,
          shadowOffset: {x: 1, y: 1},
          shadowBlur: 0
        });

        this.voice.transformsEnabled('position');
        this.group.add(this.voice);

		this.graphicsHandler = new SpriteGraphics(scene, this, sheet);
		this.play('idle');
	}


    speak(voice: string) {
        this.voice.text(voice);
        this.voice.show();
        let v = this.voice;
        setTimeout(() => {v.hide();}, 2000);
    }


    play(sequence: string) {
        (this.graphicsHandler as SpriteGraphics).play(sequence);
    }

    walkTo(x: number, y: number) {
        if (x > this.group.getX()) {
            this.play("walk-right");
        }
        else {
            this.play("walk-left");
        }
        this.target = new Point(x, y);
    }

    onDragEnd(event: any) {
        this.walkTo(Math.random() * 500, Math.random() * 500);
    }

    _distanceToTarget() {
        return this.target.distanceTo(
            {x: this.group.getX(), y: this.group.getY()} as Point
        );
    }

    reachTarget(world: World) {
    }


    setPosition(point: Point) {
        super.setPosition(point);
        this.group.setX(this.position.x);
        this.group.setY(this.position.y);
    }

    update(world: World) {
        if ((this.graphicsHandler as SpriteGraphics).sequenceName == "idle") {
            return;
        }
        let distance = this._distanceToTarget();
        if (distance > 1) {
            let point = new Point(
                (this.target.x - this.group.getX()) / distance,
                (this.target.y - this.group.getY()) / distance
            );
            point.mul(new Point(this.speed, this.speed));
            point.add(this.position);
            this.setPosition(point);
        }
        else {
            this.reachTarget(world);
        }
    }
}
