import type { Article } from '@/types/article';
import { ArrowUpRight, Clock, User } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
  featured?: boolean;
}

export function ArticleCard({ article, onClick, featured }: ArticleCardProps) {
  if (featured) {
    return (
      <div
        onClick={onClick}
        className="group relative cursor-pointer overflow-hidden rounded-2xl bg-neutral-900 text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {article.image_url && (
            <div className="relative min-h-[300px] overflow-hidden lg:col-span-7 lg:min-h-[450px]">
              <img
                src={article.image_url}
                alt={article.titre}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent lg:hidden" />
            </div>
          )}

          <div className="flex flex-col justify-between p-6 sm:p-10 lg:col-span-5">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-md shadow-red-600/30">
                  {article.categorie}
                </span>
                <span className="text-xs text-neutral-400">À la une</span>
              </div>

              <h2 className="text-2xl font-black leading-tight tracking-tight text-white transition-colors group-hover:text-red-400 sm:text-3xl lg:text-4xl">
                {article.titre}
              </h2>

              {article.chapo && (
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-neutral-300">
                  {article.chapo}
                </p>
              )}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-neutral-800 pt-4 text-xs text-neutral-400">
              <div className="flex items-center gap-4">
                {article.auteur && (
                  <span className="flex items-center gap-1 font-medium text-neutral-200">
                    <User size={14} className="text-red-500" />
                    {article.auteur}
                  </span>
                )}
                {article.created_at && (
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {new Date(article.created_at).toLocaleDateString('fr-FR')}
                  </span>
                )}
              </div>

              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-white transition-colors group-hover:bg-red-600">
                <ArrowUpRight size={16} />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="group flex flex-col cursor-pointer overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 transition-all duration-300 hover:border-neutral-300 hover:shadow-xl hover:-translate-y-1"
    >
      {article.image_url && (
        <div className="relative mb-4 aspect-[16/10] w-full overflow-hidden rounded-lg bg-neutral-100">
          <img
            src={article.image_url}
            alt={article.titre}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute top-3 left-3 rounded-full bg-neutral-900/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
            {article.categorie}
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold leading-snug tracking-tight text-neutral-900 transition-colors group-hover:text-red-600">
            {article.titre}
          </h3>

          {article.chapo && (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-neutral-600">
              {article.chapo}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 text-[11px] text-neutral-500">
          <span>{article.auteur || 'Rédaction'}</span>
          <span className="flex items-center gap-1 font-semibold text-red-600 group-hover:underline">
            Lire l'article <ArrowUpRight size={12} />
          </span>
        </div>
      </div>
    </div>
  );
}
