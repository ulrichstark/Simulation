import { Chunk } from "./Chunk";
import { DirectionMap } from "./common/Direction";

export interface Tile {
    x: number;
    y: number;
    chunk: Chunk;
    height: number;
    neighbors: DirectionMap<Tile | null>;
}
