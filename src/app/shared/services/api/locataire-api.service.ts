import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LocatairesService } from '../locataire.service';
import { ListLocatairesObject, LocataireDetails, Locataire } from '../../models/locataire.model';

@Injectable({
    providedIn: "root"
})
export class LocataireApiService implements LocatairesService {
    readonly #LOCATAIRES_API_URL = 'http://localhost:8080/locataires';
    readonly #http = inject(HttpClient);

    getLocataires(): Observable<ListLocatairesObject> {
        return this.#http.get<ListLocatairesObject>(this.#LOCATAIRES_API_URL);
    }

    getLocataireById(id: string): Observable<LocataireDetails> {
        return this.#http.get<LocataireDetails>(`${this.#LOCATAIRES_API_URL}/${id}`);
    }

    addLocataire(locataire: Locataire, photoProfil: File | undefined): Observable<LocataireDetails> {
        const formData = new FormData();
        formData.append(
            'locataire',
            new Blob(
                [JSON.stringify(locataire)],
                { type: 'application/json' }
            )
        );
        
        if (photoProfil) {
            formData.append('photo', photoProfil);
        }

        return this.#http.post<LocataireDetails>(this.#LOCATAIRES_API_URL, formData);
    }

    updateLocataire(id: string, locataire: Locataire): Observable<LocataireDetails> {
        return this.#http.put<LocataireDetails>(`${this.#LOCATAIRES_API_URL}/${id}`, locataire);
    }

    deleteLocataireById(id: string): Observable<any> {
        return this.#http.delete(`${this.#LOCATAIRES_API_URL}/${id}`);
    }

}