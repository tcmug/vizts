
import {h, Component} from 'preact';
import Loader from './Loader'
import Scene from './Scene';

export interface MainProps {
}

interface MainState {
	ready: boolean;
	resources: {};
}


export default class Main extends Component<MainProps, MainState> {

	state = {
		ready: false,
		resources: {}
	};

    constructor(props) {
        super(props);
    }

    create = () => {
        console.log("create")
    }

    destroy = () => {
        console.log("destroy")
    }

    enterFrame = () => {
        console.log("frame");
    }

    componentDidMount() {
    }

    finishedLoading = (resources) => {
        this.setState({ready: true, resources: resources});
    }

    render(props) {
    	if (!this.state.ready) {
			const arr = {
				'dude': require("../../assets/dude.png"),
				'onti': require("../../assets/onti.png")
			};
	    	return <Loader scene={this} resources={arr} finished={this.finishedLoading}/>
        }
        return <Scene resources={this.state.resources}/>;
    }
}
