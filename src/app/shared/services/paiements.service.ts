import { Observable } from "rxjs";
import { ListPaiementsDetails, Paiement, PaiementDetails } from "../models/paiement.model";


export abstract class PaiementsService {

  abstract getListPaiements(): Observable<ListPaiementsDetails>
  abstract getPaiementById(id: string): Observable<PaiementDetails>
  abstract addPaiement(paiement:Paiement): Observable<PaiementDetails>
  abstract updatePaiement(id: string, paiement: Paiement): Observable<PaiementDetails>
  abstract deletePaiementById(id: string): Observable<any>
}
