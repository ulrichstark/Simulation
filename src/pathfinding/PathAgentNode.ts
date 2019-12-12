import { Tile } from "../Tile";

export interface PathAgentNode {
    tile: Tile;
    parent: PathAgentNode | null;
    score: number;
}
