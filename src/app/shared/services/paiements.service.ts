import { Observable } from "rxjs";
import { ListPaiements, Paiement } from "../models/paiement.model";


export abstract class PaiementsService {

  abstract getListPaiements(): Observable<ListPaiements>
  abstract getPaiementById(idpaiement: string): Observable<any>
  abstract deletePaiementById(idpaiement: string): Observable<any>
  abstract addPaiement(paiement:Omit<Paiement,'id'>): Observable<any>

}
