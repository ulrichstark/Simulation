export type TimerAction = () => void;

export class Timer {
    private interval: number;
    private time: number = 0;
    private action: TimerAction;

    constructor(interval: number, action: TimerAction) {
        this.interval = interval;
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
