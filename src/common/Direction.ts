export enum Direction {
    TOP = "TOP",
    TOP_RIGHT = "TOP_RIGHT",
    RIGHT = "RIGHT",
    BOTTOM_RIGHT = "BOTTOM_RIGHT",
    BOTTOM = "BOTTOM",
    BOTTOM_LEFT = "BOTTOM_LEFT",
    LEFT = "LEFT",
    TOP_LEFT = "TOP_LEFT"
}

export const DirectionVectors: DirectionVector[] = [
    { x: 0, y: -1, direction: Direction.TOP },
    { x: 1, y: -1, direction: Direction.TOP_RIGHT },
    { x: 1, y: 0, direction: Direction.RIGHT },
    { x: 1, y: 1, direction: Direction.BOTTOM_RIGHT },
    { x: 0, y: 1, direction: Direction.BOTTOM },
    { x: -1, y: 1, direction: Direction.BOTTOM_LEFT },
    { x: -1, y: 0, direction: Direction.LEFT },
    { x: -1, y: -1, direction: Direction.TOP_LEFT }
];

export type DirectionMap<T> = Record<Direction, T>;

export interface DirectionVector {
    x: number;
    y: number;
    direction: Direction;
}
