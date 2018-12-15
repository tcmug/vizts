import { h, Component, VNode } from "preact";
import { Scene } from "./Scene";
import { Point, PointList } from "./lib/Point";
// import * as Markup from "preact-markup";

import Loader from "./components/Loader";
import { Toolbar, ToolbarItem } from "./components/Toolbar";
import AreaBuilder from "./components/AreaBuilder";

import { Layer } from "./scene/Layer";
import { Entity } from "./scene/Entity";
import { Area } from "./scene/Area";
import { Image } from "./scene/Image";
import {
	SpriteResource,
	SpriteResourceSpecs,
	ImageResource,
	ImageResourceSpecs,
	setResourceSource
} from "./Resources";

var resources = {
	onti: new SpriteResource({
		image: require("../../assets/onti.png"),
		animations: {
			walkRight: [0, 0, 8, 8, 8, 0, 8, 8, 16, 0, 8, 8, 24, 0, 8, 8],
			walkLeft: [0, 8, 8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 24, 8, 8, 8],
			stand: [0, 16, 8, 8, 8, 16, 8, 8, 16, 16, 8, 8, 24, 16, 8, 8]
		},
		width: 64,
		height: 64,
		offsetX: 4,
		offsetY: 8,
		fps: 2
	} as SpriteResourceSpecs),
	player: new SpriteResource({
		image: require("../../assets/dude.png"),
		animations: {
			walkRight: [0, 0, 8, 8, 8, 0, 8, 8, 16, 0, 8, 8, 24, 0, 8, 8],
			walkLeft: [0, 8, 8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 24, 8, 8, 8],
			stand: [0, 16, 8, 8, 8, 16, 8, 8, 16, 16, 8, 8, 24, 16, 8, 8]
		},
		width: 64,
		height: 64,
		offsetX: 4,
		offsetY: 8,
		fps: 2
	} as SpriteResourceSpecs),
	background: new ImageResource({
		image: require("../../assets/background.png"),
		animations: {
			walkRight: [0, 0, 8, 8, 8, 0, 8, 8, 16, 0, 8, 8, 24, 0, 8, 8],
			walkLeft: [0, 8, 8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 24, 8, 8, 8],
			stand: [0, 16, 8, 8, 8, 16, 8, 8, 16, 16, 8, 8, 24, 16, 8, 8]
		},
		width: 1000,
		height: 300
	} as ImageResourceSpecs)
};

export enum MODE {
	ZERO,
	ADD_AREA
}

interface MainProps {}
interface MainState {
	entities: VNode[];
	items: any;
	loading: boolean;
	resources: Object;
	mode: MODE;
	editTools: any;
	player?: Entity;
}

function exportComponent(node: VNode) {
	return {
		name: (node.nodeName as any).name,
		props: node.attributes
	};
}

function importComponent({ name, props }: { name: string; props: any }): any {
	switch (name) {
		case "Area":
			return <Area {...props} />;
		case "Entity":
			return <Entity {...props} />;
	}
	return [];
}

export default class Main extends Component<MainProps, MainState> {
	state = {
		entities: [
			<Area
				points={[
					new Point(40, 40),
					new Point(400, 40),
					new Point(400, 100),
					new Point(200, 100),
					new Point(200, 200),
					new Point(400, 200),

					new Point(400, 300),
					new Point(500, 300),
					new Point(500, 200),
					new Point(1400, 200),
					new Point(1400, 350),
					new Point(500, 350),
					new Point(400, 350),

					new Point(400, 400),
					new Point(40, 400)
				]}
			>
				<Entity
					save={(e: Entity) => this.setState({ player: e })}
					sprite="onti"
					position={new Point(100, 120)}
				/>
			</Area>
		],
		items: [],
		loading: true,
		resources: {},
		mode: MODE.ZERO,
		editTools: [],
		player: null
	} as MainState;

	updateFrame = (children: any, frame: any) => {
		children = children.sort(
			(a: any, b: any) => a.state.group.y() - b.state.group.y()
		);
		children.forEach((entity: Entity, index: number) => {
			entity.update();
			entity.state.group.setZIndex(index);
		});
	};

	entClick = (entity: Entity, e: any) => {
		if (this.state.editTools.length == 0)
			this.state.player.walkTo(e.x, e.y);
		// if (entity instanceof Entity) {
		// 	if (this.state.player) {
		// 		entity.containsPoint());
		// 	}
		// }
	};

	bgClick = (e: any) => {};

	finishedLoading = (res: any) => {
		setResourceSource(res);
		this.setState({
			loading: false,
			resources: res
		});
		let save = localStorage.getItem("test");
		const ents = save
			? JSON.parse(save).map((e: any) => importComponent(e))
			: [];
		this.setState({
			entities: [this.state.entities, ...ents]
		});
	};

	addEntity = (event: Event) => {
		// this.setState({
		// 	entities: [
		// 		...this.state.entities,
		// 		<Entity
		// 			sprite="onti"
		// 			position={
		// 				new Point(Math.random() * 200, Math.random() * 200)
		// 			}
		// 		/>
		// 	]
		// });
	};

	finishArea = ({ points }: { points: PointList }) => {
		this.setState({
			editTools: [],
			entities: [...this.state.entities, <Area points={points} />]
		});
		const exp = this.state.entities.map((node: VNode) => {
			return exportComponent(node);
		});
		localStorage.setItem("test", JSON.stringify(exp));
	};

	addArea = (event: Event) => {
		this.setState({
			editTools: [
				...this.state.editTools,
				<AreaBuilder finish={this.finishArea} />
			]
		});
	};

	moveBg = (children: any, frame: any) => {
		//onst pos = this.state.player.getPosition();
		// children[0].setPosition(
		// 	// new Point(
		// 	// 	Math.sin(frame.lastTime / 500) * 20,
		// 	// 	Math.cos(frame.lastTime / 500) * 20
		// 	// )
		// );
	};

	render() {
		const { loading, entities, editTools } = this.state;
		if (loading) {
			return (
				<Loader resources={resources} finished={this.finishedLoading} />
			);
		}
		return (
			<div>
				<Toolbar>
					<ToolbarItem label="Add entity" action={this.addEntity} />
					<ToolbarItem label="Add area" action={this.addArea} />
				</Toolbar>
				<Scene
					entityClick={this.entClick}
					backgroundClick={this.bgClick}
				>
					<Layer
						perfect={false}
						smoothing={false}
						fps={60}
						frame={this.moveBg}
					>
						<Image image="background" position={new Point(0, 0)} />
					</Layer>
					<Layer
						perfect={false}
						fps={60}
						frame={this.updateFrame}
						smoothing={false}
					>
						{entities}
					</Layer>
					{editTools.length > 0 ? (
						<Layer perfect={false}>{editTools}</Layer>
					) : (
						[]
					)}
				</Scene>
			</div>
		);
	}
}
