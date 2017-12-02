
import {h, Component} from 'preact';
import * as Konva from 'Konva';
import { Client, ClientDef } from './Client';
import { ClientProperties } from '../shared/ClientProperties';
import { Action } from './Action';
import { Entity, EntityList } from './Entity';
import { ActionMapper, ActionMove } from './MainAction';

export interface MainProps {
}

interface MainState {
    stage: any,
    layer: any,
    client: Client
}



export default class Main extends Component<MainProps, MainState> {

    playerEntities: EntityList;

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

        this.state.stage = new Konva.Stage({
          container: "#World",
          width: 300,
          height: 300
        });

        this.state.layer = new Konva.Layer();
        this.state.stage.add(this.state.layer);

        this.playerEntities = [];
        this.state.client = new Client(def);
    }

    leave = (cp: any) => {
        let e = this.playerEntities.filter((e) => e.owner == cp.id)[0];
        e.element.remove();
        this.playerEntities = this.playerEntities.filter((e) => e.owner !== cp.id);
    }

    join = (cp: any) => {
        let e: Entity = {
            owner: cp.id,
            element: new Konva.Circle({
              x: 0,
              y: 0,
              radius: 10,
              fill: 'red',
              stroke: 'black',
              strokeWidth: 2
            })
        }
        this.state.layer.add(e.element);
        this.state.layer.draw();
        this.playerEntities = [ ...this.playerEntities, e ];
        console.log(this.playerEntities);
    }

    update = (cp: any) => {
        // console.log(cp);
        // let e = this.playerEntities.filter((e) => e.owner == cp.id)[0];
        // //e.element.animate({cx: cp.x, cy: cp.y}, 2000);
        // e.element.x = cp.x;
        // e.element.y = cp.y;
    }

    action = (cp: ActionMove) => {
        // console.log(cp);
        cp.entity = this.playerEntities.filter((e) => e.owner == cp.entity.owner)[0];
        cp.commit();
        this.state.layer.draw();
    }

    onClick = (event: any) => {
        let e = this.playerEntities.filter((e) => e.owner == this.state.client.client.id)[0];
        let action = new ActionMove({entity: e, x: event.x, y: event.y})
        action.commit();
        console.log(action);
        this.state.layer.draw();
        this.state.client.action(action);
    }

    render(props) {
        return <div id="World" onClick={ this.onClick }/>
    }
}
