
import {h, Component} from 'preact';
import { Scene } from './Scene';
import * as Konva from 'Konva';
import { Onti } from './Onti';
import { Player } from './Player';
import { Entity, EntityList } from './Entity';

export interface MainProps {
}

interface MainState {
    scene: Scene;
    player: Entity;
    stage: any;
	ready: boolean;
    layer: any;
    entities: EntityList;
}



export default class Main extends Component<MainProps, MainState> {

	state = {
        scene: null,
        stage: null,
        player: null,
		ready: false,
        layer: null,
        entities: []
	};

    enterFrame = (frame: any) => {
        let entities = this.state.entities;
        entities = entities.sort((a: any, b: any) => a.group.y() - b.group.y());
        entities.forEach((a: Entity, index: number) => {a.update(); a.group.setZIndex(index);});
    }

    enterScene = (scene: Scene) => {

        let stage = scene.getStage();
        let entities = this.state.entities;
        let layer = new Konva.Layer();

        scene.setState({layer: layer});
        this.setState({stage: stage, layer: layer});
        entities.push(new Onti(scene));
        entities.push(new Onti(scene));
        entities.push(new Onti(scene));

        let self = this;
        let player = new Player(scene);
        entities.push(player);
        this.setState({player: player});

        stage.add(layer);

        let ctx = this.state.layer.getContext()._context;
        if ('imageSmoothingEnabled' in ctx) {
           ctx.imageSmoothingEnabled = false;
        } else {
           ctx.mozImageSmoothingEnabled = false;
           ctx.msImageSmoothingEnabled = false;
        }

        stage.on("contentClick", (event) => {
            self.onClick(event);
        });

        return this.state.layer;
    }

    onClick = (event) => {
        const p = this.state.stage.getPointerPosition();
        this.state.player.walkTo(p.x, p.y);
    }

    render() {
        return <Scene
            enterScene = { this.enterScene }
            enterFrame = { this.enterFrame }
        />;
    }
}
