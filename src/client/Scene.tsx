
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

    sceneWrapper: any;

    constructor(props) {
        super(props);
    }

    fitToWindow = () => {

        const width = this.sceneWrapper.offsetWidth;
        const height = this.sceneWrapper.offsetHeight;

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

        this.state.stage = new Konva.Stage({
          container: "#World",
          width: this.sceneWrapper.clientWidth,
          height: this.sceneWrapper.clientHeight
        });

        self.state.layer = this.props.enterScene(this);

        let previous = 0;
        let current = 0;
        let passed = 0;
        let ms_per_frame = 1000 / 30;

        var anim = new Konva.Animation((frame) => {

            passed += frame.time - previous;
            previous = frame.time;
            if (passed < ms_per_frame) {
                return false;
            }
            passed -= ms_per_frame;
            self.props.enterFrame(frame);

            return true;

        }, self.state.layer);

        anim.start();
    }

    render(props) {
        return <div ref={ (sceneWrapper) => this.sceneWrapper = sceneWrapper} id="World"/>
    }
}
