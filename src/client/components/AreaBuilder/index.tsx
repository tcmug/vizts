import { h, Component } from "preact";
import * as Konva from "konva";
import { debounce } from "ts-debounce";

import { Point, PointList } from "../../lib/Point";
import { Layer } from "../../scene/Layer";

export interface AreaBuilderProps {
	finish: Function;
	layer?: Layer;
}

class VKonva extends Konva.Rect {
	self: Layer;
}

export interface AreaBuilderState {
	group: Konva.Node;
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
	} as AreaBuilderState;

	constructor(props: any) {
		super(props);

		let rect = new Konva.Rect({
			x: 0,
			y: 0,
			width: this.props.layer.getLayer().width(),
			height: this.props.layer.getLayer().height(),
			fill: "red",
			opacity: 0.2
		}) as any;

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

		this.setState({ area });

		rect.on("click", this.handleClick);

		window.addEventListener("resize", debounce(this.fitToWindow, 200));

		this.props.layer
			.getLayer()
			.add(this.state.area)
			.add(this.state.group)
			.draw();
	}

	handleClick = (e: any) => {
		if (e.evt.button !== 0) {
			this.props.finish({ points: this.state.points });
			return;
		}
		const stage = this.props.layer.props.scene.getStage();
		const pointer = stage.getPointerPosition();
		pointer.x += stage.offsetX();
		pointer.y += stage.offsetY();

		this.setState({
			points: [...this.state.points, new Point(pointer.x, pointer.y)]
		});

		this.state.area.points(
			this.state.area.points().concat([pointer.x, pointer.y])
		);

		this.props.layer.getLayer().add(
			new Konva.Rect({
				x: pointer.x - 1,
				y: pointer.y - 1,
				width: 3,
				height: 3,
				fill: "red",
				stroke: "black",
				strokeWidth: 2,
				opacity: 0.5,
				draggable: true
			})
		);

		this.props.layer.getLayer().draw();
	};

	componentWillUnmount = () => {
		this.state.group.destroy();
		this.state.area.destroy();
		this.props.layer.getLayer().draw();
	};

	fitToWindow = () => {
		//this.state.group.setWidth(this.props.layer.getWidth());
		//this.state.group.setHeight(this.props.layer.getHeight());
		this.props.layer.getLayer().draw();
	};

	render() {
		return <span>AreaBuilder</span>;
	}

	update() {}
}
