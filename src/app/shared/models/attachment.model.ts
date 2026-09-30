export interface Attachment {
  id: string;
  key: string|null;
  categorie: string;
  url: string|null;
  originalFileName:string|null;
  createdAt: Date;
}