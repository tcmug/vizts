import { h, Component } from "preact";
import { Scene } from "./Scene";
import * as Konva from "konva";
import { Point, PointList } from "./Point";
import { render } from "preact-render-to-string";

import Loader from "./Loader";
import { Toolbar, ToolbarItem } from "./components/Toolbar";
import { Layer } from "./scene/Layer";
import { Entity, HitBox } from "./scene/Entity";
import { Item } from "./scene/Item";
import { Area } from "./scene/Area";
import { Line } from "./scene/Line";
import { Polygon, shortestPathInPolygonList } from "./Polygon";

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
	items: any;
	player: any;
	test: any;
	loading: any;
	resources: any;
	back: any;
	p1: Point;
	p2: Point;
	which: any;
	area: PointList;
	path: PointList;
	editPoints: PointList;
	editing: boolean;
}

export default class Main extends Component<MainProps, MainState> {
	player: any;

	state = {
		sprite: null,
		entities: null,
		items: [],
		player: null,
		test: null,
		loading: true,
		resources: {},
		back: null,
		p1: new Point(70, 15),
		p2: new Point(90, 95),
		which: 1,
		area: [],
		path: [],
		editPoints: [],
		editing: true
	};

	componentWillMount() {
		const pts = [
			new Point(10, 10),
			new Point(100, 10),
			new Point(50, 30),
			new Point(100, 50),
			new Point(50, 70),
			new Point(100, 80),
			new Point(100, 100),
			new Point(10, 100),
			new Point(10, 70),
			new Point(55, 60),
			new Point(10, 50),
			new Point(10, 10)
		];
		pts.map(pt => pt.mul(new Point(7, 7)));
		this.setState({ area: pts });
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

	entClick = (entity, e) => {
		if (entity instanceof Area) {
			//console.log(entity.containsPoint(new Point(e.x, e.y)));
		}
		if (entity == this.state.back) {
			//this.state.player.pickUp(entity);
			//this.state.player.walkTo(e.x, e.y);
		}

		// if (this.state.which == 1) {
		// 	this.setState({ p1: new Point(e.x, e.y), which: 2 });
		// } else {
		// 	this.setState({ p2: new Point(e.x, e.y), which: 1 });
		// }
		// const polygon = new Polygon(this.state.area);
		// const path = [this.state.p1, this.state.p2];
		// const polygonList = [polygon];
		// this.setState({
		// 	path: shortestPathInPolygonList(path[0], path[1], polygonList)
		// });
	};

	bgClick = e => {
		if (this.state.which == 1) {
			this.setState({ p1: new Point(e.x, e.y), which: 2 });
		} else {
			this.setState({ p2: new Point(e.x, e.y), which: 1 });
		}
		// const polygon = new Polygon(this.state.area);
		// const path = [this.state.p1, this.state.p2];
		// const polygonList = [polygon];
		// this.setState({
		// 	path: shortestPathInPolygonList(path[0], path[1], polygonList)
		// });
		//this.state.player.walkTo(e.x, e.y);

		if (this.state.editing) {
			this.setState({
				editPoints: [...this.state.editPoints, new Point(e.x, e.y)]
			});
			console.log(render(<Area points={this.state.editPoints} />));
		}
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
		const spr = this.state.sprite;
		this.setState({
			test: test,
			sprite: sprite,
			entities: [
				<Entity
					sprite={sprite.clone()}
					position={new Point(Math.random() * 200, Math.random() * 200)}
				/>,
				<Item
					init={this.bg}
					hitAccuracy={HitBox.Pixel}
					sprite={sprite.clone()}
					position={new Point(Math.random() * 200, Math.random() * 200)}
				/>,
				<Item
					init={this.bg}
					hitAccuracy={HitBox.Pixel}
					sprite={sprite.clone()}
					position={new Point(Math.random() * 200, Math.random() * 200)}
				/>
			]
		});
	};

	addEntity = (event: Event) => {
		this.setState({
			entities: [
				...this.state.entities,
				<Entity
					sprite={this.state.sprite.clone()}
					position={new Point(Math.random() * 200, Math.random() * 200)}
				/>
			]
		});
	};

	addArea(event: Event) {
		console.log("area");
	}

	render() {
		if (this.state.loading) {
			return <Loader resources={resources} finished={this.finishedLoading} />;
		}
		const entities = this.state.entities;
		return (
			<div>
				<Toolbar>
					<ToolbarItem label="Add entity" action={this.addEntity} />
					<ToolbarItem label="Add area" action={this.addArea} />
				</Toolbar>
				<Scene entityClick={this.entClick} backgroundClick={this.bgClick}>
					<Layer fps={30} frame={this.updateFrame} smoothing={false}>
						{entities}
					</Layer>
				</Scene>
			</div>
		);
	}
} /*

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
						<Line points={this.state.editPoints} />
						<Area
							points={[
								new Point(615, 690),
								new Point(658, 406),
								new Point(509, 406),
								new Point(731, 225),
								new Point(697, 170)
							]}
						/>
						*/
