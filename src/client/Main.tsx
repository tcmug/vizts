import { h, Component } from "preact";
import { Scene } from "./Scene";
import * as Konva from "konva";
import { Point } from "./Point";

import Loader from "./Loader";
import { Layer } from "./scene/Layer";
import { Entity, HitBox } from "./scene/Entity";
import { Item } from "./scene/Item";
import { Area } from "./scene/Area";

export interface MainProps {}

let ontimg = new Image();
let testimg = new Image();

var resources = {
	onti: require("../../assets/onti.png"),
	backetest: require("../../assets/backtest.png")
};

interface MainState {
	sprite: any;
	entities: any;
	player: any;
	test: any;
	loading: any;
	resources: any;
	back: any;
}

export default class Main extends Component<MainProps, MainState> {
	player: any;

	state = {
		sprite: null,
		entities: null,
		player: null,
		test: null,
		loading: true,
		resources: {},
		back: null
	};

	componentWillMount() {}

	updateFrame = (children: any, frame: any) => {
		children = children.sort(
			(a: any, b: any) => a.state.group.y() - b.state.group.y()
		);
		children.forEach((entity: Entity, index: number) => {
			entity.update();
			entity.state.group.setZIndex(index);
		});
	};

	entClick = (entity, e) => {
		if (entity instanceof Area) {
			console.log(entity.containsPoint(new Point(e.x, e.y)));
		}
		if (entity == this.state.back) {
			//this.state.player.pickUp(entity);
			this.state.player.walkTo(e.x, e.y);
		}
	};

	bgClick = e => {
		//this.state.player.walkTo(e.x, e.y);
	};

	save = e => {
		this.setState({ player: e });
	};

	bg = e => {
		this.setState({ back: e });
	};

	finishedLoading = res => {
		this.setState({ loading: false, resources: res });

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
			image: this.state.resources["onti"],
			animation: "stand",
			animations: {
				walkRight: walkRight,
				walkLeft: walkLeft,
				stand: stand
			},
			frameRate: 2,
			frameIndex: 0
		} as Konva.SpriteConfig);
		sprite.scaleX(3);
		sprite.scaleY(3);
		sprite.start();
		var test = new Konva.Image({
			image: this.state.resources["backetest"],
			width: 640,
			height: 480,
			x: 0,
			y: 0
		});
		this.setState({ test: test, sprite: sprite, entities: [1, 2, 3] });
	};

	render() {
		const spr = this.state.sprite;
		const test = this.state.test;
		const entities = this.state.entities;
		const pts = [
			{ x: 10, y: 10 } as Point,
			{ x: 100, y: 10 } as Point,
			{ x: 50, y: 100 } as Point,
			{ x: 100, y: 150 } as Point,
			{ x: 50, y: 150 } as Point,
			{ x: 15, y: 200 } as Point
		];
		if (this.state.loading) {
			return <Loader resources={resources} finished={this.finishedLoading} />;
		}
		return (
			<Scene entityClick={this.entClick} backgroundClick={this.bgClick}>
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
					<Item
						init={this.bg}
						hitAccuracy={HitBox.Pixel}
						sprite={test}
						position={new Point(0, 0)}
					/>
					<Area points={pts} />
				</Layer>
			</Scene>
		);
	}
}
