import { h, Component } from "preact";
import { Scene } from "./Scene";
import * as Konva from "konva";
import { Point } from "./Point";

import { Layer } from "./scene/Layer";
import { Entity } from "./scene/Entity";

export interface MainProps {}

let ontimg = new Image();
ontimg.src = require("../../assets/onti.png");

interface MainState {
	sprite: any;
	entities: any;
	player: any;
}

export default class Main extends Component<MainProps, MainState> {
	player: any;

	componentWillMount() {
		const walkRight = [0, 0, 8, 8, 8, 0, 8, 8, 16, 0, 8, 8, 24, 0, 8, 8];
		const walkLeft = [0, 8, 8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 24, 8, 8, 8];
		const stand = [0, 16, 8, 8, 8, 16, 8, 8, 16, 16, 8, 8, 24, 16, 8, 8];
		var sprite = new Konva.Sprite({
			x: 0,
			y: 0,
			width: 64,
			height: 64,
			offsetX: 4,
			offsetY: 8,
			image: ontimg,
			animation: "stand",
			animations: {
				walkRight: walkRight,
				walkLeft: walkLeft,
				stand: stand
			},
			frameRate: 2,
			frameIndex: 0
		} as Konva.SpriteConfig);
		sprite.scaleX(4);
		sprite.scaleY(4);
		sprite.start();
		this.setState({ sprite: sprite, entities: [1, 2, 3] });
	}

	updateFrame = (children: any, frame: any) => {
		children = children.sort(
			(a: any, b: any) => a.state.group.y() - b.state.group.y()
		);
		children.forEach((entity: Entity, index: number) => {
			entity.update();
			entity.state.group.setZIndex(index);
		});
	};

	leClick = e => {
		this.state.player.walkTo(e.clientX, e.clientY);
	};

	save = e => {
		this.setState({ player: e });
	};

	render() {
		const spr = this.state.sprite;
		const entities = this.state.entities;
		return (
			<Scene onClick={this.leClick}>
				<Layer fps={30} frame={this.updateFrame} smoothing={false}>
					{entities.map(entity => {
						return (
							<Entity
								sprite={spr.clone()}
								position={new Point(Math.random() * 200, Math.random() * 200)}
							/>
						);
					})}
					<Entity
						init={this.save}
						sprite={spr.clone()}
						position={new Point(300, 300)}
					/>
					<Entity canPickup position={new Point(200, 200)} />
				</Layer>
			</Scene>
		);
	}
}
