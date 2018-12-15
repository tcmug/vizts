import { h, Component, cloneElement } from "preact";
import * as Konva from "konva";
import { Scene } from "../Scene";

export interface LayerProps {
	scene?: Scene;
	fps?: number;
	frame?: Function;
	smoothing?: boolean;
	perfect?: boolean;
}

interface LayerState {
	layer: any;
	children: any;
	animation: any;
}

export class Layer extends Component<LayerProps, LayerState> {
	state = {
		layer: null,
		scene: null,
		fps: 0,
		children: [],
		animation: null
	} as LayerState;

	static stg = 0;

	constructor(props: any) {
		super(props);
	}

	refresh = () => {
		const { layer } = this.state;

		if (!this.props.perfect) {
			layer.getCanvas().setPixelRatio(1);
		}

		// Hacky hack is hacky; access context of layer and set smoothing off.
		if (!this.props.smoothing) {
			let ctx = (layer as any).getContext()._context;
			if ("imageSmoothingEnabled" in ctx) {
				ctx.imageSmoothingEnabled = false;
			} else {
				ctx.mozImageSmoothingEnabled = false;
				ctx.msImageSmoothingEnabled = false;
			}
		}

		layer.draw();
	};

	getLayer = () => this.state.layer;

	componentDidMount() {
		let layer = new Konva.Layer();
		this.props.scene.getStage().add(layer);
		this.setState({ layer: layer });
		this.state.layer.self = this;
		if (this.props.frame) {
			this.play();
		}
		this.refresh();
	}

	componentWillUnmount = () => {
		this.state.layer.destroy();
	};

	play() {
		if (this.state.animation) {
			this.state.animation.start();
			return;
		}

		let previous = 0;
		let passed = 0;
		let ms_per_frame = 1000 / this.props.fps;
		let self = this;

		let anim = new Konva.Animation((frame: any) => {
			passed += frame.time - previous;
			previous = frame.time;
			if (passed < ms_per_frame) {
				return false;
			}
			passed -= ms_per_frame;
			self.props.frame(self.state.children, frame);
			return true;
		}, this.state.layer);

		anim.start();

		this.setState({ animation: anim });
	}

	stop() {
		if (this.state.animation) this.state.animation.stop();
	}

	push = (ref: any) => {
		this.state.children.push(ref);
	};

	renderChildren(children: []) {
		if (this.state.layer) {
			return children.map((e: any) => {
				return cloneElement(e, {
					layer: this,
					ref: (ref: any) => this.push(ref),
					push: this.push
				});
			});
		}
		return null;
	}

	render(props: any) {
		return <ul class="layer">{this.renderChildren(props.children)}</ul>;
	}
}
