import { h, Component, cloneElement } from "preact";
import * as Konva from "konva";
import { debounce } from "ts-debounce";

export interface SceneProps {
	entityClick?: Function;
	backgroundClick?: Function;
}

interface SceneState {
	stage: Konva.Stage | null;
}

export class Scene extends Component<SceneProps, SceneState> {
	state = {
		stage: null
	} as SceneState;

	reference: any;

	constructor(props: any) {
		super(props);
	}

	fitToWindow = () => {
		const width = this.reference.offsetWidth;
		const height = this.reference.offsetHeight;
		this.state.stage.setWidth(width);
		this.state.stage.setHeight(height);
		this.state.stage.getLayers().forEach((l: any) => l.self.refresh());
	};

	getStage = () => this.state.stage;

	componentDidMount() {
		window.addEventListener("resize", debounce(this.fitToWindow, 100));

		const stage = new Konva.Stage({
			container: "#World",
			width: this.reference.offsetWidth,
			height: this.reference.offsetHeight
		});

		stage.on("click", e => {
			const node = e.target as any;
			if (node.nodeType == "Stage") {
				this.props.backgroundClick(stage.getPointerPosition());
			} else {
				this.props.entityClick(node.self, stage.getPointerPosition());
			}
		});

		this.setState({
			stage: stage
		});
	}

	renderChildren(props: any) {
		if (!this.state.stage) {
			return null;
		}
		if (
			props.children.filter(
				(e: any) => !(e.nodeName && e.nodeName.name === "Layer")
			).length > 0
		) {
			console.error(
				"Non <Layer> components will not be rendered under <Stage>"
			);
		}
		return props.children
			.filter((e: any) => e.nodeName && e.nodeName.name === "Layer")
			.map((e: any) => {
				return cloneElement(e, {
					scene: this
				});
			});
	}

	render(props: Object) {
		return (
			<div ref={e => (this.reference = e)} id="World">
				{this.renderChildren(props)}
			</div>
		);
	}
}
