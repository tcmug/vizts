
import {h, Component} from 'preact';
import { Scene } from './Scene';
import * as Konva from 'Konva';
import { Actor } from './Actor';
import { Onti } from './Onti';
import { Character } from './Character';
import { Player } from './Player';
import { Entity, EntityList } from './Entity';
import { World } from './World';

export interface MainProps {
}

interface MainState {
    scene: Scene;
    player: Entity;
    stage: any;
	ready: boolean;
    layer: any;
    world: World;
}

export default class Main extends Component<MainProps, MainState> {

	state = {
        scene: null,
        stage: null,
        player: null,
		ready: false,
        layer: null,
        world: new World(),
	};

    enterFrame = (frame: any) => {
        let entities = this.state.world.entities;
        entities = entities.sort((a: any, b: any) => a.group.y() - b.group.y());
        entities.forEach((a: Entity, index: number) => {a.update(this.state.world); a.group.setZIndex(index);});
    }

    enterScene = (scene: Scene) => {

        let stage = scene.getStage();
        let entities = this.state.world.entities;
        let layer = new Konva.Layer();

        layer.getCanvas().setPixelRatio(1);

        scene.setState({layer: layer});
        this.setState({stage: stage, layer: layer});

        for (let i = 0; i < 0; i++) {
            entities.push(new Onti(scene));
        }

        entities.push(new Character(scene));

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

        stage.on("click", (event) => {
            self.onClick(event);
        });

        return this.state.layer;
    }

     entityTap = (entity: Entity) => {
        console.log("This is a " + entity.constructor.name);
        this.state.player.walkTo(entity.position.x - 32, entity.position.y);
    }

    onClick = (event) => {
        if (event.target.nodeType == 'Shape' && event.target.parent && event.target.parent.owner) {
            this.entityTap(event.target.parent.owner);
        }
        else {
            const p = this.state.stage.getPointerPosition();
            this.state.player.walkTo(p.x, p.y);
        }
    }

    render() {
        return <Scene
            enterScene = { this.enterScene }
            enterFrame = { this.enterFrame }
        />;
    }
}
