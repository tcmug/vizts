import { h, Component } from "preact";
import { Scene } from "./Scene";
import * as Konva from "konva";
import { World } from "./World";
import { Point } from "./Point";

import { Layer } from "./scene/Layer";
import { Entity } from "./scene/Entity";

export interface MainProps {}

let ontimg = new Image();
ontimg.src = require("../../assets/onti.png");

interface MainState {
	sprite: any;
}

export default class Main extends Component<MainProps, MainState> {
	componentWillMount() {
		const walkAnim = [0, 0, 8, 8, 8, 0, 8, 8, 16, 0, 8, 8, 24, 0, 8, 8];
		var sprite = new Konva.Sprite({
			x: 0,
			y: 0,
			width: 64,
			height: 64,
			image: ontimg,
			animation: "walking",
			animations: {
				walking: walkAnim
			},
			frameRate: 2,
			frameIndex: 0
		} as Konva.SpriteConfig);
		sprite.animation("walking");
		sprite.scaleX(4);
		sprite.scaleY(4);
		sprite.start();
		this.setState({ sprite: sprite });
	}

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

	updateFrame3 = (children: any, frame: any) => {};

	render() {
		return (
			<Scene>
				<Layer fps={1} frame={this.updateFrame}>
					<Entity position={new Point(10, 10)} />
					<Entity position={new Point(50, 10)} />
				</Layer>

				<Layer fps={1} frame={this.updateFrame2}>
					<Entity position={new Point(40, 10)} />
					<Entity position={new Point(44, 30)} />
				</Layer>

				<Layer fps={30} frame={this.updateFrame3} smoothing={false}>
					<Entity sprite={this.state.sprite} position={new Point(40, 10)} />
				</Layer>
			</Scene>
		);
	}
}
