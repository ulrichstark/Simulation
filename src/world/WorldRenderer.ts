import { World } from "./World";
import { WorldView } from "./WorldView";
import { GameCanvas } from "../GameCanvas";
import { GameConfig } from "../GameConfig";

export class WorldRenderer {
    private world: World;

    constructor(world: World) {
        this.world = world;
    }

    public render(gameCanvas: GameCanvas, worldView: WorldView) {
        const { chunks } = this.world;
        const { chunksXInWorld, chunksYInWorld, tilesInChunk, pixelsInChunk } = GameConfig;
        const { canvasContext, width, height } = gameCanvas;
        const { positionX, positionY } = worldView;

        const visibleChunksX = Math.ceil((width / pixelsInChunk) * 0.5);
        const visibleChunksY = Math.ceil((height / pixelsInChunk) * 0.5);
        const chunkCenterX = Math.floor(positionX / tilesInChunk);
        const chunkCenterY = Math.floor(positionY / tilesInChunk);

        const chunkStartX = Math.max(0, chunkCenterX - visibleChunksX);
        const chunkEndX = Math.min(chunksXInWorld - 1, chunkCenterX + visibleChunksX);

        const chunkStartY = Math.max(0, chunkCenterY - visibleChunksY);
        const chunkEndY = Math.min(chunksYInWorld - 1, chunkCenterY + visibleChunksY);

        for (let ix = chunkStartX; ix <= chunkEndX; ix++) {
            for (let iy = chunkStartY; iy <= chunkEndY; iy++) {
                const chunk = chunks[ix][iy];
                const x = chunk.pixelX + worldView.pixelOffsetX;
                const y = chunk.pixelY + worldView.pixelOffsetY;

                chunk.render(canvasContext, x, y);
            }
        }
    }
}
