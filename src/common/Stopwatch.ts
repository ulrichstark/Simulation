import { Logger } from "./Logger";

function getTime() {
    return Date.now();
}

export class Stopwatch {
    private logger: Logger;
    private time: number;

    constructor(processName: string) {
        this.logger = new Logger(`Stopwatch '${processName}'`);
    }

    public start() {
        this.time = getTime();
    }

    public stop() {
        const diff = getTime() - this.time;
        this.logger.log(`${diff} ms`);
    }
}
