

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
    targetX: number;
    targetY: number;
    sequenceName: string;
    activeSequence: Sequence;
    sequences: SequenceMap;


    _bind(event: string, method: string) {
        this.obj.on(event, (event) => {
            event.target.owner[method](event);
        });
    }

    constructor(stage: any, specs: any) {

        let self = this;

        this.obj = new Konva.Image({
            x: Math.random() * 500,
            y: Math.random() * 500,
            image: specs.image,
            width: 32,
            height: 32,
            draggable: true,
        });

        this.obj.owner = this;
        this._bind("dragend", "onDragEnd");

        stage.add(self.obj);

        this.stage = stage;
        this.frame = 0;
        this.frameHeight = 8;
        this.frameWidth = 8;
        this.framesPerRow = 4;
        this.targetX = 0;Math.random() * 500;
        this.targetY = 0;

        this._show();
    }

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
        this.interval = setInterval(() => this._update(), this.activeSequence.speed);
    }

    stop = () => {
        clearInterval(this.interval);
        this.interval = null;
    }

    update = () => {
    }

    onDragStart = () => {
    }

    onDragEnd(event: any) {
        console.log("hey");
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

