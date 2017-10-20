
import { Action, ActionType } from './Action';
import { Entity } from './Entity';
import * as Konva from 'konva';

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

        var tween = new Konva.Tween({
          x: this.x,
          y: this.y,
          node: this.entity.element,
          duration: 1,
          easing: Konva.Easings.Linear
        });

        // play tween
        tween.play();
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
