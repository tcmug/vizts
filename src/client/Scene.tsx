import { h, Component, cloneElement } from "preact";
import * as Konva from "konva";

export interface SceneProps {
	onClick?: Function;
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

		this.setState({
			stage: new Konva.Stage({
				container: "#World",
				width: this.sceneWrapper.clientWidth,
				height: this.sceneWrapper.clientHeight
			})
		});

		this.state.stage.on("click", entity => {
			if (entity.target.self) this.props.onClick(entity.target.self);
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
