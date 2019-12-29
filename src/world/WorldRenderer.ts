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
                const chunk = chunks.get(ix, iy);
                const x = chunk.pixelX + pixelOffsetX;
                const y = chunk.pixelY + pixelOffsetY;

                chunk.render(canvasContext, x, y);

                canvasContext.strokeStyle = "white";

                const { array } = chunk.tiles;
                for (const tile of array) {
                    const { globalPixelX, globalPixelY, globalX, globalY, waterLevel, waterFlowTarget } = tile;

                    if (waterLevel !== 0) {
                        canvasContext.fillStyle = `rgba(0, 0, 255, ${Math.min(1, Math.abs(waterLevel) * 0.5 + 0.2)})`;
                        // canvasContext.fillStyle = `rgba(0, 0, 255, ${waterLevel === 0 ? 0 : 0.5})`;
                        canvasContext.fillRect(globalPixelX + pixelOffsetX, globalPixelY + pixelOffsetY, pixelsInTile, pixelsInTile);
                    }

                    if (waterFlowTarget) {
                        const centerX = globalPixelX + pixelOffsetX + pixelsInTile * 0.5;
                        const centerY = globalPixelY + pixelOffsetY + pixelsInTile * 0.5;
                        const lengthFactor = pixelsInTile;
                        let waterFlowX = waterFlowTarget.globalX - globalX;
                        let waterFlowY = waterFlowTarget.globalY - globalY;
                        const distance = Math.sqrt(waterFlowX * waterFlowX + waterFlowY * waterFlowY);
                        waterFlowX /= distance;
                        waterFlowY /= distance;

                        canvasContext.beginPath();
                        canvasContext.moveTo(centerX, centerY);
                        canvasContext.lineTo(centerX + waterFlowX * lengthFactor, centerY + waterFlowY * lengthFactor);
                        //canvasContext.arc(centerX, centerY, 2, 0, 2 * Math.PI);
                        canvasContext.closePath();
                        canvasContext.stroke();
                        //canvasContext.fillStyle = "red";
                        //canvasContext.fill();
                    }
                }
            }
        }
    }
}
