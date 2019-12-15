import { DirectionMap, DirectionKey } from "./Direction";

export class Factory {
    public static createTwoDimensionalArray<T>(width: number, height: number, defaultValue: (x: number, y: number) => T): T[][] {
        const array = Array(width);
        for (let x = 0; x < width; x++) {
            array[x] = Array(height);
            for (let y = 0; y < height; y++) {
                array[x][y] = defaultValue(x, y);
            }
        }
        return array;
    }

    public static createDirectionMap(defaultValue: any): DirectionMap<any> {
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

    public static createTileKey(x: number, y: number) {
        return `${x}_${y}`;
    }
}
