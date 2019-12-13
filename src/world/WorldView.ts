import { WorldConfig } from "./WorldConfig";
import { GameCanvas } from "../GameCanvas";
import { MathUtil } from "../common/MathUtil";

export class WorldView {
    private worldConfig: WorldConfig;
    private gameCanvas: GameCanvas;

    public positionX: number;
    public positionY: number;
    public pixelOffsetX: number;
    public pixelOffsetY: number;

    constructor(worldConfig: WorldConfig, gameCanvas: GameCanvas, positionX: number, positionY: number) {
        this.worldConfig = worldConfig;
        this.gameCanvas = gameCanvas;
        this.positionX = positionX;
        this.positionY = positionY;
    }

    public move(deltaX: number, deltaY: number) {
        this.positionX += deltaX;
        this.positionY += deltaY;
        this.update();
    }

    public moveTo(x: number, y: number) {
        this.positionX = x;
        this.positionY = y;
        this.update();
    }

    public update() {
        const { worldConfig, gameCanvas } = this;
        const { tileSize, chunksX, chunksY, chunkSize } = worldConfig;

        const halfWidth = gameCanvas.width * 0.5;
        const halfHeight = gameCanvas.height * 0.5;

        // TODO: calculation improvements

        if (chunksX * chunkSize > gameCanvas.width / tileSize) {
            const halfWidthWorld = halfWidth / tileSize;
            this.positionX = MathUtil.clamp(this.positionX, halfWidthWorld, chunksX * chunkSize - halfWidthWorld);
        } else {
            this.positionX = chunksX * chunkSize * 0.5;
        }

        if (chunksY * chunkSize > gameCanvas.height / tileSize) {
            const halfHeightWorld = halfHeight / tileSize;
            this.positionY = MathUtil.clamp(this.positionY, halfHeightWorld, chunksY * chunkSize - halfHeightWorld);
        } else {
            this.positionY = chunksY * chunkSize * 0.5;
        }

        this.pixelOffsetX = halfWidth - this.positionX * tileSize;
        this.pixelOffsetY = halfHeight - this.positionY * tileSize;
    }
}
