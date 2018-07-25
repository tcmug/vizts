import { h, Component } from "preact";
import { Point } from "../Point";
import { Layer } from "./Layer";
import * as Konva from "konva";

export enum HitBox {
	Box,
	Pixel
}

export interface EntityProps {
	position: Point;
	layer?: Layer;
	sprite?: Konva.Sprite;
	init?: Function;
	canPickup?: boolean;
	hitAccuracy?: HitBox;
}

export interface EntityState {
	id: number;
	position: Point;
	layer: Layer;
	group: any;
	target: Point;
	speed: number;
	hitAccuracy: HitBox;
}

let _id: number = 1;

export class Entity extends Component<EntityProps, EntityState> {
	state = {
		id: -1,
		position: null,
		layer: null,
		group: null,
		target: null,
		speed: 3,
		hitAccuracy: HitBox.Box
	};

	constructor(props) {
		super(props);
		this.setState({
			position: props.position,
			id: _id,
			layer: props.layer,
			hitAccuracy: props.hitAccuracy
		});
		if (props.sprite) {
			this.setState({ group: props.sprite });
		}
		_id = _id + 1;
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
				strokeWidth: 2
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
		this.state.layer.add(this.state.group);
		if (this.props.init) {
			this.props.init(this);
		}
	}

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
		if (x > this.state.group.getX()) {
			this.state.group.animation("walkRight");
		} else {
			this.state.group.animation("walkLeft");
		}
		//this.state.group.start();
		this.setState({ target: new Point(x, y) });
	};

	reachTarget() {
		this.state.group.animation("stand");
		this.setState({ target: null });
	}

	setPosition(point: Point) {
		this.setState({ position: point });
		this.state.group.setX(this.state.position.x).setY(this.state.position.y);
	}

	pickUp(item: Entity) {
		item.state.group.hide();
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
			this.reachTarget();
		}
	}
}
