import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    #activeAsyncRequest = 0;
    readonly isLoading = signal(false);

    show() {
        this.#activeAsyncRequest++;
        this.isLoading.set(true);
    }

    hide() {
        this.#activeAsyncRequest--;
        if (this.#activeAsyncRequest <= 0) {
            this.#activeAsyncRequest = 0;
            this.isLoading.set(false);
        }
    }
}