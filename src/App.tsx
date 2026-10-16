import { useEffect, useState, useCallback } from 'react';
import { Loader2, Newspaper } from 'lucide-react';
import type { Article } from '@/types/article';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArticleCard } from '@/components/ArticleCard';
import { ArticleDetail } from '@/pages/ArticleDetail';
import { AdminPage } from '@/pages/AdminPage';

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  const categories = Array.from(
    new Set(articles.map((a) => a.categorie).filter(Boolean))
  ).sort();

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase.from('articles').select('*').order('created_at', { ascending: false });

    if (activeCategory) {
      query = query.eq('categorie', activeCategory);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setArticles((data as Article[]) ?? []);
    }
    setLoading(false);
  }, [activeCategory]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleLogoClick = () => {
    setSelectedArticle(null);
    setActiveCategory(null);
    setShowAdmin(false);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedArticle(null);
    setShowAdmin(false);
    setActiveCategory(category || null);
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
  };

  const handleBack = () => {
    setSelectedArticle(null);
  };

  const handleAdminClick = () => {
    setShowAdmin(true);
    setSelectedArticle(null);
  };

  // Admin page
  if (showAdmin) {
    return <AdminPage onBackToSite={() => setShowAdmin(false)} />;
  }

  // Article detail page
  if (selectedArticle) {
    return (
      <>
        <ArticleDetail
          article={selectedArticle}
          onBack={handleBack}
          onArticleClick={handleArticleClick}
        />
        <Footer onAdminClick={handleAdminClick} />
      </>
    );
  }

  const featuredArticle = articles[0];
  const restArticles = articles.slice(1);

  return (
    <>
      <Header
        onLogoClick={handleLogoClick}
        onCategoryClick={handleCategoryClick}
        activeCategory={activeCategory}
        categories={categories}
      />

      <main className="bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Section title */}
          <div className="mb-6 flex items-center justify-between border-b-2 border-neutral-900 pb-3">
            <h2 className="font-serif text-2xl font-black text-neutral-900">
              {activeCategory ? activeCategory : 'À la Une'}
            </h2>
            <span className="text-xs uppercase tracking-wider text-neutral-500">
              {articles.length} article{articles.length > 1 ? 's' : ''}
            </span>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 text-neutral-500">
              <Loader2 className="mb-3 animate-spin" size={32} />
              <p className="text-sm">Chargement des articles…</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="border-l-4 border-red-800 bg-red-50 px-6 py-4">
              <p className="font-semibold text-red-900">Erreur de chargement</p>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && articles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-neutral-400">
              <Newspaper className="mb-3" size={40} />
              <p className="text-sm">Aucun article à afficher pour le moment.</p>
            </div>
          )}

          {/* Featured article + grid */}
          {!loading && !error && articles.length > 0 && (
            <>
              {featuredArticle && !activeCategory && (
                <div className="mb-10">
                  <ArticleCard article={featuredArticle} onClick={() => handleArticleClick(featuredArticle)} variant="featured" />
                </div>
              )}

              {restArticles.length > 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {(activeCategory ? articles : restArticles).map((article) => (
                    <ArticleCard key={article.id} article={article} onClick={() => handleArticleClick(article)} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer onAdminClick={handleAdminClick} />
    </>
  );
}
