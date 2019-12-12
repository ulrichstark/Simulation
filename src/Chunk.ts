import { Tile } from "./Tile";
import { Factory } from "./common/Factory";
import { OffscreenCanvas } from "./common/OffscreenCanvas";
import { WorldConfig } from "./WorldConfig";

type TileHeightMethod = (x: number, y: number) => number;

export class Chunk {
    private worldConfig: WorldConfig;
    private offscreenCanvas: OffscreenCanvas;
    private offscreenCanvasDirty: boolean = true;

    public x: number;
    public y: number;
    public tiles: Tile[][];

    constructor(x: number, y: number, worldConfig: WorldConfig, tileHeightMethod: TileHeightMethod) {
        this.x = x;
        this.y = y;
        this.worldConfig = worldConfig;

        const { chunkSize, tileSize } = worldConfig;
        const offscreenCanvasSize = chunkSize * tileSize;
        const chunkOffsetX = this.x * chunkSize;
        const chunkOffsetY = this.y * chunkSize;

        this.tiles = Factory.createTwoDimensionalArray(chunkSize, chunkSize, (x, y) => {
            const globalX = chunkOffsetX + x;
            const globalY = chunkOffsetY + y;

            return {
                x: x,
                y: y,
                globalX: chunkOffsetX + x,
                globalY: chunkOffsetY + y,
                key: `${globalX}_${globalY}`,
                chunk: this,
                height: tileHeightMethod(x, y),
                neighbors: Factory.createDirectionMap(null)
            };
        });
        this.offscreenCanvas = new OffscreenCanvas(offscreenCanvasSize, offscreenCanvasSize);

        this.renderOffscreen();
    }

    private renderOffscreen() {
        const { tiles, worldConfig, offscreenCanvas } = this;
        const { chunkSize, tileSize } = worldConfig;
        const { canvasContext } = offscreenCanvas;

        for (let ix = 0; ix < chunkSize; ix++) {
            for (let iy = 0; iy < chunkSize; iy++) {
                const tile = tiles[ix][iy];
                const x = Math.floor(tile.x * tileSize);
                const y = Math.floor(tile.y * tileSize);

                canvasContext.fillStyle = `rgb(30, ${120 + tile.height * 15}, 30)`;
                canvasContext.fillRect(x, y, tileSize, tileSize);

                if (tile.neighbors.LEFT && tile.height > tile.neighbors.LEFT.height) {
                    canvasContext.fillStyle = `rgb(20, ${120 + tile.neighbors.LEFT.height * 10}, 20)`;
                    canvasContext.fillRect(x, y, tileSize * 0.2, tileSize);
                }

                if (tile.neighbors.RIGHT && tile.height > tile.neighbors.RIGHT.height) {
                    canvasContext.fillStyle = `rgb(20, ${120 + tile.neighbors.RIGHT.height * 10}, 20)`;
                    canvasContext.fillRect(x + tileSize * 0.8, y, tileSize * 0.2, tileSize);
                }

                if (tile.neighbors.BOTTOM && tile.height > tile.neighbors.BOTTOM.height) {
                    canvasContext.fillStyle = `rgb(14, ${100 + tile.neighbors.BOTTOM.height * 10}, 14)`;
                    canvasContext.fillRect(x, y + tileSize * 0.6, tileSize, tileSize * 0.4);
                } else {
                    if (tile.neighbors.BOTTOM_LEFT && tile.height > tile.neighbors.BOTTOM_LEFT.height) {
                        canvasContext.fillStyle = `rgb(17, ${110 + tile.neighbors.BOTTOM_LEFT.height * 10}, 17)`;
                        canvasContext.fillRect(x, y + tileSize * 0.8, tileSize * 0.2, tileSize * 0.2);
                    }

                    if (tile.neighbors.BOTTOM_RIGHT && tile.height > tile.neighbors.BOTTOM_RIGHT.height) {
                        canvasContext.fillStyle = `rgb(17, ${110 + tile.neighbors.BOTTOM_RIGHT.height * 10}, 17)`;
                        canvasContext.fillRect(x + tileSize * 0.8, y + tileSize * 0.8, tileSize * 0.2, tileSize * 0.2);
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
        canvasContext.drawImage(this.offscreenCanvas.canvas, offsetX, offsetY);
    }
}
