export interface AppartementDetails {
  id: string;
  num:number;
  idLocataire:string;
  nomLocataire:string;
  numEtage:number;
  numPorte:number;
}

export interface Appartement {
    num:number;
     numEtage:number;
  numPorte:number;
}

export type ListAppartementDetails = AppartementDetails[];
export type ListAppartement = Appartement[];

export const LIST_ETAGE = [
    {value:0, label:'REZ DE CHAUSSEE'},
    {value:1, label:'PREMIER ETAGE'},
    {value:2, label:'DEUXIEME ETAGE'},
    {value:3, label:'TROISIEME ETAGE'},
];

export const LIST_PORTE = [
    {value:1, label:'PORTE 1'},
    {value:2, label:'PORTE 2'},
    {value:3, label:'PORTE 3'}
]