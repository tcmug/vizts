import {h, Component} from 'preact';

export interface HelloWorldProps {
    name: string
}

export default class HelloWorld extends Component<HelloWorldProps, any> {
    render (props) {
        return <p>Well, hello hello {props.name}!</p>
    }
}
