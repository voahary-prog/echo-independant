import type { Article } from '@/types/article';
import { ArrowLeft, User, Calendar, Tag } from 'lucide-react';

interface ArticleDetailProps {
  article: Article;
  relatedArticles?: Article[];
  onSelectArticle?: (article: Article) => void;
  onBack: () => void;
}

export function ArticleDetail({ article, onBack }: ArticleDetailProps) {
  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Bouton retour */}
      <button
        onClick={onBack}
        className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 transition-colors hover:text-red-600"
      >
        <ArrowLeft size={16} /> Retour aux articles
      </button>

      {/* En-tête de l'article */}
      <header className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-white shadow-md shadow-red-600/30">
            <Tag size={12} />
            {article.categorie}
          </span>
        </div>

        <h1 className="text-3xl font-black leading-tight tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
          {article.titre}
        </h1>

        {/* Chapô / Résumé (Justifié) */}
        {article.chapo && (
          <p className="mt-6 text-justify text-lg font-medium italic leading-relaxed text-neutral-600 sm:text-xl">
            {article.chapo}
          </p>
        )}

        {/* Métadonnées */}
        <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-neutral-200 py-3 text-xs text-neutral-500">
          {article.auteur && (
            <span className="flex items-center gap-1.5 font-bold text-neutral-900">
              <User size={14} className="text-red-600" />
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
        <div className="mb-10 overflow-hidden rounded-2xl bg-neutral-100 shadow-xl">
          <img
            src={article.image_url}
            alt={article.titre}
            className="max-h-[500px] w-full object-cover"
          />
        </div>
      )}

      {/* Corps de l'article avec interprétation HTML (Quill) */}
      <div
        className="article-body prose prose-neutral max-w-none text-base leading-relaxed text-neutral-800 sm:text-lg"
        dangerouslySetInnerHTML={{ __html: article.contenu }}
      />

      {/* Styles des alignements Quill */}
      <style>{`
        .article-body .ql-align-justify {
          text-align: justify;
        }
        .article-body .ql-align-center {
          text-align: center;
        }
        .article-body .ql-align-right {
          text-align: right;
        }
        .article-body p {
          margin-bottom: 1.25em;
        }
      `}</style>

      {/* Pied d'article */}
      <div className="mt-12 border-t border-neutral-200 pt-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-red-600"
        >
          <ArrowLeft size={16} /> Retour à la Une
        </button>
      </div>
    </article>
  );
}
