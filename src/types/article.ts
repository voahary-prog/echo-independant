export interface Article {
  id: string | number;
  titre: string;
  categorie: string;
  contenu: string;
  auteur?: string | null;
  image_url?: string | null;
  created_at?: string | null;
}
