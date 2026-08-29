export interface Locataire {
  idAppartement: string;
  nom: string;
  prenoms: string;
  phone: string;
  email:string;
};

export interface LocataireListObject {
  id: string;
  idAppartement:string;
  numAppartement:number;
  nom: string;
  prenoms: string;
  phone: string;
  email:string;
  picture: string;
  created: Date;
};

export interface LocataireDetails {
  id: string;
  idAppartement:string;
  numAppartement:number;
  paiements: any[];
  nom: string;
  prenoms: string;
  phone: string;
  email:string;
  picture: string;
  created: Date;
};

export type ListLocatairesObject = LocataireListObject[];