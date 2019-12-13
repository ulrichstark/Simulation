import { Tile } from "../world/Tile";

export interface PathAgentDefinition {
    getCost(from: Tile, to: Tile): number | null;
    getDistance(from: Tile, to: Tile): number;
}
