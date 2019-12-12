import { Tile } from "../Tile";
import { Direction } from "../common/Direction";

export interface PathAgentDefinition {
    getCost(from: Tile, to: Tile, direction: Direction): number | null;
    getDistance(from: Tile, to: Tile): number;
}
