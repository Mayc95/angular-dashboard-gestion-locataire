import { Observable } from "rxjs";
import { ListLocatairesObject, Locataire, LocataireDetails } from "../models/locataire.model";


export abstract class LocatairesService {

  abstract getLocataires(): Observable<ListLocatairesObject>;
  abstract getLocataireById(id: string): Observable<LocataireDetails>;
  abstract addLocataire(locataire: Locataire): Observable<LocataireDetails>;
  abstract updateLocataire(id:string, locataire: Locataire): Observable<LocataireDetails>;
  abstract deleteLocataireById(id: string): Observable<any>;

}
