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

export class Line extends Component<EntityProps, EntityState> {
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

	componentWillReceiveProps(nextProps, nextState) {
		if (this.state.group) {
			this.state.group.points(
				nextProps.points.reduce((r, e) => {
					r.push(e.x, e.y);
					return r;
				}, [])
			);
			this.state.group.draw();
		}
	}

	componentDidMount() {
		let rect = new Konva.Line({
			points: this.state.points.reduce((r, e) => {
				r.push(e.x, e.y);
				return r;
			}, []),
			fill: "#00D2FF",
			stroke: "red",
			strokeWidth: 2,
			opacity: 1
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
		return "";
		// const tag =
		// 	"<Area points={[" +
		// 	this.props.points.map(p => "new Point(" + p.x + ", " + p.y + ")") +
		// 	"]}/>";
		// return <li class="lines">{tag}</li>;
	}

	update() {}
}
