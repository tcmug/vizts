import { h, Component, cloneElement } from "preact";
import * as Konva from "konva";

import { Point, PointList } from "../lib/Point";
import { Polygon, shortestPathInPolygonList } from "../lib/Polygon";

export interface EntityProps {
	points: PointList;
	layer?: Konva.Layer;
	push?: Function;
}

export interface EntityState {
	points: PointList;
	group: any;
}

let _id: number = 1;

export class Area extends Component<EntityProps, EntityState> {
	state = {
		points: [],
		group: null
	};

	constructor(props) {
		super(props);
		this.setState({
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
			opacity: 0.2,
			closed: true
		});
		rect["self"] = this;
		this.setState({
			group: rect
		});
		this.props.layer.add(this.state.group);
	}

	containsPoint(pt: Point) {
		const poly = new Polygon(this.state.points);
		return poly.containsPoint(pt);
	}

	pathBetween(start: Point, end: Point) {
		const poly = new Polygon(this.state.points);
		return shortestPathInPolygonList(start, end, [poly]);
	}

	renderChildren(props) {
		return props.children.map(e => {
			return cloneElement(e, {
				layer: this.props.layer,
				area: this,
				ref: ref => this.props.push(ref)
			});
		});
	}

	render(props) {
		return <span class="Area">{this.renderChildren(props)}</span>;
	}

	update() {}
}
