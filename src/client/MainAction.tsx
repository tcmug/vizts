
import { Action, ActionType } from './Action';
import { Entity } from './Entity';

export class ActionEntity extends Action {

    entity: Entity;

    constructor(specs?: any) {
        super(specs);
        this.type = ActionType.Move;
    }

    commit() {
    }
}


export class ActionMove extends ActionEntity {

    x: number;
    y: number;

    constructor(specs?: any) {
        super(specs);
        this.type = ActionType.Move;
    }

    commit() {
        this.entity.element.setX(this.x);
        this.entity.element.setY(this.y);
        //this.entity.element.draw();
        //animate({cx: this.x, cy: this.y}, 2000);
        console.log("moving to " + this.x + " " + this.y);
    }
}


// let ActionMap = {
//     [ActionType.Move]: ActionMOve
// };

export function ActionMapper(action: any) {
    switch (action.type) {
        case ActionType.Move: return new ActionMove(action);
    }
    return action;
}
