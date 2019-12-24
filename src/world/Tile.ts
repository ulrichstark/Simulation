import { Chunk } from "./Chunk";
import { DirectionMap, Directions } from "../common/Direction";
import { Factory } from "../common/Factory";
import { GameConfig } from "../GameConfig";
import { RandomGenerator } from "../common/RandomGenerator";

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

    private _height: number;
    public get height() {
        return this._height;
    }
    public set height(value: number) {
        this._height = value;
        this.heightCombined = value + this._waterLevel;
    }

    private _waterLevel: number;
    public get waterLevel() {
        return this._waterLevel;
    }
    public set waterLevel(value: number) {
        this._waterLevel = value;
        this.heightCombined = value + this._height;
    }

    public heightCombined: number;
    public waterLevelDelta: number;
    public waterFlowTarget: Tile | null;
    public waterFlowTargetNew: Tile | null;
    public neighborsMap: DirectionMap<Tile | undefined>;
    public neighborsArray: Tile[] = [];

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
        this.neighborsMap = Factory.createDirectionMap(undefined);
        this.waterLevel = RandomGenerator.get01();
        this.waterLevelDelta = 0;
        this.waterFlowTarget = null;

        tileMountMethod(this);
    }

    public update(deltaTime: number) {
        const { minimalHeightDiffForWaterFlow, waterFlowSpeed } = GameConfig;
        const { waterFlowTarget, waterLevel, heightCombined } = this;
        const minimalHeightDiff = this.waterLevel < minimalHeightDiffForWaterFlow ? -1 : minimalHeightDiffForWaterFlow;

        if (waterFlowTarget === null || heightCombined - waterFlowTarget.heightCombined < minimalHeightDiff) {
            this.waterFlowTargetNew = this.findWaterFlowTarget(minimalHeightDiff);
        } else {
            const movingWater = Math.min(waterLevel, deltaTime * waterFlowSpeed);

            waterFlowTarget.waterLevelDelta += movingWater;
            this.waterLevelDelta -= movingWater;
        }
    }

    public findWaterFlowTarget(minimalHeightDiff: number) {
        const { heightCombined, neighborsArray, height } = this;
        let lowestNeighbor = null;
        let lowestHeight = heightCombined;

        for (const neighbor of neighborsArray) {
            const { height: neighborHeight, heightCombined: neighborTotalHeight } = neighbor;

            if (neighborHeight <= height) {
                if (heightCombined - neighborTotalHeight >= minimalHeightDiff && neighborTotalHeight < lowestHeight) {
                    lowestHeight = neighborTotalHeight;
                    lowestNeighbor = neighbor;
                }

                const { waterFlowTarget } = neighbor;
                if (waterFlowTarget) {
                    const flowTargetTotalHeight = waterFlowTarget.heightCombined;

                    if (heightCombined - flowTargetTotalHeight >= minimalHeightDiff && flowTargetTotalHeight < lowestHeight) {
                        lowestHeight = flowTargetTotalHeight;
                        lowestNeighbor = neighbor;
                    }
                }
            }
        }

        return lowestNeighbor;
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

    public changeWaterLevel(amount: number) {
        this.waterLevel += amount;
    }
}
