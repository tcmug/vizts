import { h, Component } from "preact";
import Main from "../../Main";

interface LoaderProps {
	resources: {};
	finished: Function;
}

interface LoaderState {
	loaded: number;
	toLoad: number;
}

import "./style.sss";

export default class Loader extends Component<LoaderProps, LoaderState> {
	state = {
		loaded: 0,
		toLoad: 0
	};

	async load(resource: any) {
		await resource.load();
		this.setState({ loaded: this.state.loaded + 1 });
		if (this.state.loaded == this.state.toLoad) {
			this.props.finished(this.props.resources);
		}
	}

	componentDidMount() {
		this.setState({
			toLoad: Object.keys(this.props.resources).length
		});
		Object.keys(this.props.resources).map(name => {
			this.load(this.props.resources[name]);
		});
	}

	render({}, { loaded, toLoad }) {
		const progress = Math.ceil((loaded / toLoad) * 100);
		return (
			<div class="loader">
				<div class="holder">
					<div class="progress" style={`width:${progress}%`} />
				</div>
			</div>
		);
	}
}
