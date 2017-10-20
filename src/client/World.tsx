
import * as Konva from 'konva';
import { Entity, EntityList } from './entity';

class World {

    layer: Konva.Layer;
    stage: Konva.Stage;
    playerEntities: EntityList;

    constructor() {
        this.playerEntities = [];
    }

    getEntityById(id: string) {
        return this.playerEntities.filter((e) => e.owner == id)[0];
    }

    addEntity(e: Entity) {
        this.playerEntities = [ ...this.playerEntities, e ];
    }

    removeEntityById(id: string) {
        this.playerEntities = this.playerEntities.filter((e) => e.owner !== id);
    }

    bind(container: string) {
        this.stage = new Konva.Stage({
            container: container,
            width: window.innerWidth,
            height: window.innerHeight
        });

        // add canvas element
        this.layer = new Konva.Layer();
        this.stage.add(this.layer);
    }

    newObj() {
        let obj = new Konva.Circle({
            x: 20,
            y: 20,
            radius: 12,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 2
        });
        this.layer.add(obj);
        this.layer.draw();
        return obj;
    }
}

let TheWorld = new World();

export default TheWorld;
