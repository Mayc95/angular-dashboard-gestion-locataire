import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    // Compteur pour éviter le piège des requêtes simultanées
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