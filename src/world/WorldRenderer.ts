import { World } from "./World";
import { WorldView } from "./WorldView";
import { GameCanvas } from "../GameCanvas";
import { GameConfig } from "../GameConfig";
import { Directions, DirectionsDirect, applyVectorToDirections } from "../common/Direction";
import { Vector } from "../common/Vector";

export class WorldRenderer {
    private world: World;

    constructor(world: World) {
        this.world = world;
    }

    public render(gameCanvas: GameCanvas, worldView: WorldView) {
        const { chunks } = this.world;
        const { chunksXInWorld, chunksYInWorld, tilesInChunk, pixelsInChunk, pixelsInTile } = GameConfig;
        const { canvasContext, width, height } = gameCanvas;
        const { positionX, positionY, pixelOffsetX, pixelOffsetY } = worldView;

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
                const x = chunk.pixelX + pixelOffsetX;
                const y = chunk.pixelY + pixelOffsetY;

                chunk.render(canvasContext, x, y);

                canvasContext.strokeStyle = "white";
                for (let tx = 0; tx < tilesInChunk; tx++) {
                    for (let ty = 0; ty < tilesInChunk; ty++) {
                        const { globalPixelX, globalPixelY, water } = chunk.tiles[tx][ty];

                        if (water.waterLevel > 0.001) {
                            canvasContext.fillStyle = `rgba(0, 0, 255, ${Math.min(0.9, water.waterLevel * 0.3)})`;
                            canvasContext.fillRect(globalPixelX + pixelOffsetX, globalPixelY + pixelOffsetY, pixelsInTile, pixelsInTile);
                        }

                        /*
                        const centerX = globalPixelX + pixelOffsetX + pixelsInTile * 0.5;
                        const centerY = globalPixelY + pixelOffsetY + pixelsInTile * 0.5;
                        const lengthFactor = pixelsInTile;

                        canvasContext.beginPath();
                        canvasContext.moveTo(centerX, centerY);
                        canvasContext.lineTo(centerX + water.waterFlow.x * lengthFactor, centerY + water.waterFlow.y * lengthFactor);
                        canvasContext.arc(centerX, centerY, 2, 0, 2 * Math.PI);
                        canvasContext.closePath();
                        canvasContext.stroke();
                        canvasContext.fillStyle = "red";
                        canvasContext.fill();
                        */
                    }
                }
            }
        }
    }
}
