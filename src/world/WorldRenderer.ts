import { World } from "./World";
import { WorldView } from "./WorldView";
import { GameCanvas } from "../GameCanvas";

export class WorldRenderer {
    private world: World;

    constructor(world: World) {
        this.world = world;
    }

    public render(gameCanvas: GameCanvas, worldView: WorldView) {
        const { chunks, config } = this.world;
        const { chunksX, chunksY, chunkSize, tileSize } = config;
        const { canvasContext, width, height } = gameCanvas;
        const { positionX, positionY } = worldView;
        const chunkPixelSize = chunkSize * tileSize;

        const visibleChunksX = Math.ceil((width / chunkPixelSize) * 0.5);
        const visibleChunksY = Math.ceil((height / chunkPixelSize) * 0.5);
        const chunkCenterX = Math.floor(positionX / chunkSize);
        const chunkCenterY = Math.floor(positionY / chunkSize);

        const chunkStartX = Math.max(0, chunkCenterX - visibleChunksX);
        const chunkEndX = Math.min(chunksX - 1, chunkCenterX + visibleChunksX);

        const chunkStartY = Math.max(0, chunkCenterY - visibleChunksY);
        const chunkEndY = Math.min(chunksY - 1, chunkCenterY + visibleChunksY);

        for (let ix = chunkStartX; ix <= chunkEndX; ix++) {
            for (let iy = chunkStartY; iy <= chunkEndY; iy++) {
                const chunk = chunks[ix][iy];
                const x = Math.floor(chunk.x * chunkPixelSize + worldView.pixelOffsetX);
                const y = Math.floor(chunk.y * chunkPixelSize + worldView.pixelOffsetY);

                chunk.render(canvasContext, x, y);
            }
        }
    }
}
