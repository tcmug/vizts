
import {h, Component} from 'preact';
import * as Konva from 'Konva';
import { Client, ClientDef } from './Client';
import { ClientProperties } from '../shared/ClientProperties';
import { Action } from './Action';
import { Entity, EntityList } from './Entity';
import { ActionMapper, ActionMove } from './MainAction';
import { Actor } from './Actor';

export interface MainProps {
}

interface MainState {
    stage: any,
    layer: any,
    client: Client
}

const lord = require("../../assets/onti.png");


export default class Main extends Component<MainProps, MainState> {

    playerEntities: EntityList;
    divElement: any;

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
          width: this.divElement.clientWidth,
          height: this.divElement.clientHeight
        });

        this.state.layer = new Konva.Layer();

        let stage = this.state.layer;

        let self = this;

        let imgObj = new Image();
        imgObj.src = lord;
        imgObj.onload = () => {

            let actors = [];
            let i : number = 0;
            for (i = 0; i < 10; i++) {
                let actor = new Actor(this.state.layer, {image: imgObj});
                actors.push(actor);
            }

            self.state.stage.add(this.state.layer);

            let ctx = this.state.layer.getContext()._context;
            if ('imageSmoothingEnabled' in ctx) {
               ctx.imageSmoothingEnabled = false;
            } else {
               ctx.mozImageSmoothingEnabled = false;
               ctx.msImageSmoothingEnabled = false;
            }

            let previous = 0;
            let current = 0;
            let passed = 0;
            let fps = 1000 / 30;

            actors.forEach((a: Actor, index: number) => {a.play('idle');});
            var anim = new Konva.Animation(function(frame) {
                passed += frame.time - previous;
                previous = frame.time;
                if (passed < fps) {
                    return false;
                }
                actors = actors.sort((a: any, b: any) => a.obj.y() - b.obj.y());
                actors.forEach((a: Actor, index: number) => {a.obj.setZIndex(index);});
                passed -= fps;
                return true;
            }, self.state.layer);

            anim.start();
        }

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
        return <div ref={ (divElement) => this.divElement = divElement} id="World" onClick={ this.onClick }/>
    }
}
