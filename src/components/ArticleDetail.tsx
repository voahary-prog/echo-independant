import type { Article } from '@/types/article';
import { ArrowLeft, User, Calendar, Tag } from 'lucide-react';

interface ArticleDetailProps {
  article: Article;
  relatedArticles: Article[];
  onSelectArticle: (article: Article) => void;
  onBack: () => void;
}

export function ArticleDetail({
  article,
  onBack,
}: ArticleDetailProps) {
  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Bouton retour */}
      <button
        onClick={onBack}
        className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-600 transition-colors hover:text-red-900"
      >
        <ArrowLeft size={16} /> Retour aux articles
      </button>

      {/* En-tête de l'article */}
      <header className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-red-900 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
            <Tag size={12} />
            {article.categorie}
          </span>
        </div>

        <h1 className="font-serif text-3xl font-black leading-tight text-stone-900 sm:text-4xl md:text-5xl">
          {article.titre}
        </h1>

        {/* Chapô */}
        {article.chapo && (
          <p className="mt-6 font-serif text-lg font-medium italic leading-relaxed text-stone-700 sm:text-xl">
            {article.chapo}
          </p>
        )}

        {/* Métadonnées */}
        <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-stone-200 py-3 text-xs text-stone-600">
          {article.auteur && (
            <span className="flex items-center gap-1.5 font-semibold text-stone-900">
              <User size={14} className="text-red-900" />
              Par {article.auteur}
            </span>
          )}
          {article.created_at && (
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(article.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          )}
        </div>
      </header>

      {/* Image principale */}
      {article.image_url && (
        <div className="mb-10 overflow-hidden bg-stone-100">
          <img
            src={article.image_url}
            alt={article.titre}
            className="max-h-[500px] w-full object-cover"
          />
        </div>
      )}

      {/* Corps de l'article */}
      <div className="prose prose-stone max-w-none font-serif text-lg leading-relaxed text-stone-800 whitespace-pre-line">
        {article.contenu}
      </div>

      {/* Pied d'article */}
      <div className="mt-12 border-t border-stone-300 pt-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 bg-stone-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-red-900"
        >
          <ArrowLeft size={16} /> Retour à la Une
        </button>
      </div>
    </article>
  );
}
