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