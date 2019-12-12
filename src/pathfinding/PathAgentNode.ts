import { Tile } from "../world/Tile";

export interface PathAgentNode {
    tile: Tile;
    parent: PathAgentNode | null;
    score: number;
}
