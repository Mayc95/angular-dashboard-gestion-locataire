import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { StatsDto } from "../../models/shared.model";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class StatsApiService {
    readonly #STATS_API_URL = `${environment.apiUrl}/stats`;
    readonly #http = inject(HttpClient);

    getStats():Observable<StatsDto> {
        return this.#http.get<StatsDto>(this.#STATS_API_URL);
    }
}