import { Factory } from "./utils/Factory";
import { WorldConfig } from "./WorldConfig";
import { Chunk } from "./Chunk";
import { Logger } from "./common/Logger";
import { SimplexNoise } from "./common/SimplexNoise";
import { Direction, DirectionVectors } from "./common/Direction";

const logger = new Logger("World");

export class World {
    private noise: SimplexNoise;
    private width: number;
    private height: number;

    public config: WorldConfig;
    public chunks: Chunk[][];

    constructor(config: WorldConfig) {
        this.config = config;

        const { chunksX, chunksY, chunkSize, seed } = config;

        this.width = chunksX * chunkSize;
        this.height = chunksY * chunkSize;
        this.noise = new SimplexNoise(seed);

        this.chunks = Factory.createTwoDimensionalArray(chunksX, chunksY, this.createChunk.bind(this));

        logger.log(`Created with ${this.width}x${this.height} tiles!`);

        for (let cx = 0; cx < chunksX; cx++) {
            for (let cy = 0; cy < chunksY; cy++) {
                const chunk = this.chunks[cx][cy];
                const chunkX = cx * chunkSize;
                const chunkY = cy * chunkSize;

                for (let tx = 0; tx < chunkSize; tx++) {
                    for (let ty = 0; ty < chunkSize; ty++) {
                        const tile = chunk.tiles[tx][ty];
                        const tileX = chunkX + tx;
                        const tileY = chunkY + ty;

                        for (const vector of DirectionVectors) {
                            const x = tileX + vector.x;
                            const y = tileY + vector.y;

                            tile.neighbors[vector.direction] = this.getTile(x, y);
                        }
                    }
                }
            }
        }

        logger.log("Linked!");
    }

    private createChunk(x: number, y: number): Chunk {
        const { config, noise } = this;
        const { chunkSize, noiseScale } = config;

        const offsetX = x * chunkSize;
        const offsetY = y * chunkSize;

        return new Chunk(x, y, this.config, (tx, ty) => {
            const nx = (tx + offsetX) * noiseScale;
            const ny = (ty + offsetY) * noiseScale;
            const noiseValue = noise.calculate(nx, ny);
            return Math.floor(noiseValue * 10);
        });
    }

    public getTile(x: number, y: number) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
            return null;
        } else {
            const { chunkSize } = this.config;
            const chunk = this.chunks[Math.floor(x / chunkSize)][Math.floor(y / chunkSize)];
            return chunk.tiles[x % chunkSize][y % chunkSize];
        }
    }
}
