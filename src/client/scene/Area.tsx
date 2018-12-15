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
	group: any;
}

export class Area extends Component<EntityProps, EntityState> {
	state = {
		group: null
	} as EntityState;

	componentDidMount() {
		const pts = this.props.points.reduce((r, e) => {
			r.push(e.x, e.y);
			return r;
		}, []);
		let rect = new Konva.Line({
			points: pts,
			stroke: "black",
			strokeWidth: 1,
			closed: true
		}) as any;
		rect["self"] = this;
		this.setState({
			group: rect
		});
		this.props.layer.getLayer().add(this.state.group);
	}

	containsPoint(pt: Point) {
		const poly = new Polygon(this.props.points);
		return poly.containsPoint(pt);
	}

	pathBetween(start: Point, end: Point) {
		const poly = new Polygon(this.props.points);
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

	shouldComponentUpdate() {
		return false;
	}

	render(props: any) {
		return <span class="Area">{this.renderChildren(props.children)}</span>;
	}

	update() {}
}
