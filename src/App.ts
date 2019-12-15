import { Game } from "./Game";
import { RandomGenerator } from "./common/RandomGenerator";
import { GameConfig } from "./GameConfig";

RandomGenerator.seed = GameConfig.seed;

const game = new Game();
game.mount();
