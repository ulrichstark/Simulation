export type DirectionMap<T> = Record<DirectionKey, T>;

export interface Direction {
    x: number;
    y: number;
    key: DirectionKey;
    diagonal: boolean;
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
    { x: 0, y: -1, key: DirectionKey.TOP, diagonal: false },
    { x: 1, y: -1, key: DirectionKey.TOP_RIGHT, diagonal: true },
    { x: 1, y: 0, key: DirectionKey.RIGHT, diagonal: false },
    { x: 1, y: 1, key: DirectionKey.BOTTOM_RIGHT, diagonal: true },
    { x: 0, y: 1, key: DirectionKey.BOTTOM, diagonal: false },
    { x: -1, y: 1, key: DirectionKey.BOTTOM_LEFT, diagonal: true },
    { x: -1, y: 0, key: DirectionKey.LEFT, diagonal: false },
    { x: -1, y: -1, key: DirectionKey.TOP_LEFT, diagonal: true }
];
