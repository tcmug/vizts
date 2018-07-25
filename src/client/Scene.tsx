import { h, Component, cloneElement } from "preact";
import * as Konva from "konva";

export interface SceneProps {
	entityClick?: Function;
	backgroundClick?: Function;
}

interface SceneState {
	stage: any;
}

export class Scene extends Component<SceneProps, SceneState> {
	state = {
		stage: null
	};

	sceneWrapper: any;

	constructor(props) {
		super(props);
	}

	fitToWindow = () => {
		const width = this.sceneWrapper.offsetWidth;
		const height = this.sceneWrapper.offsetHeight;

		// this.state.stage.width(width);
		this.state.stage.height(height);
	};

	getStage = () => this.state.stage;

	componentDidMount() {
		//window.addEventListener("resize", this.fitToWindow);

		let self = this;
		const stage = new Konva.Stage({
			container: "#World",
			width: this.sceneWrapper.clientWidth,
			height: this.sceneWrapper.clientHeight
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

	renderChildren(props) {
		if (!this.state.stage) {
			return null;
		}
		return props.children.map(e => {
			return cloneElement(e, { stage: this.getStage() });
		});
	}

	render(props) {
		return (
			<div ref={sceneWrapper => (this.sceneWrapper = sceneWrapper)} id="World">
				{this.renderChildren(props)}
			</div>
		);
	}
}
