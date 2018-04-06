

import * as Konva from 'Konva';

export class Sequence {
    start: number;
    count: number;
    speed: number;
    loop: boolean;
};

interface SequenceMap {
    [name: string]: Sequence;
};

export class Actor {

	obj: any;
    frameWidth: number;
    frameHeight: number;
    sequence: string;
	frame: number;
    frames: number;
    framesPerRow: number;
	stage: any;
    interval: any;
    activeSequence: Sequence;
    sequences: SequenceMap;

    constructor(stage: any, specs: any) {

        let self = this;

        this.obj = new Konva.Image({
            x: Math.random() * 500,
            y:  Math.random() * 500,
            image: specs.image,
            width: 32,
            height: 32,
            draggable: true,
        });
        stage.add(self.obj);

        this.stage = stage;
        this.frame = 0;
        this.frameHeight = 8;
        this.frameWidth = 8;
        this.framesPerRow = 4;

        this.sequences = {};
        this.sequences["walk-right"] = { start:0, count:4, speed: 400, loop:true } as Sequence;
        this.sequences["walk-left"] = { start:4, count:4, speed: 400, loop:true } as Sequence;
        this.sequences["idle"] = { start:8, count:4, speed: 400, loop:true } as Sequence;
        this.activeSequence = { start:0, count:0, speed: 1000, loop:true } as Sequence;
        this._show();
    }

    play = (sequence: string) => {
        this.activeSequence = this.sequences[sequence];
        this.frame = this.activeSequence.start;
        this.interval = setInterval(() => this._update(), this.activeSequence.speed);
    }

    stop = () => {
        clearInterval(this.interval);
    }

    _update() {
    	if (this.frame >= this.activeSequence.start + this.activeSequence.count) {
            if (this.activeSequence.loop) {
    		    this.frame = this.activeSequence.start;
            }
            else {
                this.stop();
                return;
            }
    	}

        this._show();
        this.frame++;
    }

    _show() {
        let y = Math.floor(this.frame / this.framesPerRow) * this.frameHeight;
        let x = (this.frame * this.frameWidth) - (y * this.framesPerRow);

        this.obj.crop({
            x: x,
            y: y,
            width: this.frameWidth,
            height: this.frameHeight,
        });

    }

}

