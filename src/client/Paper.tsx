
import {h, Component} from 'preact';
import * as Snap from 'snapsvg';
import * as eve from 'eve';

export interface PaperProps {
    id: string,
    init: Function
}

export default class Paper extends Component<PaperProps, any> {

    componentDidMount() {
        const selector = "#" + this.props.id;
        this.state.paper = Snap(selector);
        this.props.init(this.state.paper);
    }

    render (props) {
        return <svg className="snap" id={ this.props.id }></svg>
    }
}

