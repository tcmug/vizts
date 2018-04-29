
import {h, Component} from 'preact';
import Loader from './Loader'
import Scene from './Scene';
import * as Konva from 'Konva';
import { Actor, Sequence } from './Actor';

export interface MainProps {
}

interface MainState {
	ready: boolean;
    layer: any;
	resources: {};
    resourceSources: {},
    actors: Array<Actor>;
}


export class Onti extends Actor {

    constructor(stage: any, specs: any) {
        super(stage, specs);

        this.sequences = {};
        this.sequences["walk-right"] = { start:0, count:4, speed: 400, loop:true } as Sequence;
        this.sequences["walk-left"] = { start:4, count:4, speed: 400, loop:true } as Sequence;
        this.sequences["idle"] = { start:8, count:4, speed: 400, loop:true } as Sequence;
        this.play("idle");

        this.walkTo(Math.random() * 500, Math.random() * 500);
    }

    walkTo = (x: number, y: number) => {
        if (x > this.obj.getX()) {
            this.play("walk-right");
        }
        else {
            this.play("walk-left");
        }
        this.targetX = x;
        this.targetY = y;
    }

    onDragEnd(event: any) {
        console.log("ended");
        this.walkTo(Math.random() * 500, Math.random() * 500);
    }

    _distanceToTarget = () => {
        let x = this.obj.getX() - this.targetX;
        let y = this.obj.getY() - this.targetY;
        return Math.sqrt(x * x + y * y);
    }

    update = () => {
        if (this.sequenceName == "idle") {
            return;
        }
        let distance = this._distanceToTarget();
        if (distance > 1) {
            let x = (this.targetX - this.obj.getX()) / distance;
            let y = (this.targetY - this.obj.getY()) / distance;
            this.obj.setX(this.obj.getX() + x);
            this.obj.setY(this.obj.getY() + y);
        }
        else {
            this.play("idle");
        }
    }

};


export default class Main extends Component<MainProps, MainState> {

	state = {
		ready: false,
        layer: null,
		resources: {},
        actors: [],
        resourceSources: {
            'dude': require("../../assets/dude.png"),
            'onti': require("../../assets/onti.png"),
        },
	};

    finishedLoading = (resources) => {
        this.setState({ready: true, resources: resources});
    }

    enterFrame = (frame: any) => {
        let actors = this.state.actors;
        actors = actors.sort((a: any, b: any) => a.obj.y() - b.obj.y());
        actors.forEach((a: Actor, index: number) => {a.update(); a.obj.setZIndex(index);});
    }

    enterScene = (stage: any) => {

        let actors = this.state.actors;
        let layer = new Konva.Layer();

        this.setState({layer: layer});

        let self = this;
        let i : number = 0;
        for (i = 0; i < 10; i++) {
            let actor = new Onti(layer, {image: this.state.resources['onti']});
            actors.push(actor);
        }

        stage.add(layer);

        let ctx = this.state.layer.getContext()._context;
        if ('imageSmoothingEnabled' in ctx) {
           ctx.imageSmoothingEnabled = false;
        } else {
           ctx.mozImageSmoothingEnabled = false;
           ctx.msImageSmoothingEnabled = false;
        }

        return this.state.layer;
    }

    render({}, {resourceSources, resources, ready}) {
    	if (!ready) {
	    	return <Loader scene={this} resources={resourceSources} finished={this.finishedLoading}/>
        }
        return <Scene
            enterScene={this.enterScene}
            enterFrame={this.enterFrame}
            resources={resources}
            />;
    }
}
