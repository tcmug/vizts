
import { Entity } from './Entity';
import { SpriteGraphics } from './Sprite';
import { Scene } from './Scene';
import { Point } from './Point';

import * as Konva from 'Konva';

export class Actor extends Entity {

	group: any;
    voice: any;
    target: Point;

	constructor(scene: Scene, sheet: any) {
		super(scene);

		this.position = new Point(0, 0);
		this.position.random(0, 0, 500, 500);

		this.group = new Konva.Group({
			x: this.position.x,
			y: this.position.y
		});

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

        this.group.add(this.voice);

		this.graphicsHandler = new SpriteGraphics(scene, this, sheet);
		this.play('idle');
        this.walkTo(Math.random() * 500, Math.random() * 500);
	}

    speak = (voice: string) => {
        this.voice.text(voice);
        this.voice.show();
        let v = this.voice;
        setTimeout(() => {v.hide();}, 2000);
    }


    play = (sequence: string) => {
        (this.graphicsHandler as SpriteGraphics).play(sequence);
    }

    walkTo = (x: number, y: number) => {
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

    _distanceToTarget = () => {
        return this.target.distanceTo(
            {x: this.group.getX(), y: this.group.getY()} as Point
        );
    }

    update = () => {
        if ((this.graphicsHandler as SpriteGraphics).sequenceName == "idle") {
            return;
        }
        let distance = this._distanceToTarget();
        if (distance > 1) {
            let x = (this.target.x - this.group.getX()) / distance;
            let y = (this.target.y - this.group.getY()) / distance;
            this.group.setX(this.group.getX() + x);
            this.group.setY(this.group.getY() + y);
        }
        else {
            const myArray = [
                "Graagh",
                "Grh",
                "Mrh?",
            ];
            var rand = myArray[Math.floor(Math.random() * myArray.length)];
            this.speak(rand);
            this.play("idle");
        }
    }
}
