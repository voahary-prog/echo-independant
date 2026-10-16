export interface Article {
  id: string | number;
  titre: string;
  categorie: string;
  chapeau?: string | null;
  contenu: string;
  auteur?: string | null;
  image_url?: string | null;
  created_at?: string | null;
}
