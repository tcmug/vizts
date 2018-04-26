
import {h, Component} from 'preact';
import * as Konva from 'Konva';
import { Actor } from './Actor';

export interface SceneProps {
    resources: {},
}

interface SceneState {
    stage: any,
    layer: any
}


export default class Scene extends Component<SceneProps, SceneState> {

    divElement: any;

    constructor(props) {
        super(props);
    }

    componentDidMount() {

        this.state.stage = new Konva.Stage({
          container: "#World",
          width: this.divElement.clientWidth,
          height: this.divElement.clientHeight
        });

        this.state.layer = new Konva.Layer();

        let stage = this.state.layer;

        let self = this;

        let actors = [];
        let i : number = 0;
        for (i = 0; i < 10; i++) {
            let actor = new Actor(this.state.layer, {image: this.props.resources['onti']});
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

        //actors.forEach((a: Actor, index: number) => {a.play('idle');});

        var anim = new Konva.Animation((frame) => {
            self.onEnterFrame(frame);
            return true;
        }, self.state.layer);

        anim.start();
    }


    onEnterFrame = (frame: any) => {
        console.log("FRAME");

/*
        let previous = 0;
        let current = 0;
        let passed = 0;
        let fps = 1000 / 30;

        passed += frame.time - previous;
        previous = frame.time;
        if (passed < fps) {
            return false;
        }
        actors = actors.sort((a: any, b: any) => a.obj.y() - b.obj.y());
        actors.forEach((a: Actor, index: number) => {a.update(); a.obj.setZIndex(index);});
        passed -= fps;
*/

    }

    update = (cp: any) => {
        // console.log(cp);
        // let e = this.playerEntities.filter((e) => e.owner == cp.id)[0];
        // //e.element.animate({cx: cp.x, cy: cp.y}, 2000);
        // e.element.x = cp.x;
        // e.element.y = cp.y;
    }

    onClick = (event: any) => {
        // let e = this.playerEntities.filter((e) => e.owner == this.state.client.client.id)[0];
        // let action = new ActionMove({entity: e, x: event.x, y: event.y})
        // action.commit();
        // console.log(action);
        // this.state.layer.draw();
        // this.state.client.action(action);
    }

    render(props) {
        return <div ref={ (divElement) => this.divElement = divElement} id="World" onClick={ this.onClick }/>
    }
}
