
import { h, Component } from 'preact';
import { Scene } from './Scene';
import Main from './Main';

interface LoaderProps {
    scene: Main;
    resources: {};
    finished: Function;
}

interface LoaderState {
    loaded: number,
    toLoad: number,
}


export default class Loader extends Component<LoaderProps, LoaderState> {

    state = {
        loaded: 0,
        toLoad: 0,
    }

    componentDidMount() {

        let self = this;

        this.setState({
            toLoad: Object.keys(this.props.resources).length,
        });

        for (let name in this.props.resources) {
            let img = new Image();
            img.src = this.props.resources[name];
            this.props.resources[name] = img;
            img.onload = () => {
                self.setState({loaded: self.state.loaded + 1});
                if (self.state.loaded == self.state.toLoad) {
                    self.props.finished(self.props.resources);
                }
            }
        }
    }

    render({}, {loaded, toLoad}) {
    	return <div>
    		    { loaded } / { toLoad }
    		</div>;
    }
}
