import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ListPaiements, Paiement } from "../../models/paiement.model";
import { PaiementsService } from "../paiements.service";

@Injectable({
  providedIn: "root",
})
export class PaiementsJsonServerService implements PaiementsService {

  readonly #PAIEMENTS_API_URL = 'http://localhost:3000/paiements';
  readonly #http = inject(HttpClient);

  getListPaiements() {
    return this.#http.get<ListPaiements>(this.#PAIEMENTS_API_URL);
  }

  getPaiementById(idpaiement: string) {
    return this.#http.get<Paiement>(`${this.#PAIEMENTS_API_URL}/${idpaiement}`);
  }

  deletePaiementById(idpaiement: string) {
    return this.#http.delete(`${this.#PAIEMENTS_API_URL}/${idpaiement}`);
  }

  addPaiement(paiement:Omit<Paiement,'id'>) {
    if(paiement.locataireId.trim().length <=0) {
      throw new Error('Invalid locataireId. It must be a positive number.');
    }

    return this.#http.post(this.#PAIEMENTS_API_URL, paiement);
  }
}
