import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ListLocataires, Locataire } from "../../models/locataire.model";
import { LocatairesService } from "../locataires.service";

@Injectable({
  providedIn: "root",
})
export class LocatairesJsonServerService {
  
  readonly #LOCATAIRES_API_URL = 'http://localhost:3000/locataires';
  readonly #APPARTEMENTS_API_URL = 'http://localhost:3000/appartements';
  readonly #http = inject(HttpClient);

  updateAppartement(appartement: any) {
    return this.#http.put(`${this.#APPARTEMENTS_API_URL}/${appartement.id}`, appartement);
  }
  getListLocataires(): Observable<ListLocataires> {
    return this.#http.get<ListLocataires>(this.#LOCATAIRES_API_URL);
  }

  getLocataireById(idlocataire: string) {
    return this.#http.get<Locataire>(`${this.#LOCATAIRES_API_URL}/${idlocataire}`);
  }

  updateLocataire(locataire: Locataire) {
    return this.#http.patch(`${this.#LOCATAIRES_API_URL}/${locataire.id}`, locataire);
  }

  deleteLocataireById(locataire: Locataire) {
    return this.#http.delete(`${this.#LOCATAIRES_API_URL}/${locataire.id}`);
  }

  addLocataire(locataire: Omit<Locataire, 'id'>): Observable<any> {
    locataire.picture = "/images/user/user-17.jpg";
    let result = false;
    this.#http.post(this.#LOCATAIRES_API_URL, locataire).subscribe({
      next: (response) => {
        let newLocataire: any = response;
        let newAppartementData = {
          id: newLocataire.appartementId,
          locataireId: newLocataire.id,
          nomCompletLocataire: newLocataire.nom + " " + newLocataire.prenoms
        }
        this.updateAppartement(newAppartementData).subscribe({
          next: () => {
            console.log("succes mise a jour des donnees de appartement id=" + locataire.appartementId + " apres creation du locataire id:" + newLocataire.id);
            result = true;
          },
          error: (erreur) => {
            console.log("erreur lors de la mise a jour des donnees de appartement id=" + locataire.appartementId + " apres creation du locataire nom:" + locataire.nom);
            console.log(erreur);
          }
        })
      },
      error: (erreur) => {
        console.log("erreur lors de la creation du locataire nom:" + locataire.nom);
        console.log(erreur);
      }
    });

    return of(result);
  }

}
