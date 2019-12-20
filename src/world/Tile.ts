import { Chunk } from "./Chunk";
import { DirectionMap } from "../common/Direction";
import { Factory } from "../common/Factory";
import { GameConfig } from "../GameConfig";
import { RandomGenerator } from "../common/RandomGenerator";
import { TileWater } from "./TileWater";

export type TileMountMethod = (tile: Tile) => void;

export class Tile {
    public chunk: Chunk;
    public localX: number;
    public localY: number;
    public key: string;

    public localPixelX: number;
    public localPixelY: number;
    public globalX: number;
    public globalY: number;
    public globalPixelX: number;
    public globalPixelY: number;

    public height: number;
    public water: TileWater;
    public neighbors: DirectionMap<Tile | undefined>;

    constructor(localX: number, localY: number, chunk: Chunk, tileMountMethod: TileMountMethod) {
        const { pixelsInTile } = GameConfig;
        const { tileStartX, tileStartY, pixelX, pixelY } = chunk;

        this.chunk = chunk;
        this.localX = localX;
        this.localY = localY;
        this.localPixelX = localX * pixelsInTile;
        this.localPixelY = localY * pixelsInTile;
        this.globalX = tileStartX + localX;
        this.globalY = tileStartY + localY;
        this.globalPixelX = pixelX + this.localPixelX;
        this.globalPixelY = pixelY + this.localPixelY;
        this.key = Factory.createTileKey(this.globalX, this.globalY);
        this.neighbors = Factory.createDirectionMap(undefined);
        this.water = new TileWater(this, RandomGenerator.get01());

        tileMountMethod(this);
    }

    public setHeight(newHeight: number) {
        this.height = newHeight;
        const { chunk, neighbors } = this;

        chunk.invalidate();
        if (neighbors.TOP) {
            neighbors.TOP.chunk.invalidate();
        }
        if (neighbors.LEFT) {
            neighbors.LEFT.chunk.invalidate();
        }
        if (neighbors.RIGHT) {
            neighbors.RIGHT.chunk.invalidate();
        }
        if (neighbors.TOP_LEFT) {
            neighbors.TOP_LEFT.chunk.invalidate();
        }
        if (neighbors.TOP_RIGHT) {
            neighbors.TOP_RIGHT.chunk.invalidate();
        }
    }

    public isDiagonalTo(tile: Tile) {
        return this.globalX !== tile.globalX && this.globalY !== tile.globalY;
    }

    public getDistanceTo(tile: Tile) {
        const dx = this.globalX - tile.globalX;
        const dy = this.globalY - tile.globalY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    public getPositionDifferenceTo(tile: Tile) {
        const dx = this.globalX - tile.globalX;
        const dy = this.globalY - tile.globalY;
        return Math.abs(dx) + Math.abs(dy);
    }

    public getTotalHeight() {
        return this.height + this.water.waterLevel;
    }
}
