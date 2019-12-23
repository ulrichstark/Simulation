import { GameConfig } from "./GameConfig";

type FrameMethod = () => void;
type ResizeMethod = () => void;

export class GameCanvas {
    private canvasElement: HTMLCanvasElement;
    private frameMethod: FrameMethod;
    private resizeMethod: ResizeMethod;
    private lastTime: number | null = null;
    private upscalingFactor: number;
    private frameHandle: number;

    public canvasContext: CanvasRenderingContext2D;
    public width: number;
    public height: number;
    public pointerX: number = -1;
    public pointerY: number = -1;
    public deltaTime: number = 0;

    constructor(frameMethod: FrameMethod, resizeMethod: ResizeMethod) {
        this.frameMethod = frameMethod;
        this.resizeMethod = resizeMethod;
        this.canvasElement = document.createElement("canvas");
        this.canvasContext = this.canvasElement.getContext("2d") as CanvasRenderingContext2D;

        this.applyDimensions = this.applyDimensions.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleFrame = this.handleFrame.bind(this);
    }

    private applyDimensions() {
        const { innerWidth, innerHeight, devicePixelRatio } = window;
        this.upscalingFactor = devicePixelRatio;
        this.width = innerWidth * devicePixelRatio;
        this.height = innerHeight * devicePixelRatio;

        this.canvasElement.width = this.width;
        this.canvasElement.height = this.height;
        this.canvasElement.setAttribute("style", `width: ${innerWidth}px; height: ${innerHeight}px`);

        this.resizeMethod();
    }

    private scheduleFrame() {
        this.frameHandle = requestAnimationFrame(this.handleFrame);
    }

    private handleFrame(time: number) {
        this.scheduleFrame();

        if (this.lastTime !== null) {
            this.deltaTime = Math.min(0.1, (time - this.lastTime) * 0.001);
        }
        this.lastTime = time;

        this.frameMethod();
    }

    private handleMouseMove(event: MouseEvent) {
        this.pointerX = event.offsetX * this.upscalingFactor;
        this.pointerY = event.offsetY * this.upscalingFactor;
    }

    public mount() {
        window.addEventListener("resize", this.applyDimensions);
        window.addEventListener("mousemove", this.handleMouseMove);
        this.applyDimensions();
        this.scheduleFrame();

        document.body.appendChild(this.canvasElement);
    }

    public unmount() {
        window.removeEventListener("resize", this.applyDimensions);
        window.removeEventListener("mousemove", this.handleMouseMove);

        cancelAnimationFrame(this.frameHandle);
        this.canvasElement.remove();
    }
}
