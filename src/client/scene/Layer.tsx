
import {h, Component, cloneElement} from 'preact';
import { Point } from '../Point';
import { InputComponent, GraphicsComponent } from '../Component';
import * as Konva from 'Konva';

export interface LayerProps {
    stage?: any,
    fps?: number,
    frame?: Function,
}

interface LayerState {
    layer: any,
    stage: any,
    fps: number,
    frame: Function,
    children: any,
    animation: any,
}


export class Layer extends Component <LayerProps, LayerState> {

	state = {
		layer: null,
		stage: null,
        fps: 0,
        frame: null,
        children: [],
        animation: null,
	}

    constructor(props) {
        super(props);
        this.setState({
        	stage: props.stage,
            frame: props.frame,
            fps: props.fps,
       	});
    }

    componentDidMount() {
		let layer = new Konva.Layer();
		this.state.stage.add(layer);
        this.setState({ layer: layer });

        if (this.state.frame) {
            this.play();
        }
    }

    play() {

        if (this.state.animation) {
           this.state.animation.start();
           return;
        }

        let previous = 0;
        let current = 0;
        let passed = 0;
        let ms_per_frame = 1000 / this.props.fps;
        let self = this;

        let anim = new Konva.Animation((frame) => {

            passed += frame.time - previous;
            previous = frame.time;
            if (passed < ms_per_frame) {
                return false;
            }
            passed -= ms_per_frame;
            self.state.frame(self.state.children, frame);

            return true;

        }, this.state.layer);

        anim.start();

        this.setState({animation: anim});

    }

    stop() {
        if (this.state.animation)
            this.state.animation.stop();
    }

    push = (ref) => {
        this.state.children.push(ref);
    }

    renderChildren(props) {
    	if (this.state.layer) {
    		return props.children.map(e => { return cloneElement(e, { layer: this.state.layer, ref: (ref) => this.push(ref) })});
    	}
        return null;
    }

    render(props) {
        return <span class='layer'>
        	{ this.renderChildren(props) }
        </span>;
    }
}


