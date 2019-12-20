export class Vector {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public static createCopy(source: Vector) {
        return new Vector(source.x, source.y);
    }

    public static createZero() {
        return new Vector(0, 0);
    }

    public change(source: Vector, factor: number) {
        this.x += source.x * factor;
        this.y += source.y * factor;
    }

    public set(source: Vector) {
        this.x = source.x;
        this.y = source.y;
    }

    public scale(factor: number) {
        this.x *= factor;
        this.y *= factor;
    }

    public makeZero() {
        this.x = 0;
        this.y = 0;
    }

    public getLengthSquared() {
        return this.x * this.x + this.y * this.y;
    }

    public getLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}
