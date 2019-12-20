import { Vector } from "./Vector";

export type DirectionMap<T> = Record<DirectionKey, T>;

export class Direction extends Vector {
    public key: DirectionKey;
    public diagonal: boolean;
    public factor: number = 0;

    constructor(x: number, y: number, key: DirectionKey) {
        super(x, y);
        this.key = key;
        this.diagonal = x !== 0 && y !== 0;
    }
}

export const enum DirectionKey {
    TOP = "TOP",
    TOP_RIGHT = "TOP_RIGHT",
    RIGHT = "RIGHT",
    BOTTOM_RIGHT = "BOTTOM_RIGHT",
    BOTTOM = "BOTTOM",
    BOTTOM_LEFT = "BOTTOM_LEFT",
    LEFT = "LEFT",
    TOP_LEFT = "TOP_LEFT"
}

export const Directions: Direction[] = [
    new Direction(0, -1, DirectionKey.TOP),
    new Direction(1, -1, DirectionKey.TOP_RIGHT),
    new Direction(1, 0, DirectionKey.RIGHT),
    new Direction(1, 1, DirectionKey.BOTTOM_RIGHT),
    new Direction(0, 1, DirectionKey.BOTTOM),
    new Direction(-1, 1, DirectionKey.BOTTOM_LEFT),
    new Direction(-1, 0, DirectionKey.LEFT),
    new Direction(-1, -1, DirectionKey.TOP_LEFT)
];

export const DirectionsDirect: Direction[] = Directions.filter(direction => !direction.diagonal);

export function applyVectorToDirections(vector: Vector) {
    const { x, y } = vector;
    if (x === 0 && y === 0) {
        for (const direction of DirectionsDirect) {
            direction.factor = 0;
        }
        return false;
    } else {
        const vectorLength = Math.sqrt(x * x + y * y);
        for (const direction of DirectionsDirect) {
            const scalarProduct = direction.x * x + direction.y * y;
            const factor = 1 - Math.acos(scalarProduct / vectorLength) / Math.PI;
            direction.factor = factor * factor;
        }
        return true;
    }
}
