import { inject, Injectable } from "@angular/core";
import { AppartementService } from "../appartement.service";
import { Observable } from "rxjs";
import { ListAppartementDetails, AppartementDetails, Appartement } from "../../models/appartement.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";

@Injectable({
    providedIn: "root"
})
export class AppartementApiService implements AppartementService {

    readonly #APPARTEMENTS_API_URL = `${environment.apiUrl}/appartements`;
    readonly #http = inject(HttpClient);

    getListAppartement(): Observable<ListAppartementDetails> {
        return this.#http.get<ListAppartementDetails>(this.#APPARTEMENTS_API_URL);
    }
    getAppartementById(id: string): Observable<AppartementDetails> {
        return this.#http.get<AppartementDetails>(`${this.#APPARTEMENTS_API_URL}/${id}`);
    }
    addAppartement(appartement: Appartement): Observable<AppartementDetails> {
        return this.#http.post<AppartementDetails>(this.#APPARTEMENTS_API_URL, appartement);
    }
    updateAppartement(id:string, appartement: Appartement): Observable<AppartementDetails> {
         return this.#http.put<AppartementDetails>(`${this.#APPARTEMENTS_API_URL}/${id}`, appartement);
    }
    deleteAppartementById(id: string): Observable<any> {
       return this.#http.delete(`${this.#APPARTEMENTS_API_URL}/${id}`);
    }

}