
import { h, Component } from 'preact';
import * as Konva from 'Konva';


export interface SceneProps {
    enterFrame: Function;
    enterScene: Function;
}


interface SceneState {
    layer: any;
    stage: any;
}


export class Scene extends Component<SceneProps, SceneState> {

    state = {
        layer: null,
        stage: null,
    }

    divElement: any;

    constructor(props) {
        super(props);
    }

    fitToWindow = () => {

        const width = this.divElement.offsetWidth;
        const height = this.divElement.offsetHeight;

        this.state.stage.width(width)
        this.state.stage.height(height);

        let ctx = this.state.layer.getContext()._context;
        if ('imageSmoothingEnabled' in ctx) {
           ctx.imageSmoothingEnabled = false;
        } else {
           ctx.mozImageSmoothingEnabled = false;
           ctx.msImageSmoothingEnabled = false;
        }

    }

    getStage() {
        return this.state.stage;
    }

    getLayer() {
        return this.state.layer;
    }

    componentDidMount() {

        window.addEventListener('resize', this.fitToWindow);

        let self = this;
        Konva.pixelRatio = 1;
        this.state.stage = new Konva.Stage({
          container: "#World",
          width: this.divElement.clientWidth,
          height: this.divElement.clientHeight
        });

        self.state.layer = this.props.enterScene(this);

        let previous = 0;
        let current = 0;
        let passed = 0;
        let fps = 1000 / 30;

        var anim = new Konva.Animation((frame) => {

            passed += frame.time - previous;
            previous = frame.time;
            if (passed < fps) {
                return false;
            }
            passed -= fps;
            self.props.enterFrame(frame);

            return true;

        }, self.state.layer);

        anim.start();
    }

    render(props) {
        return <div ref={ (divElement) => this.divElement = divElement} id="World"/>
    }
}
