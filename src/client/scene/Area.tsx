import { h, Component, cloneElement } from "preact";
import * as Konva from "konva";

import { Layer } from "./Layer";
import { Point, PointList } from "../lib/Point";
import { Polygon, shortestPathInPolygonList } from "../lib/Polygon";

export interface EntityProps {
	points: PointList;
	layer?: Layer;
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
	} as EntityState;

	constructor(props: any) {
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
		}) as any;
		rect["self"] = this;
		this.setState({
			group: rect
		});
		this.props.layer.getLayer().add(this.state.group);
	}

	containsPoint(pt: Point) {
		const poly = new Polygon(this.state.points);
		return poly.containsPoint(pt);
	}

	pathBetween(start: Point, end: Point) {
		const poly = new Polygon(this.state.points);
		return shortestPathInPolygonList(start, end, [poly]);
	}

	renderChildren(children: []) {
		return children.map((e: any) => {
			return cloneElement(e, {
				layer: this.props.layer,
				area: this,
				ref: (ref: any) => this.props.push(ref)
			});
		});
	}

	render(props: any) {
		return <span class="Area">{this.renderChildren(props.children)}</span>;
	}

	update() {}
}
