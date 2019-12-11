import { DirectionMap, Direction } from "../common/Direction";

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

    public static createDirectionMap<T>(defaultValue: T): DirectionMap<T> {
        return {
            [Direction.TOP]: defaultValue,
            [Direction.TOP_RIGHT]: defaultValue,
            [Direction.RIGHT]: defaultValue,
            [Direction.BOTTOM_RIGHT]: defaultValue,
            [Direction.BOTTOM]: defaultValue,
            [Direction.BOTTOM_LEFT]: defaultValue,
            [Direction.LEFT]: defaultValue,
            [Direction.TOP_LEFT]: defaultValue
        };
    }
}
