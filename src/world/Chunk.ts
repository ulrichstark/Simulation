import { Tile, TileMountMethod } from "./Tile";
import { OffscreenCanvas } from "../common/OffscreenCanvas";
import { GameConfig } from "../GameConfig";
import { Map } from "../common/Map";

export class Chunk {
    private offscreenCanvas: OffscreenCanvas;
    private offscreenCanvasDirty: boolean = true;

    public chunkX: number;
    public chunkY: number;
    public pixelX: number;
    public pixelY: number;
    public tileStartX: number;
    public tileStartY: number;
    public tiles: Map<Tile>;

    constructor(x: number, y: number, tileMountMethod: TileMountMethod) {
        this.chunkX = x;
        this.chunkY = y;

        const { tilesInChunk, pixelsInChunk } = GameConfig;
        this.pixelX = x * pixelsInChunk;
        this.pixelY = y * pixelsInChunk;
        this.tileStartX = x * tilesInChunk;
        this.tileStartY = y * tilesInChunk;

        this.tiles = new Map(tilesInChunk, tilesInChunk, (x, y) => new Tile(x, y, this, tileMountMethod));
        this.offscreenCanvas = new OffscreenCanvas(pixelsInChunk, pixelsInChunk);
    }

    private renderOffscreen() {
        const { tiles, offscreenCanvas } = this;
        const { pixelsInTile } = GameConfig;
        const { canvasContext } = offscreenCanvas;

        for (const tile of tiles.array) {
            const { localPixelX: x, localPixelY: y } = tile;

            canvasContext.fillStyle = `rgb(30, ${120 + tile.height * 15}, 30)`;
            canvasContext.fillRect(x, y, pixelsInTile, pixelsInTile);

            if (tile.neighborsMap.LEFT && tile.height > tile.neighborsMap.LEFT.height) {
                canvasContext.fillStyle = `rgb(20, ${120 + tile.neighborsMap.LEFT.height * 10}, 20)`;
                canvasContext.fillRect(x, y, pixelsInTile * 0.2, pixelsInTile);
            }

            if (tile.neighborsMap.RIGHT && tile.height > tile.neighborsMap.RIGHT.height) {
                canvasContext.fillStyle = `rgb(20, ${120 + tile.neighborsMap.RIGHT.height * 10}, 20)`;
                canvasContext.fillRect(x + pixelsInTile * 0.8, y, pixelsInTile * 0.2, pixelsInTile);
            }

            if (tile.neighborsMap.BOTTOM && tile.height > tile.neighborsMap.BOTTOM.height) {
                canvasContext.fillStyle = `rgb(14, ${100 + tile.neighborsMap.BOTTOM.height * 10}, 14)`;
                canvasContext.fillRect(x, y + pixelsInTile * 0.6, pixelsInTile, pixelsInTile * 0.4);
            } else {
                if (tile.neighborsMap.BOTTOM_LEFT && tile.height > tile.neighborsMap.BOTTOM_LEFT.height) {
                    canvasContext.fillStyle = `rgb(17, ${110 + tile.neighborsMap.BOTTOM_LEFT.height * 10}, 17)`;
                    canvasContext.fillRect(x, y + pixelsInTile * 0.6, pixelsInTile * 0.2, pixelsInTile * 0.4);
                }

                if (tile.neighborsMap.BOTTOM_RIGHT && tile.height > tile.neighborsMap.BOTTOM_RIGHT.height) {
                    canvasContext.fillStyle = `rgb(17, ${110 + tile.neighborsMap.BOTTOM_RIGHT.height * 10}, 17)`;
                    canvasContext.fillRect(x + pixelsInTile * 0.8, y + pixelsInTile * 0.6, pixelsInTile * 0.2, pixelsInTile * 0.4);
                }
            }
        }
    }

    public invalidate() {
        this.offscreenCanvasDirty = true;
    }

    public render(canvasContext: CanvasRenderingContext2D, offsetX: number, offsetY: number) {
        if (this.offscreenCanvasDirty) {
            this.offscreenCanvasDirty = false;
            this.renderOffscreen();
        }
        canvasContext.drawImage(this.offscreenCanvas.canvas, Math.floor(offsetX), Math.floor(offsetY));
    }
}
