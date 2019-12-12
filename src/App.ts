import { WorldConfig } from "./WorldConfig";
import { Game } from "./Game";

const worldConfig: WorldConfig = {
    seed: 1, // Math.random(),
    noiseScale: 0.02,
    chunksX: 6,
    chunksY: 3,
    chunkSize: 32,
    tileSize: 8
};

const game = new Game(worldConfig);
game.mount();
