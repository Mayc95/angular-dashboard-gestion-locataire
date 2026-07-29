export interface Appartement {
  id: string;
  num:number;
  numEtage:number;
  numPorte:number;
  locataireId:string;
  nomCompletLocataire:string;
}

export interface Locataire {
  id: string;
  nom: string;
  prenoms: string;
  phone: string;
  email:string;
  picture: string;
  created: Date;
  appartementId:string;
  numeroAppartement:number;
};



export type ListLocataires = Locataire[];
export type ListAppartements = Appartement[];

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