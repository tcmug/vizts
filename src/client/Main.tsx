
import {h, Component} from 'preact';

import { Client, ClientDef } from './Client';
import { ClientProperties } from '../shared/ClientProperties';
import { Action } from './Action';
import { Entity, EntityList } from './Entity';
import { ActionMapper, ActionMove } from './MainAction';
import TheWorld from './World';

export interface MainProps {
}

interface MainState {
    snap: any,
    client: Client
}

export default class Main extends Component<MainProps, MainState> {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let def: ClientDef;
        def = {
          onJoin: this.join,
          onLeave: this.leave,
          onUpdate: this.update,
          onAction: this.action
        };

        this.state.client = new Client(def);

        TheWorld.bind("World");

    }

    leave = (cp: any) => {
        TheWorld.removeEntityById(cp.id);
    }

    join = (cp: any) => {
        TheWorld.addEntity(new Entity(cp.id));
    }

    update = (cp: any) => {

    }

    action = (cp: ActionMove) => {
        cp.entity = Entity.fromJSON(cp.entity);
        cp.commit();
    }

    init = (snap: any) => {
        this.setState({ snap: snap });
    }

    onClick = (event: any) => {
        let e = TheWorld.getEntityById(this.state.client.client.id);
        let action = new ActionMove({entity: e, x: event.x, y: event.y})
        action.commit();
        this.state.client.action(action);
    }

    render(props) {
        return <div id="World" onClick={ this.onClick }/>
    }
}
