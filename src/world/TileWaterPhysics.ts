import { Tile } from "./Tile";
import { DirectionsDirect, Directions, Direction, applyVectorToDirections } from "../common/Direction";
import { GameConfig } from "../GameConfig";

export class TileWaterPhysics {
    private tile: Tile;
    public flowX: number;
    public flowY: number;
    private _flowX: number;
    private _flowY: number;
    private _levelDelta: number;

    constructor(tile: Tile) {
        this.tile = tile;
        this.flowX = 0;
        this.flowY = 0;
        this._flowX = 0;
        this._flowY = 0;
        this._levelDelta = 0;
    }

    public flowWaterTo(targetTile: Tile, direction: Direction, waterAmount: number) {
        const { waterPhysics } = targetTile;

        this._levelDelta -= waterAmount;
        waterPhysics._levelDelta += waterAmount;

        this._flowX += Math.ceil(direction.x * waterAmount * 1);
        this._flowY += Math.ceil(direction.x * waterAmount * 1);
        waterPhysics._flowX += Math.ceil(direction.x * waterAmount * 0.5);
        waterPhysics._flowY += Math.ceil(direction.y * waterAmount * 0.5);
    }

    public update(deltaTime: number) {
        const { minimalHeightDiffForWaterFlow, waterFlowSpeed } = GameConfig;
        const { flowX, flowY, tile } = this;
        const { height, heightCombined, waterLevel, neighborsMap } = tile;

        if (waterLevel > 0) {
            let lowestDirection = null;
            let lowestHeight = heightCombined;

            for (const direction of DirectionsDirect) {
                const neighbor = neighborsMap[direction.key];

                if (neighbor && neighbor.heightCombined < lowestHeight) {
                    lowestDirection = direction;
                    lowestHeight = neighbor.heightCombined;
                }
            }

            applyVectorToDirections(flowX, flowY);
            let totalDirectionFactor = 0;

            for (const direction of DirectionsDirect) {
                const neighbor = neighborsMap[direction.key];

                if (neighbor && neighbor.heightCombined < heightCombined) {
                    totalDirectionFactor += direction.factor;
                } else {
                    direction.factor = 0;
                }
            }

            if (lowestDirection !== null) {
                const addedFactor = totalDirectionFactor === 0 ? 1 : totalDirectionFactor * 0.5;
                lowestDirection.factor += addedFactor;
                totalDirectionFactor += addedFactor;
            }

            if (totalDirectionFactor > 0) {
                const movingWater = Math.ceil(waterLevel * deltaTime * 2);
                for (const direction of DirectionsDirect) {
                    const neighbor = neighborsMap[direction.key];

                    if (neighbor && direction.factor > 0) {
                        const movingWaterThisDirection = Math.ceil(movingWater * (direction.factor / totalDirectionFactor));
                        this.flowWaterTo(neighbor, direction, movingWaterThisDirection);
                    }
                }
            }
        }
    }

    public apply() {
        if (this._levelDelta !== 0) {
            this.tile.waterLevel += this._levelDelta;
            this._levelDelta = 0;
        }
        this.flowX = this._flowX;
        this.flowY = this._flowY;
        this._flowX = 0;
        this._flowY = 0;
    }
}
