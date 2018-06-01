
import {h, Component} from 'preact';
import { Point } from '../Point';
import { InputComponent, GraphicsComponent } from '../Component';
import { Layer } from './Layer';
import * as Konva from 'Konva';

export interface EntityProps {
    position: Point,
    layer?: Layer,
}

interface EntityState {
	id: number,
	position: Point,
	layer: Layer,
    inputHandler: InputComponent | null,
    graphicsHandler: GraphicsComponent | null,
    group: any,
}


let _id: number = 1;

export class Entity extends Component <EntityProps, EntityState> {

	state = {
		id: -1,
		position: null,
		layer: null,
		inputHandler: null,
		graphicsHandler: null,
		group: null,
	}

    constructor(props) {
        super(props);
        this.setState({
        	position: props.position,
        	id: _id,
        	layer: props.layer,
       	});
       	_id = _id + 1;
    }

    componentDidMount() {

        const pos = this.state.position;

		let rect = new Konva.Rect({
	      x: pos.x,
	      y: pos.y,
	      width: 5,
	      height: 5,
	      fill: 'red',
	      stroke: 'black',
	      strokeWidth: 2
	    });

	    this.setState({
	    	group: rect,
	    });

	    this.state.layer.add(rect);
	    this.state.layer.draw();
	}

	setPosition(point: Point) {
		this.setState({position: point});
        this.state.group.setX(this.state.position.x);
        this.state.group.setY(this.state.position.y);
	}

    render() {
        return <span class='entity'>
        	#{ this.state.id } { this.state.position && this.state.position.x } { this.state.position && this.state.position.y }
        </span>;
    }
}


