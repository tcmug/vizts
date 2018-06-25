import { h, Component } from "preact";
import { Scene } from "./Scene";
import * as Konva from "konva";
import { World } from "./World";
import { Point } from "./Point";

import { Layer } from "./scene/Layer";
import { Entity } from "./scene/Entity";

export interface MainProps {}

interface MainState {
  scene: Scene;
  stage: any;
  mode: String;
  ready: boolean;
  layer: any;
  world: World;
}

export default class Main extends Component<MainProps, MainState> {
  state = {
    scene: null,
    stage: null,
    mode: "walking",
    player: null,
    ready: false,
    layer: null,
    world: new World()
  };

  enterFrame = (frame: any) => {
    // this.setState({mode: "bob"});
    // this.state.layer.draw();
    /*
        let entities = this.state.world.entities;
        entities = entities.sort((a: any, b: any) => a.group.y() - b.group.y());
        entities.forEach((a: OldEntity, index: number) => {a.update(this.state.world); a.group.setZIndex(index);});
*/
  };

  enterScene = (scene: Scene) => {
    // let layer: any = new Konva.Layer();
    // let stage = scene.getStage();
    // layer.getCanvas().setPixelRatio(1);
    // let ctx = layer.getContext()._context;
    // if ('imageSmoothingEnabled' in ctx) {
    //    ctx.imageSmoothingEnabled = false;
    // } else {
    //    ctx.mozImageSmoothingEnabled = false;
    //    ctx.msImageSmoothingEnabled = false;
    // }
    // this.setState({
    //     scene: scene,
    //     layer: layer,
    // });
    // return layer;
    /*
        let stage = scene.getStage();
        let entities = this.state.world.entities;
        let layer = new Konva.Layer();

        layer.getCanvas().setPixelRatio(1);

        scene.setState({layer: layer});
        this.setState({scene: scene, stage: stage, layer: layer});

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
*/
  };

  //  entityTap = (entity: OldEntity) => {
  //     //console.log("This is a " + entity.constructor.name);
  //     if (this.state.player.position.distanceTo(entity.position) > 60) {
  //         this.state.player.walkTo(entity.position.x - 32, entity.position.y);
  //     }
  //     else {
  //         //this.enterDialogueMode(entity);
  //     }
  // }

  getScene = () => this.state.scene;
  getStage = () => this.state.stage;

  // onClick = (event) => {
  //     if (event.target.nodeType == 'Shape' && event.target.parent && event.target.parent.owner) {
  //         this.entityTap(event.target.parent.owner);
  //     }
  //     else {
  //         const p = this.getStage().getPointerPosition();
  //         this.state.player.walkTo(p.x, p.y);
  //     }
  // }
  //

  updateFrame = (children: any, frame: any) => {
    children.map(item =>
      item.setPosition(new Point(Math.random() * 500, Math.random() * 500))
    );
  };

  updateFrame2 = (children: any, frame: any) => {
    children.map(item =>
      item.setPosition(new Point(Math.random() * 500, Math.random() * 500))
    );
  };

  render() {
    return (
      <Scene>
        <Layer fps={4} frame={this.updateFrame}>
          <Entity position={new Point(10, 10)} />
          <Entity position={new Point(50, 10)} />
        </Layer>

        <Layer fps={1} frame={this.updateFrame2}>
          <Entity position={new Point(40, 10)} />
          <Entity position={new Point(44, 30)} />
        </Layer>
      </Scene>
    );
  }
}
