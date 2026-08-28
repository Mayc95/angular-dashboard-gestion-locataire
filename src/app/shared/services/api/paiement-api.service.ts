import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { PaiementsService } from "../paiements.service";
import { Observable } from "rxjs";
import { ListPaiementsDetails, PaiementDetails, Paiement } from "../../models/paiement.model";

@Injectable({
    providedIn:"root"
})
export class PaiementApiService implements PaiementsService {

    readonly #PAIEMENTS_API_URL = "http://localhost:8080/paiements";
    readonly #http = inject(HttpClient);

    getListPaiements(): Observable<ListPaiementsDetails> {
        return this.#http.get<ListPaiementsDetails>(this.#PAIEMENTS_API_URL);
    }
    getPaiementById(id: string): Observable<PaiementDetails> {
        return this.#http.get<PaiementDetails>(`${this.#PAIEMENTS_API_URL}/${id}`);
    }
    addPaiement(paiement: Paiement): Observable<PaiementDetails> {
        return this.#http.post<PaiementDetails>(this.#PAIEMENTS_API_URL, paiement);
    }
    updatePaiement(id: string, paiement: Paiement): Observable<PaiementDetails> {
        return this.#http.put<PaiementDetails>(`${this.#PAIEMENTS_API_URL}/${id}`, paiement);
    }
    deletePaiementById(id: string): Observable<any> {
        return this.#http.delete(`${this.#PAIEMENTS_API_URL}/${id}`);
    }
}