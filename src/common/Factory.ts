import { DirectionMap, DirectionKey } from "./Direction";

export class Factory {
    public static createDirectionMap<T>(defaultValue: T): DirectionMap<T> {
        return {
            [DirectionKey.TOP]: defaultValue,
            [DirectionKey.TOP_RIGHT]: defaultValue,
            [DirectionKey.RIGHT]: defaultValue,
            [DirectionKey.BOTTOM_RIGHT]: defaultValue,
            [DirectionKey.BOTTOM]: defaultValue,
            [DirectionKey.BOTTOM_LEFT]: defaultValue,
            [DirectionKey.LEFT]: defaultValue,
            [DirectionKey.TOP_LEFT]: defaultValue
        };
    }

    public static createVectorKey(x: number, y: number) {
        return `${x}_${y}`;
    }
}
