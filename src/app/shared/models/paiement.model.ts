
export interface PaiementDetails {
  id: string;
  idLocataire: string;
  nomLocataire: string;
  idAppartement: string,
  numAppartement:number;
  montant: string;
  mois: string;
  statut:string;
  datePaiement:Date;
  created: Date;
};

export interface Paiement {
  idLocataire: string;
  montant: string;
  mois: string;
  statut:string;
  datePaiement:Date;
}

export type ListPaiementsDetails = PaiementDetails[];

export const LIST_STATUT_PAIEMENT = [
    { value: 'EN COURS', label: 'EN COURS' },
    { value: 'VALIDER', label: 'VALIDER' },
];