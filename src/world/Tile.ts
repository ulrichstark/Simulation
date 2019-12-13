import { Chunk } from "./Chunk";
import { DirectionMap } from "../common/Direction";

export interface Tile {
    x: number;
    y: number;
    localPixelX: number;
    localPixelY: number;
    globalX: number;
    globalY: number;
    key: string;
    chunk: Chunk;
    height: number;
    neighbors: DirectionMap<Tile | null>;
}
