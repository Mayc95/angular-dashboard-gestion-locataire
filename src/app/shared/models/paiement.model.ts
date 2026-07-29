import { Locataire } from "./locataire.model";

export interface Paiement {
  id: string;
  locataireId: string;
  montant: string;
  mois: string;
  statut:string;
  datePaiement:Date;
  created: Date;
  nomCompletLocataire:string;
  numeroAppartement:number;
};
export type ListPaiements = Paiement[];

export const LIST_STATUT_PAIEMENT = [
    { value: '0', label: 'EN COURS' },
    { value: '1', label: 'VALIDER' },
];