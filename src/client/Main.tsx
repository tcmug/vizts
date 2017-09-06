
import {h, Component} from 'preact';
import Paper from './Paper';
import * as io from 'socket.io-client';

export interface MainProps {
}

export default class Main extends Component<MainProps, any> {

    socket: any;

    constructor(props) {
        super(props);
        this.socket = io();
    }

    callMe(paper) {
        paper.circle(15, 15, 10)
          .attr({
            fill: "#bada55",
            stroke: "#000",
            strokeWidth: 5
          });
    }

    render (props) {
        return <Paper id="World" init={ this.callMe }/>
    }
}
