import { h, Component } from "preact";
import * as Konva from "konva";
import { debounce } from "ts-debounce";

import { Point, PointList } from "../../lib/Point";
import { Layer } from "../../scene/Layer";

export interface AreaBuilderProps {
	finish: Function;
}

class VKonva extends Konva.Rect {
	self: Layer;
}

export interface AreaBuilderState {
	layer: any;
	group: VKonva;
	area: any;
	points: PointList;
}

export default class AreaBuilder extends Component<
	AreaBuilderProps,
	AreaBuilderState
> {
	state = {
		layer: null,
		group: null,
		area: null,
		points: []
	};

	constructor(props) {
		super(props);
		this.setState({
			layer: props.layer
		});
		var rect = new Konva.Rect({
			x: 0,
			y: 0,
			width: this.state.layer.getWidth(),
			height: this.state.layer.getHeight(),
			fill: "red",
			opacity: 0.2
		});
		rect["self"] = this;
		this.setState({
			group: rect as VKonva
		});

		let area = new Konva.Line({
			points: [],
			fill: "#00D2FF",
			stroke: "red",
			strokeWidth: 2,
			opacity: 1,
			closed: true
		});
		this.setState({
			area: area
		});

		let self = this;
		rect.on("click", (e: any) => {
			if (e.evt.button !== 0) {
				self.props.finish({ points: self.state.points });
			}
			const { x, y } = self.state.layer.getStage().getPointerPosition();
			self.setState({ points: [...self.state.points, new Point(x, y)] });
			const pts = self.state.points.reduce((r, e) => {
				r.push(e.x, e.y);
				return r;
			}, []);
			self.state.area.points(pts);
			self.state.layer.draw();
		});

		window.addEventListener("resize", debounce(this.fitToWindow, 200));
		this.state.layer.add(this.state.area);
		this.state.layer.add(this.state.group);
		this.state.layer.draw();
	}

	componentWillUnmount = () => {
		this.state.group.destroy();
		this.state.area.destroy();
		this.state.layer.draw();
	};

	fitToWindow = () => {
		this.state.group.setWidth(this.state.layer.getWidth());
		this.state.group.setHeight(this.state.layer.getHeight());
		this.state.layer.draw();
	};

	render() {
		return <span>AreaBuilder</span>;
	}

	update() {}
}
