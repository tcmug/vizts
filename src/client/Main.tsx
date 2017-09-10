
import {h, Component} from 'preact';
import Paper from './Paper';
import Client from './Client';

export interface MainProps {
}

interface MainState {
    snap: any
}

export default class Main extends Component<MainProps, MainState> {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let client = new Client({
            name: "User" + Math.random(),
            id: '',
        }, this.state.snap);
    }

    init = (snap: any) => {
        this.setState({ snap: snap });
    }

    render(props) {
        return <Paper id="World" init={ this.init }/>
    }
}
