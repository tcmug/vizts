import { h, Component, cloneElement } from "preact";
import * as Konva from "konva";

export interface LayerProps {
	stage?: any;
	fps?: number;
	frame?: Function;
	smoothing?: boolean;
	perfect?: boolean;
}

interface LayerState {
	layer: any;
	stage: any;
	frame: Function;
	children: any;
	animation: any;
}

export class Layer extends Component<LayerProps, LayerState> {
	state = {
		layer: null,
		stage: null,
		fps: 0,
		frame: null,
		children: [],
		animation: null
	};

	static stg = 0;

	constructor(props) {
		super(props);
		this.setState({
			stage: props.stage,
			frame: props.frame
		});
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
	};

	componentDidMount() {
		let layer = new Konva.Layer();
		this.state.stage.add(layer);
		this.setState({ layer: layer });
		this.state.layer.self = this;
		if (this.state.frame) {
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

		let anim = new Konva.Animation(frame => {
			passed += frame.time - previous;
			previous = frame.time;
			if (passed < ms_per_frame) {
				return false;
			}
			passed -= ms_per_frame;
			self.state.frame(self.state.children, frame);

			return true;
		}, this.state.layer);

		anim.start();

		this.setState({ animation: anim });
	}

	stop() {
		if (this.state.animation) this.state.animation.stop();
	}

	push = ref => {
		this.state.children.push(ref);
	};

	renderChildren(props) {
		if (this.state.layer) {
			return props.children.map(e => {
				return cloneElement(e, {
					layer: this.state.layer,
					ref: ref => this.push(ref),
					push: this.push
				});
			});
		}
		return null;
	}

	render(props) {
		return <ul class="layer">{this.renderChildren(props)}</ul>;
	}
}
