import { Observable } from "rxjs";
import { ListLocataires, Locataire } from "../models/locataire.model";


export abstract class LocatairesService {

  abstract getListLocataires(): Observable<ListLocataires>;
  abstract getLocataireById(idlocataire: string): Observable<any>;
  abstract updateLocataire(locataire:Locataire): Observable<any>;
  abstract deleteLocataireById(locataire: Locataire): Observable<any>;
  abstract addLocataire(locataire:Omit<Locataire,'id'>): Observable<any>;

}
