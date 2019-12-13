import { WorldConfig } from "./world/WorldConfig";
import { Game } from "./Game";

const worldConfig: WorldConfig = {
    seed: Math.random(),
    noiseScale: 0.02,
    chunksX: 14,
    chunksY: 8,
    chunkSize: 32,
    tileSize: 8
};

const game = new Game(worldConfig);
game.mount();
