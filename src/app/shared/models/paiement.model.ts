import { Attachment } from "./attachment.model";

export interface PaiementDetails {
  id: string;
  idLocataire: string;
  nomLocataire: string;
  idAppartement: string,
  libelleAppartement:string;
  montant: number;
  mois: string;
  statut:string;
  recuPaiement: Attachment;
  datePaiement:Date;
  created: Date;
};

export interface Paiement {
  idLocataire: string;
  montant: number;
  mois: string;
  datePaiement:Date;
}

export type ListPaiementsDetails = PaiementDetails[];

export const LIST_STATUT_PAIEMENT = [
    { value: 'EN COURS', label: 'EN COURS' },
    { value: 'VALIDER', label: 'VALIDER' },
];