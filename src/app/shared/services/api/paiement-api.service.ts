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
    addPaiement(paiement: Paiement, recuPaiement: File | undefined): Observable<PaiementDetails> {
        const formData = new FormData();

        formData.append('paiement',new Blob([JSON.stringify(paiement)], {type:'application/json'}));
        if(recuPaiement) {
            formData.append('recu', recuPaiement);
        }
        return this.#http.post<PaiementDetails>(this.#PAIEMENTS_API_URL, formData);
    }
    updatePaiement(id: string, paiement: Paiement): Observable<PaiementDetails> {
        return this.#http.put<PaiementDetails>(`${this.#PAIEMENTS_API_URL}/${id}`, paiement);
    }
    deletePaiementById(id: string): Observable<any> {
        return this.#http.delete(`${this.#PAIEMENTS_API_URL}/${id}`);
    }
}