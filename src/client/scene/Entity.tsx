import { h, Component } from "preact";
import * as Konva from "konva";

import { Point, PointList } from "../lib/Point";
import { Layer } from "./Layer";
import { Area } from "./Area";
import { getResourceByName, SpriteResource } from "../Resources";

export enum HitBox {
	Box,
	Pixel
}

export interface EntityProps {
	position: Point;
	layer?: Layer;
	sprite?: string;
	init?: Function;
	canPickup?: boolean;
	hitAccuracy?: HitBox;
	save?: Function;
	area?: Area;
}

export interface EntityState {
	id: number;
	position: Point;
	group: any;
	target: Point;
	speed: number;
	hitAccuracy: HitBox;
	path: PointList;
	drawnPath?: Konva.Line;
}

let _id: number = 1;

export class Entity extends Component<EntityProps, EntityState> {
	state = {
		id: -1,
		position: null,
		group: null,
		target: null,
		speed: 3,
		hitAccuracy: HitBox.Box,
		path: [],
		drawnPath: null
	} as EntityState;

	constructor(props: any) {
		super(props);
		this.setState({
			position: props.position,
			id: _id,
			hitAccuracy: props.hitAccuracy
		});
		if (props.sprite) {
			this.setState({
				group: (getResourceByName(
					props.sprite
				) as SpriteResource).konvaSprite.clone()
			});
		}
		_id = _id + 1;
		if (this.props.save) this.props.save(this);
	}

	componentDidMount() {
		const pos = this.state.position;

		if (!this.state.group) {
			let rect = new Konva.Rect({
				x: pos.x,
				y: pos.y,
				width: 5,
				height: 5,
				fill: "red",
				stroke: "black",
				strokeWidth: 2,
				draggable: true
			});
			this.setState({
				group: rect
			});
		} else {
			this.state.group.setX(pos.x).setY(pos.y);
			if (this.state.group.start) {
				this.state.group.start();
			}
		}
		if (this.state.hitAccuracy == HitBox.Pixel) {
			this.state.group.cache();
			this.state.group.drawHitFromCache();
		}
		this.state.group.self = this;
		this.props.layer.getLayer().add(this.state.group);
		if (this.props.init) {
			this.props.init(this);
		}
	}

	componentWillUnmount = () => {
		this.state.group.destroy();
		if (this.state.drawnPath) {
			this.state.drawnPath.destroy();
		}
	};

	render() {
		return (
			<span class="entity">
				#{this.state.id} {this.state.position && this.state.position.x}{" "}
				{this.state.position && this.state.position.y}
			</span>
		);
	}

	/******/

	public walkTo = (x: number, y: number) => {
		if (this.props.area) {
			this.setState({
				path: this.props.area.pathBetween(
					this.state.position,
					new Point(x, y)
				)
			});
			this.displayPath();
			this.setState({ target: this.state.path.shift() });
		} else {
			this.setState({ target: new Point(x, y) });
		}
		if (this.state.target) {
			if (this.state.target.x > this.state.group.getX()) {
				this.state.group.animation("walkRight");
			} else {
				this.state.group.animation("walkLeft");
			}
		}
	};

	reachTarget() {
		this.state.group.animation("stand");
		this.setState({ target: null });
	}

	setPosition(point: Point) {
		this.setState({ position: point });
		this.state.group
			.setX(this.state.position.x)
			.setY(this.state.position.y);
	}

	getPosition(): Point {
		return this.state.position;
	}

	pickUp(item: Entity) {
		item.state.group.hide();
	}

	displayPath() {
		if (this.state.drawnPath) {
			this.state.drawnPath.destroy();
		}
		let path = new Konva.Line({
			points: this.state.path.reduce((r, e) => {
				r.push(e.x, e.y);
				return r;
			}, []),
			fill: "#00D2FF",
			stroke: "red",
			strokeWidth: 2,
			opacity: 1
		});
		this.setState({
			drawnPath: path
		});
		this.props.layer.getLayer().add(this.state.drawnPath);
	}

	shouldComponentUpdate() {
		return false;
	}

	update() {
		if (this.state.target == null) {
			return;
		}
		const target = this.state.target;
		let distance = target.distanceTo(this.state.position);

		if (distance > 3) {
			let point = new Point(
				(target.x - this.state.group.getX()) / distance,
				(target.y - this.state.group.getY()) / distance
			);
			point.mul(new Point(this.state.speed, this.state.speed));
			point.add(this.state.position);
			this.setPosition(point);
		} else {
			if (this.state.path.length > 0) {
				this.setState({ target: this.state.path.shift() });
				if (this.state.target.x > this.state.group.getX()) {
					this.state.group.animation("walkRight");
				} else {
					this.state.group.animation("walkLeft");
				}
			} else {
				this.reachTarget();
			}
		}
	}
}
