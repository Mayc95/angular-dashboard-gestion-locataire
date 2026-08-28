import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ListPaiementsDetails, Paiement } from "../../models/paiement.model";

@Injectable({
  providedIn: "root",
})
export class PaiementsJsonServerService {

  readonly #PAIEMENTS_API_URL = 'http://localhost:3000/paiements';
  readonly #http = inject(HttpClient);

  getListPaiements() {
    return this.#http.get<ListPaiementsDetails>(this.#PAIEMENTS_API_URL);
  }

  // getPaiementById(idpaiement: string) {
  //   return this.#http.get<Paiement>(`${this.#PAIEMENTS_API_URL}/${idpaiement}`);
  // }

  deletePaiementById(idpaiement: string) {
    return this.#http.delete(`${this.#PAIEMENTS_API_URL}/${idpaiement}`);
  }

  addPaiement(paiement:Omit<Paiement,'id'>) {
    if(paiement.idLocataire.trim().length <=0) {
      throw new Error('Invalid locataireId. It must be a positive number.');
    }

    return this.#http.post(this.#PAIEMENTS_API_URL, paiement);
  }
}
