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
        this.waterLevel = RandomGenerator.get01();
        this.waterLevelDelta = 0;
        this.waterFlowTarget = null;

        tileMountMethod(this);
    }

    public update(deltaTime: number) {
        const { minimalHeightDiffForWaterFlow, waterFlowSpeed } = GameConfig;
        const { neighbors, heightCombined, waterLevel } = this;
        const heightDiff = waterLevel < minimalHeightDiffForWaterFlow ? 0 : minimalHeightDiffForWaterFlow;

        if (this.waterFlowTarget !== null) {
            if (heightCombined - this.waterFlowTarget.heightCombined < heightDiff) {
                this.waterFlowTarget = null;
            }
        }

        if (this.waterFlowTarget === null) {
            let lowestNeighbor = null;
            let lowestHeight = heightCombined;

            for (const direction of Directions) {
                const neighbor = neighbors[direction.key];

                if (neighbor) {
                    const neighborTotalHeight = neighbor.heightCombined;

                    if (neighborTotalHeight <= heightCombined) {
                        if (heightCombined - neighborTotalHeight >= heightDiff && neighborTotalHeight < lowestHeight) {
                            lowestHeight = neighborTotalHeight;
                            lowestNeighbor = neighbor;
                        }

                        const { waterFlowTarget } = neighbor;
                        if (waterFlowTarget) {
                            const flowTargetTotalHeight = waterFlowTarget.heightCombined;

                            if (heightCombined - flowTargetTotalHeight >= heightDiff && flowTargetTotalHeight < lowestHeight) {
                                lowestHeight = flowTargetTotalHeight;
                                lowestNeighbor = neighbor;
                            }
                        }
                    }
                }
            }

            if (lowestNeighbor !== null) {
                this.waterFlowTarget = lowestNeighbor;
            }
        }

        if (this.waterFlowTarget !== null) {
            const movingWater = Math.min(waterLevel, deltaTime * waterFlowSpeed);

            this.waterFlowTarget.waterLevelDelta += movingWater;
            this.waterLevelDelta -= movingWater;
        }
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

    public changeWaterLevel(amount: number) {
        this.waterLevel += amount;
    }

    public applyWaterLevelDelta() {
        if (this.waterLevelDelta !== 0) {
            this.waterLevel += this.waterLevelDelta;
            this.waterLevelDelta = 0;
        }
    }
}
