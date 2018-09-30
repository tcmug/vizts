import * as Konva from "konva";

let resources: {};

export interface SpriteSpecs {
	image: string;
	width: number;
	height: number;
	offsetX: number;
	offsetY: number;
	fps: number;
	animations: {};
}

export class Resource {
	consctructor() {}
	async load() {
		return null;
	}
}

export class Sprite extends Resource {
	specs: SpriteSpecs;
	konvaSprite: Konva.Sprite;

	constructor(specs: SpriteSpecs) {
		super();
		this.specs = specs;
	}

	async load() {
		return new Promise((resolve, reject) => {
			let img = new Image();
			img.addEventListener("load", e => {
				this.konvaSprite = new Konva.Sprite({
					x: 0,
					y: 0,
					width: this.specs.width,
					height: this.specs.height,
					offsetX: this.specs.offsetX,
					offsetY: this.specs.offsetY,
					image: img,
					animation: Object.keys(this.specs.animations)[0],
					animations: this.specs.animations,
					frameRate: this.specs.fps
				} as Konva.SpriteConfig);
				this.konvaSprite.scaleX(3);
				this.konvaSprite.scaleY(3);
				resolve(img);
			});
			img.addEventListener("error", () => {
				reject(new Error("Failed to load"));
			});
			img.src = this.specs.image;
		});
	}
}

export function setResourceSource(resourceSource: {}) {
	resources = resourceSource;
}

export function getResourceByName(name: string) {
	return resources[name];
}
