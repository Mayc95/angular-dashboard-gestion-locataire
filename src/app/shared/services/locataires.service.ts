import { Observable } from "rxjs";
import { Appartement, ListAppartements, ListLocataires, Locataire } from "../models/locataire.model";


export abstract class LocatairesService {

  abstract getListLocataires(): Observable<ListLocataires>;
  abstract getListAppartements(): Observable<ListAppartements>;
  abstract getLocataireById(idlocataire: string): Observable<any>;
  abstract updateLocataire(locataire:Locataire): Observable<any>;
  abstract deleteLocataireById(locataire: Locataire): Observable<any>;
  abstract addLocataire(locataire:Omit<Locataire,'id'>): Observable<any>;
  abstract addAppartement(appartement:Omit<Appartement, 'id'>): Observable<any>

}
