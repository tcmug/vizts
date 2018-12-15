import { h, Component } from "preact";
import * as Konva from "konva";

import { Point } from "../lib/Point";
import { Layer } from "./Layer";
import { getResourceByName, ImageResource } from "../Resources";

export interface ImageProps {
	position: Point;
	layer?: Layer;
	image?: string;
}

export interface ImageState {
	group?: Konva.Image;
	position: Point;
}

export class Image extends Component<ImageProps, ImageState> {
	state = { group: null } as ImageState;

	constructor(props: any) {
		super(props);
		this.setState({
			position: props.position
		});
		if (props.image) {
			const image = getResourceByName(props.image) as ImageResource;
			this.setState({
				group: image.konvaImage.clone()
			});
			this.props.layer.getLayer().add(this.state.group);
			const ratio =
				this.props.layer.getLayer().getHeight() /
				image.konvaImage.height();
			this.state.group.height(this.props.layer.getLayer().getHeight());
			this.state.group.width(image.konvaImage.width() * ratio);
			this.props.layer.getLayer().draw();
		}
	}

	setPosition(point: Point) {
		this.setState({ position: point });
		this.state.group.position(this.state.position);
	}

	componentDidMount() {
		// console.log(this.props.layer.getLayer());
		//this.state.group.setX(pos.x).setY(pos.y);
	}

	componentWillUnmount = () => {
		this.state.group.destroy();
	};

	render() {
		return <span class="image" />;
	}

	update() {}
}
