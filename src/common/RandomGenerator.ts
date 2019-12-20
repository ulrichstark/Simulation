import { Directions } from "./Direction";

export class RandomGenerator {
    public static seed: number;

    public static get01() {
        const x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }

    public static get0N(n: number) {
        return Math.floor(this.get01() * n);
    }

    public static getDirection() {
        return Directions[this.get0N(Directions.length)];
    }
}
