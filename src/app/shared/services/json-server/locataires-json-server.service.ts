import { ListLocatairesObject, Locataire, LocataireDetails } from './../../models/locataire.model';
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

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
  getListLocataires(): Observable<ListLocatairesObject> {
    return this.#http.get<ListLocatairesObject>(this.#LOCATAIRES_API_URL);
  }

  getLocataireById(idlocataire: string) {
    return this.#http.get<LocataireDetails>(`${this.#LOCATAIRES_API_URL}/${idlocataire}`);
  }

  updateLocataire(locataire: LocataireDetails) {
    return this.#http.patch(`${this.#LOCATAIRES_API_URL}/${locataire.id}`, locataire);
  }

  deleteLocataireById(locataire: LocataireDetails) {
    return this.#http.delete(`${this.#LOCATAIRES_API_URL}/${locataire.id}`);
  }

  addLocataire(locataire: Locataire): Observable<any> {
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
            console.log("succes mise a jour des donnees de appartement id=" + locataire.idAppartement + " apres creation du locataire id:" + newLocataire.id);
            result = true;
          },
          error: (erreur) => {
            console.log("erreur lors de la mise a jour des donnees de appartement id=" + locataire.idAppartement + " apres creation du locataire nom:" + locataire.nom);
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
