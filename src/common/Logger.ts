export class Logger {
    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    public log(text: string) {
        console.log(`${this.name}: ${text}`);
    }

    public logObject(text: string, object: any) {
        console.log(`${this.name}: ${text}`, object);
    }
}
