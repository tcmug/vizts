import { h, Component } from "preact";
import { Point, PointList } from "../Point";
import { Layer } from "./Layer";
import * as Konva from "konva";
import { Polygon } from "../Polygon";

export interface EntityProps {
	points: PointList;
}

export interface EntityState {
	layer: any;
	points: PointList;
	group: any;
}

let _id: number = 1;

export class Area extends Component<EntityProps, EntityState> {
	state = {
		layer: null,
		points: [],
		group: null
	};

	constructor(props) {
		super(props);
		this.setState({
			layer: props.layer,
			points: props.points
		});
		_id = _id + 1;
	}

	componentDidMount() {
		let rect = new Konva.Line({
			points: this.state.points.reduce((r, e) => {
				r.push(e.x, e.y);
				return r;
			}, []),
			fill: "#00D2FF",
			stroke: "black",
			strokeWidth: 1,
			opacity: 0.5,
			closed: true
		});
		rect["self"] = this;
		this.setState({
			group: rect
		});
		this.state.layer.add(this.state.group);
	}

	containsPoint(pt: Point) {
		const poly = new Polygon(this.state.points);
		return poly.containsPoint(pt);
	}

	render() {
		return <span class="entity">LINES</span>;
	}

	update() {}
}
