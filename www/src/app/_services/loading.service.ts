import {Injectable} from "@angular/core";

@Injectable()
export class LoadingService {

    public count = 0;

    constructor() { }

    start(): void {
        this.count++;
    }

    stop(): void {
        this.count--;
    }


}
