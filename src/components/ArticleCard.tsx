import { Clock } from 'lucide-react';
import type { Article } from '@/types/article';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
  variant?: 'featured' | 'default';
}

export function ArticleCard({ article, onClick, variant = 'default' }: ArticleCardProps) {
  const formattedDate = new Date(article.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  if (variant === 'featured') {
    return (
      <article
        onClick={onClick}
        className="group cursor-pointer overflow-hidden rounded-sm border-b-4 border-red-800 bg-white shadow-md transition-shadow hover:shadow-xl"
      >
        {article.image_url && (
          <div className="aspect-[16/10] overflow-hidden bg-neutral-200">
            <img
              src={article.image_url}
              alt={article.titre}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
        <div className="p-6">
          <span className="text-xs font-bold uppercase tracking-wider text-red-800">
            {article.categorie}
          </span>
          <h2 className="mt-2 font-serif text-2xl font-black leading-tight text-neutral-900 transition-colors group-hover:text-red-800 sm:text-3xl">
            {article.titre}
          </h2>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-neutral-600">
            {article.contenu}
          </p>
          <div className="mt-4 flex items-center gap-3 text-xs text-neutral-500">
            <span className="font-semibold text-neutral-700">Par {article.auteur}</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={12} /> {formattedDate}
            </span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={onClick}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-sm transition-all hover:border-red-800 hover:shadow-lg"
    >
      {article.image_url && (
        <div className="aspect-[16/10] overflow-hidden bg-neutral-200">
          <img
            src={article.image_url}
            alt={article.titre}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-bold uppercase tracking-wider text-red-800">
          {article.categorie}
        </span>
        <h3 className="mt-1.5 font-serif text-lg font-bold leading-snug text-neutral-900 transition-colors group-hover:text-red-800">
          {article.titre}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-neutral-600">
          {article.contenu}
        </p>
        <div className="mt-3 border-t border-neutral-100 pt-3 text-xs text-neutral-500">
          <span className="font-semibold text-neutral-700">{article.auteur}</span>
          <span className="mx-1.5">•</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </article>
  );
}
