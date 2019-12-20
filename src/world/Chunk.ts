import { Tile, TileMountMethod } from "./Tile";
import { Factory } from "../common/Factory";
import { OffscreenCanvas } from "../common/OffscreenCanvas";
import { GameConfig } from "../GameConfig";

export class Chunk {
    private offscreenCanvas: OffscreenCanvas;
    private offscreenCanvasDirty: boolean = true;

    public chunkX: number;
    public chunkY: number;
    public pixelX: number;
    public pixelY: number;
    public tileStartX: number;
    public tileStartY: number;
    public tiles: Tile[][];

    constructor(x: number, y: number, tileMountMethod: TileMountMethod) {
        this.chunkX = x;
        this.chunkY = y;

        const { tilesInChunk, pixelsInChunk } = GameConfig;
        this.pixelX = x * pixelsInChunk;
        this.pixelY = y * pixelsInChunk;
        this.tileStartX = x * tilesInChunk;
        this.tileStartY = y * tilesInChunk;

        this.tiles = Factory.createTwoDimensionalArray(tilesInChunk, tilesInChunk, (x, y) => new Tile(x, y, this, tileMountMethod));
        this.offscreenCanvas = new OffscreenCanvas(pixelsInChunk, pixelsInChunk);
    }

    private renderOffscreen() {
        const { tiles, offscreenCanvas } = this;
        const { tilesInChunk, pixelsInTile } = GameConfig;
        const { canvasContext } = offscreenCanvas;

        for (let ix = 0; ix < tilesInChunk; ix++) {
            for (let iy = 0; iy < tilesInChunk; iy++) {
                const tile = tiles[ix][iy];
                const { localPixelX: x, localPixelY: y } = tile;

                canvasContext.fillStyle = `rgb(30, ${120 + tile.height * 15}, 30)`;
                canvasContext.fillRect(x, y, pixelsInTile, pixelsInTile);

                if (tile.neighbors.LEFT && tile.height > tile.neighbors.LEFT.height) {
                    canvasContext.fillStyle = `rgb(20, ${120 + tile.neighbors.LEFT.height * 10}, 20)`;
                    canvasContext.fillRect(x, y, pixelsInTile * 0.2, pixelsInTile);
                }

                if (tile.neighbors.RIGHT && tile.height > tile.neighbors.RIGHT.height) {
                    canvasContext.fillStyle = `rgb(20, ${120 + tile.neighbors.RIGHT.height * 10}, 20)`;
                    canvasContext.fillRect(x + pixelsInTile * 0.8, y, pixelsInTile * 0.2, pixelsInTile);
                }

                if (tile.neighbors.BOTTOM && tile.height > tile.neighbors.BOTTOM.height) {
                    canvasContext.fillStyle = `rgb(14, ${100 + tile.neighbors.BOTTOM.height * 10}, 14)`;
                    canvasContext.fillRect(x, y + pixelsInTile * 0.6, pixelsInTile, pixelsInTile * 0.4);
                } else {
                    if (tile.neighbors.BOTTOM_LEFT && tile.height > tile.neighbors.BOTTOM_LEFT.height) {
                        canvasContext.fillStyle = `rgb(17, ${110 + tile.neighbors.BOTTOM_LEFT.height * 10}, 17)`;
                        canvasContext.fillRect(x, y + pixelsInTile * 0.6, pixelsInTile * 0.2, pixelsInTile * 0.4);
                    }

                    if (tile.neighbors.BOTTOM_RIGHT && tile.height > tile.neighbors.BOTTOM_RIGHT.height) {
                        canvasContext.fillStyle = `rgb(17, ${110 + tile.neighbors.BOTTOM_RIGHT.height * 10}, 17)`;
                        canvasContext.fillRect(x + pixelsInTile * 0.8, y + pixelsInTile * 0.6, pixelsInTile * 0.2, pixelsInTile * 0.4);
                    }
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
