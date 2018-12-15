import * as Konva from "konva";

let resources: Object = {};

export interface SpriteResourceSpecs {
	image: string;
	width: number;
	height: number;
	offsetX: number;
	offsetY: number;
	fps: number;
	animations: {};
}

export interface ImageResourceSpecs {
	image: string;
	width: number;
	height: number;
}

export class Resource {
	consctructor() {}
	async load(): Promise<any> {
		return null;
	}
}

export class SpriteResource extends Resource {
	specs: SpriteResourceSpecs;
	konvaSprite: Konva.Sprite;

	constructor(specs: SpriteResourceSpecs) {
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

export class ImageResource extends Resource {
	specs: ImageResourceSpecs;
	konvaImage: Konva.Image;

	constructor(specs: ImageResourceSpecs) {
		super();
		this.specs = specs;
	}

	async load() {
		return new Promise((resolve, reject) => {
			let img = new Image();
			img.addEventListener("load", e => {
				this.konvaImage = new Konva.Image({
					x: 0,
					y: 0,
					width: this.specs.width,
					height: this.specs.height,
					image: img
				} as Konva.ImageConfig);
				resolve(img);
			});
			img.addEventListener("error", () => {
				reject(new Error("Failed to load"));
			});
			img.src = this.specs.image;
		});
	}
}

export function setResourceSource(resourceSource: Object) {
	resources = resourceSource;
}

export function getResourceByName(name: string): Resource {
	return (resources as any)[name] as Resource;
}
