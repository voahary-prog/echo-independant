import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, User } from 'lucide-react';
import type { Article } from '@/types/article';
import { supabase } from '@/lib/supabase';
import { ArticleCard } from '@/components/ArticleCard';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
  onArticleClick: (article: Article) => void;
}

export function ArticleDetail({ article, onBack, onArticleClick }: ArticleDetailProps) {
  const [related, setRelated] = useState<Article[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    async function fetchRelated() {
      const { data } = await supabase
        .from('articles')
        .select('*')
        .eq('categorie', article.categorie)
        .neq('id', article.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (data) setRelated(data as Article[]);
    }
    fetchRelated();
  }, [article]);

  const formattedDate = new Date(article.created_at).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="border-b border-neutral-300 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-red-800"
          >
            <ArrowLeft size={16} /> Retour à l'accueil
          </button>
        </div>
      </div>

      <article className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <span className="text-xs font-bold uppercase tracking-widest text-red-800">
          {article.categorie}
        </span>
        <h1 className="mt-3 font-serif text-3xl font-black leading-tight text-neutral-900 sm:text-4xl md:text-5xl">
          {article.titre}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-4 border-y border-neutral-300 py-3 text-sm text-neutral-600">
          <span className="inline-flex items-center gap-1.5 font-semibold text-neutral-800">
            <User size={14} /> Par {article.auteur}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} /> {formattedDate}
          </span>
        </div>

        {article.image_url && (
          <figure className="mt-8 overflow-hidden rounded-sm">
            <img
              src={article.image_url}
              alt={article.titre}
              className="w-full object-cover"
            />
          </figure>
        )}

        <div className="mt-8 font-serif text-lg leading-relaxed text-neutral-800">
          {article.contenu.split('\n').map((para, idx) => (
            <p key={idx} className={idx === 0 ? 'first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-6xl first-letter:font-black first-letter:leading-none first-letter:text-red-800' : 'mt-4'}>
              {para}
            </p>
          ))}
        </div>
      </article>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16">
          <h2 className="mb-6 border-b-2 border-neutral-900 pb-2 font-serif text-2xl font-black text-neutral-900">
            Dans la même rubrique
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((rel) => (
              <ArticleCard key={rel.id} article={rel} onClick={() => onArticleClick(rel)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
