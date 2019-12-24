import { Factory } from "../common/Factory";
import { GameConfig } from "../GameConfig";
import { Chunk } from "./Chunk";
import { Logger } from "../common/Logger";
import { SimplexNoise } from "../common/SimplexNoise";
import { Directions } from "../common/Direction";
import { RandomGenerator } from "../common/RandomGenerator";
import { TileMountMethod, Tile } from "./Tile";

const logger = new Logger("World");

export class World {
    public chunks: Chunk[][];
    public tiles: { [key: string]: Tile } = {};

    constructor() {
        const { seed, chunksXInWorld, chunksYInWorld, tilesXInWorld, tilesYInWorld, tilesInChunk, noiseScale } = GameConfig;

        const noise = new SimplexNoise(seed);

        const tileMountMethod: TileMountMethod = (tile: Tile) => {
            const nx = tile.globalY * noiseScale;
            const ny = tile.globalX * noiseScale;
            const noiseValue = noise.calculate(nx, ny);
            tile.height = Math.floor(noiseValue * 10);
            this.tiles[tile.key] = tile;
        };

        this.chunks = Factory.createTwoDimensionalArray(chunksXInWorld, chunksYInWorld, (x, y) => new Chunk(x, y, tileMountMethod));

        logger.log(`Created with ${tilesXInWorld}x${tilesYInWorld} = ${tilesXInWorld * tilesYInWorld} tiles!`);

        for (let cx = 0; cx < chunksXInWorld; cx++) {
            for (let cy = 0; cy < chunksYInWorld; cy++) {
                const { tiles } = this.chunks[cx][cy];

                for (let tx = 0; tx < tilesInChunk; tx++) {
                    for (let ty = 0; ty < tilesInChunk; ty++) {
                        const tile = tiles[tx][ty];
                        const { globalX, globalY } = tile;

                        for (const vector of Directions) {
                            const x = globalX + vector.x;
                            const y = globalY + vector.y;

                            const neighbor = this.getTile(x, y);
                            tile.neighborsMap[vector.key] = neighbor;
                            if (neighbor) {
                                tile.neighborsArray.push(neighbor);
                            }
                        }
                    }
                }
            }
        }

        logger.logObject("Linked!", this.chunks);
    }

    public update(deltaTime: number) {
        const { tiles } = this;

        for (const key in tiles) {
            tiles[key].update(deltaTime);
        }

        for (const key in tiles) {
            const tile = tiles[key];
            if (tile.waterLevelDelta !== 0) {
                tile.waterLevel += tile.waterLevelDelta;
                tile.waterLevelDelta = 0;
            }
            tile.waterFlowTarget = tile.waterFlowTargetNew;
        }
    }

    public getTile(x: number, y: number): Tile | undefined {
        return this.tiles[Factory.createTileKey(x, y)];
    }

    public getTileRandom(): Tile {
        const { tilesXInWorld, tilesYInWorld } = GameConfig;
        const x = RandomGenerator.get0N(tilesXInWorld);
        const y = RandomGenerator.get0N(tilesYInWorld);
        return this.tiles[Factory.createTileKey(x, y)];
    }
}
