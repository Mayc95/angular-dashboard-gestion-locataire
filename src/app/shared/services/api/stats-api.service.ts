import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { StatsDto } from "../../models/shared.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class StatsApiService {
    readonly #STATS_API_URL = 'http://localhost:8080/stats';
    readonly #http = inject(HttpClient);

    getStats():Observable<StatsDto> {
        return this.#http.get<StatsDto>(this.#STATS_API_URL);
    }
}