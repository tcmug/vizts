
import TheWorld from './World';

interface EntityJSON {
    owner: string;
};

export class Entity {
    owner: string;
    element: any | null;

    constructor(id: string) {
        this.owner = id;
        this.element = TheWorld.newObj();
    }

    toJSON(): EntityJSON {
        return {
            owner: this.owner
        };
    }

    static fromJSON(obj: EntityJSON) {
        return TheWorld.getEntityById(obj.owner);
    }

}

export type EntityList = Entity[];
