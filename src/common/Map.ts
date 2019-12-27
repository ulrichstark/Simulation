import { Factory } from "./Factory";
import { RandomGenerator } from "./RandomGenerator";

export class Map<T> {
    public map: { [key: string]: T } = {};
    public array: T[] = [];

    constructor(width: number, height: number, defaultValue: (x: number, y: number) => T) {
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const key = Factory.createVectorKey(x, y);
                const value = defaultValue(x, y);
                this.map[key] = value;
                this.array.push(value);
            }
        }
    }

    public get(x: number, y: number): T {
        return this.map[Factory.createVectorKey(x, y)];
    }

    public getRandom(): T {
        return this.array[RandomGenerator.get0N(this.array.length)];
    }
}
