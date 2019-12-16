import { RandomGenerator } from "./RandomGenerator";

export type TimerAction = () => void;

export class Timer {
    private interval: number;
    private time: number;
    private action: TimerAction;

    constructor(interval: number, action: TimerAction) {
        this.interval = interval;
        this.time = RandomGenerator.get0N(interval);
        this.action = action;
    }

    public update(deltaTime: number) {
        this.time += deltaTime;

        while (this.time >= this.interval) {
            this.time -= this.interval;
            this.action();
        }
    }
}
