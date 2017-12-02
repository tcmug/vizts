
export enum ActionType {
    Spawn,
    Destroy,
    Update,
    Move
}

export class Action {
    type: ActionType;

    constructor(specs?: any) {
        if (specs) {
            this.copy(specs);
        }
    }

    commit() {
        console.log("base action");
    }

    copy(specs: any) {
        for (let attr in specs) {
            this[attr] = specs[attr];
        }
    }
}


