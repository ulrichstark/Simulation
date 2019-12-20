import { Vector } from "../common/Vector";
import { Tile } from "./Tile";
import { DirectionsDirect, applyVectorToDirections, Direction } from "../common/Direction";

export class TileWaterData {
    public waterLevel: number;
    public waterFlow: Vector;

    constructor(waterLevel: number) {
        this.waterLevel = waterLevel;
        this.waterFlow = Vector.createZero();
    }

    public setData(source: TileWaterData) {
        this.waterLevel = source.waterLevel;
        this.waterFlow.set(source.waterFlow);
    }

    public applyFlowToDirections() {
        applyVectorToDirections(this.waterFlow);
    }

    public pushWaterIn(waterAmount: number, direction: Direction) {
        this.waterLevel += waterAmount;
        const flowFactor = waterAmount * 0.3;
        this.waterFlow.change(direction, flowFactor);
    }

    public reflectFlow(direction: Direction) {
        if (direction.x) {
            this.waterFlow.x *= -0.9;
        }
        if (direction.y) {
            this.waterFlow.y *= -0.9;
        }
    }
}

export class TileWater extends TileWaterData {
    private tile: Tile;
    private cache: TileWaterData;

    constructor(tile: Tile, waterLevel: number) {
        super(waterLevel);
        this.tile = tile;
        this.cache = new TileWaterData(waterLevel);
    }

    public update() {
        const { tile, cache, waterLevel } = this;
        const { neighbors } = tile;

        if (waterLevel === 0) {
            return;
        }

        this.applyFlowToDirections();
        let totalFactor = 0;
        for (const direction of DirectionsDirect) {
            const neighbor = neighbors[direction.key];

            if (neighbor) {
                const heightDiff = neighbor.getTotalHeight() - tile.getTotalHeight();
                if (direction.factor < 0.1) {
                    direction.factor = 0;
                }
                if (heightDiff < 0) {
                    direction.factor -= heightDiff;
                } else {
                    if (direction.factor > 0) {
                        if (heightDiff > 0.5) {
                            cache.reflectFlow(direction);
                        }
                        direction.factor = 0;
                    }
                }
                totalFactor += direction.factor;
            } else {
                cache.reflectFlow(direction);
            }
        }

        if (totalFactor > 0) {
            const movingWater = Math.min(waterLevel, 0.05);
            for (const direction of DirectionsDirect) {
                const neighbor = neighbors[direction.key];

                if (neighbor && direction.factor > 0) {
                    const factor = direction.factor / totalFactor;
                    const waterAmount = movingWater * factor;

                    neighbor.water.cache.pushWaterIn(waterAmount, direction);
                }
            }
            cache.waterLevel -= movingWater;
        }
    }

    public applyCache() {
        this.cache.waterFlow.scale(0.99);
        this.setData(this.cache);
    }

    public addWater(amount: number) {
        this.cache.waterLevel += amount;
    }
}
