import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Article } from '@/types/article';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArticleCard } from '@/components/ArticleCard';
import { AdminPage } from '@/pages/AdminPage';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'admin'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setArticles((data as Article[]) ?? []);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleBackToHome = () => {
    setCurrentView('home');
    fetchArticles();
  };

  if (currentView === 'admin') {
    return (
      <AdminPage
        onBackToSite={() => {
          setCurrentView('home');
          fetchArticles();
        }}
      />
    );
  }

  // Extraire les catégories uniques depuis les articles
  const categories = Array.from(
    new Set(articles.map((a) => a.categorie).filter(Boolean))
  );

  const filteredArticles = selectedCategory
    ? articles.filter((a) => a.categorie?.toLowerCase() === selectedCategory.toLowerCase())
    : articles;

  const featuredArticle = filteredArticles[0];
  const regularArticles = filteredArticles.slice(1);

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 font-sans text-stone-900">
      <Header
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onHomeClick={handleBackToHome}
      />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-stone-500">
              <Loader2 className="mb-4 animate-spin text-red-900" size={32} />
              <p className="text-sm font-medium">Chargement des éditions…</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="py-20 text-center text-stone-500">
              <p className="font-serif text-xl">Aucun article publié pour le moment.</p>
            </div>
          ) : (
            <>
              {featuredArticle && (
                <section className="mb-12 border-b border-stone-300 pb-12">
                  <h2 className="mb-6 font-serif text-xs font-bold uppercase tracking-widest text-red-900">
                    À la Une
                  </h2>
                  <ArticleCard
                    article={featuredArticle}
                    onClick={() => {}}
                    featured
                  />
                </section>
              )}

              {regularArticles.length > 0 && (
                <section>
                  <h2 className="mb-6 font-serif text-xs font-bold uppercase tracking-widest text-stone-500">
                    Récents
                  </h2>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {regularArticles.map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        onClick={() => {}}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      <Footer
        categories={categories}
        onAdminClick={() => setCurrentView('admin')}
        onCategoryClick={(cat) => {
          setSelectedCategory(cat);
          setCurrentView('home');
        }}
      />
    </div>
  );
}
