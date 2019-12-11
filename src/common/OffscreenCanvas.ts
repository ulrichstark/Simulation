export class OffscreenCanvas {
    public canvas: HTMLCanvasElement;
    public canvasContext: CanvasRenderingContext2D;

    constructor(width: number, height: number) {
        this.canvas = document.createElement("canvas");
        this.canvasContext = this.canvas.getContext("2d") as CanvasRenderingContext2D;

        this.canvas.width = width;
        this.canvas.height = height;
    }
}
