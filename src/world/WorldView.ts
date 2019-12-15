import { GameConfig } from "../GameConfig";
import { GameCanvas } from "../GameCanvas";
import { MathUtil } from "../common/MathUtil";

export class WorldView {
    private gameCanvas: GameCanvas;

    public positionX: number;
    public positionY: number;
    public pixelOffsetX: number;
    public pixelOffsetY: number;

    constructor(gameCanvas: GameCanvas, positionX: number, positionY: number) {
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
        const { width, height } = this.gameCanvas;
        const { pixelsInTile, tilesXInWorld, tilesYInWorld } = GameConfig;

        const halfWidth = width * 0.5;
        const halfHeight = height * 0.5;

        if (tilesXInWorld > width / pixelsInTile) {
            const halfWidthWorld = halfWidth / pixelsInTile;
            this.positionX = MathUtil.clamp(this.positionX, halfWidthWorld, tilesYInWorld - halfWidthWorld);
        } else {
            this.positionX = tilesXInWorld * 0.5;
        }

        if (tilesYInWorld > height / pixelsInTile) {
            const halfHeightWorld = halfHeight / pixelsInTile;
            this.positionY = MathUtil.clamp(this.positionY, halfHeightWorld, tilesYInWorld - halfHeightWorld);
        } else {
            this.positionY = tilesYInWorld * 0.5;
        }

        this.pixelOffsetX = halfWidth - this.positionX * pixelsInTile;
        this.pixelOffsetY = halfHeight - this.positionY * pixelsInTile;
    }
}
