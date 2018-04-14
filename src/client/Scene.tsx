
import {h, Component} from 'preact';
import Main from './Main'
import Loader from './Loader'

export interface SceneProps {
}

interface SceneState {
	ready: boolean;
	resources: {};
}


export default class Scene extends Component<SceneProps, SceneState> {

	state = {
		ready: false,
		resources: {}
	};

    constructor(props) {
        super(props);
    }

    finishedLoading = (resources) => {
    	this.setState({ready: true, resources: resources});
    }

    componentDidMount() {
    }

    render(props) {
    	if (!this.state.ready) {
			const arr = {
				'dude': require("../../assets/dude.png"),
				'onti': require("../../assets/onti.png")
			};
	    	return <Loader resources={arr} finished={this.finishedLoading}/>
        }
        return <Main resources={this.state.resources}/>;
    }
}
