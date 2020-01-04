import { Chunk } from "./Chunk";
import { DirectionMap, Directions, Direction, DirectionsDirect, applyVectorToDirections } from "../common/Direction";
import { Factory } from "../common/Factory";
import { GameConfig } from "../GameConfig";
import { RandomGenerator } from "../common/RandomGenerator";
import { TileWaterPhysics } from "./TileWaterPhysics";

export type TileMountMethod = (tile: Tile) => void;

function calculateHeightCombined(tileHeight: number, waterLevel: number) {
    return tileHeight + waterLevel * 0.01;
}

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

    private _height: number;
    public get height() {
        return this._height;
    }
    public set height(value: number) {
        this._height = value;
        this.heightCombined = calculateHeightCombined(value, this._waterLevel);
    }

    private _waterLevel: number;
    public get waterLevel() {
        return this._waterLevel;
    }
    public set waterLevel(value: number) {
        this._waterLevel = value;
        this.heightCombined = calculateHeightCombined(this._height, value);
    }

    public heightCombined: number;
    public neighborsMap: DirectionMap<Tile | undefined>;
    public neighborsArray: Tile[] = [];
    public waterPhysics: TileWaterPhysics;

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
        this.key = Factory.createVectorKey(this.globalX, this.globalY);
        this.neighborsMap = Factory.createDirectionMap(undefined);
        this.waterLevel = RandomGenerator.get0N(100);
        this.waterPhysics = new TileWaterPhysics(this);

        tileMountMethod(this);
    }

    public update(deltaTime: number) {
        this.waterPhysics.update(deltaTime);
    }

    public setHeight(newHeight: number) {
        this.height = newHeight;
        const { chunk, neighborsMap } = this;

        chunk.invalidate();

        if (neighborsMap.TOP) {
            neighborsMap.TOP.chunk.invalidate();
        }
        if (neighborsMap.LEFT) {
            neighborsMap.LEFT.chunk.invalidate();
        }
        if (neighborsMap.RIGHT) {
            neighborsMap.RIGHT.chunk.invalidate();
        }
        if (neighborsMap.TOP_LEFT) {
            neighborsMap.TOP_LEFT.chunk.invalidate();
        }
        if (neighborsMap.TOP_RIGHT) {
            neighborsMap.TOP_RIGHT.chunk.invalidate();
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
}
