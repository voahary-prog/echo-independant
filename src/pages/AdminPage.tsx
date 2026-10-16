import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Lock,
  LogOut,
  Trash2,
  Send,
  Loader2,
  Plus,
  LayoutDashboard,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Pencil,
  Upload,
  X,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import type { Article } from '@/types/article';
import { supabase } from '@/lib/supabase';

const ADMIN_PASSWORD = 'redaction2026';
const AUTH_KEY = 'echo_admin_auth';
const THEME_KEY = 'echo_admin_theme';
const BUCKET_NAME = 'articles';

interface AdminPageProps {
  onBackToSite: () => void;
}

const EMPTY_FORM = {
  titre: '',
  categorie: '',
  chapo: '',
  auteur: '',
  image_url: '',
  contenu: '',
};

export function AdminPage({ onBackToSite }: AdminPageProps) {
  const [authed, setAuthed] = useState<boolean>(
    () => sessionStorage.getItem(AUTH_KEY) === '1'
  );
  const [theme, setTheme] = useState<'dark' | 'light'>(
    () => (localStorage.getItem(THEME_KEY) as 'dark' | 'light') || 'dark'
  );
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, '1');
      setAuthed(true);
      setLoginError(false);
      setPassword('');
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  };

  const isDark = theme === 'dark';

  if (!authed) {
    return (
      <div
        className={`flex min-h-screen flex-col items-center justify-center p-4 transition-colors duration-300 font-sans ${
          isDark ? 'bg-neutral-950 text-white' : 'bg-stone-100 text-stone-900'
        }`}
      >
        {/* Toggle Thème sur l'écran de connexion */}
        <div className="absolute top-4 right-4">
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all ${
              isDark
                ? 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white'
                : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
            }`}
          >
            {isDark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-stone-700" />}
            <span>{isDark ? 'Mode Clair' : 'Mode Sombre'}</span>
          </button>
        </div>

        <div
          className={`w-full max-w-sm rounded-2xl border p-8 shadow-2xl backdrop-blur-xl transition-all ${
            isDark
              ? 'border-neutral-800 bg-neutral-900/90'
              : 'border-stone-200 bg-white'
          }`}
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/30">
              <Lock size={22} />
            </div>
            <h1 className="text-xl font-black tracking-tight">ESPACE RÉDACTION</h1>
            <p className={`mt-1 text-xs ${isDark ? 'text-neutral-400' : 'text-stone-500'}`}>
              L'Écho Indépendant — Administration
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                className={`mb-1.5 block text-[11px] font-bold uppercase tracking-wider ${
                  isDark ? 'text-neutral-400' : 'text-stone-600'
                }`}
              >
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLoginError(false);
                }}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
                  isDark
                    ? 'border-neutral-800 bg-neutral-950 text-white placeholder-neutral-600 focus:border-red-600'
                    : 'border-stone-300 bg-stone-50 text-stone-900 placeholder-stone-400 focus:border-red-600'
                }`}
                placeholder="••••••••••••"
                autoFocus
              />
              {loginError && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-red-500">
                  <AlertCircle size={14} /> Mot de passe incorrect.
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-red-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-red-600/30 transition-all hover:bg-red-500"
            >
              Se connecter
            </button>
          </form>

          <button
            onClick={onBackToSite}
            className={`mt-6 block w-full text-center text-xs font-semibold transition-colors ${
              isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            ← Retour au site
          </button>
        </div>
      </div>
    );
  }

  return (
    <Dashboard
      theme={theme}
      onToggleTheme={toggleTheme}
      onLogout={handleLogout}
      onBackToSite={onBackToSite}
    />
  );
}

function Dashboard({
  theme,
  onToggleTheme,
  onLogout,
  onBackToSite,
}: {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onLogout: () => void;
  onBackToSite: () => void;
}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDark = theme === 'dark';

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, fetchError } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setArticles((data as Article[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleDelete = async (id: string | number) => {
    if (!confirm('Supprimer cet article définitivement ?')) return;

    const { error: deleteError } = await supabase.from('articles').delete().eq('id', id);

    if (deleteError) {
      alert('Erreur lors de la suppression : ' + deleteError.message);
      return;
    }
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setForm({
      titre: article.titre ?? '',
      categorie: article.categorie ?? '',
      chapo: article.chapo ?? '',
      auteur: article.auteur ?? '',
      image_url: article.image_url ?? '',
      contenu: article.contenu ?? '',
    });
    setSubmitStatus('idle');
    setSubmitMessage('');
    setUploadError(null);
    setView('form');
  };

  const handleCreate = () => {
    setEditingArticle(null);
    setForm(EMPTY_FORM);
    setSubmitStatus('idle');
    setSubmitMessage('');
    setUploadError(null);
    setView('form');
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadErr } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadErr) {
        const dataUrl = await fileToBase64(file);
        setForm((prev) => ({ ...prev, image_url: dataUrl }));
      } else {
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(fileName);

        setForm((prev) => ({ ...prev, image_url: urlData.publicUrl }));
      }
    } catch {
      const dataUrl = await fileToBase64(file);
      setForm((prev) => ({ ...prev, image_url: dataUrl }));
    }
    setUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');
    setSubmitMessage('');

    const payload = {
      titre: form.titre,
      categorie: form.categorie.toUpperCase(),
      chapo: form.chapo,
      auteur: form.auteur,
      image_url: form.image_url,
      contenu: form.contenu,
    };

    if (editingArticle) {
      const { error: updateError } = await supabase
        .from('articles')
        .update(payload)
        .eq('id', editingArticle.id);

      if (updateError) {
        setSubmitStatus('error');
        setSubmitMessage(updateError.message);
        return;
      }
      setSubmitStatus('success');
      setSubmitMessage('Article mis à jour avec succès !');
    } else {
      const { error: insertError } = await supabase
        .from('articles')
        .insert([payload]);

      if (insertError) {
        setSubmitStatus('error');
        setSubmitMessage(insertError.message);
        return;
      }
      setSubmitStatus('success');
      setSubmitMessage('Article publié avec succès !');
    }

    setForm(EMPTY_FORM);
    setEditingArticle(null);
    fetchArticles();

    setTimeout(() => {
      setView('list');
      setSubmitStatus('idle');
    }, 1200);
  };

  const inputClass = isDark
    ? 'w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none transition-all focus:border-red-600 focus:ring-1 focus:ring-red-600'
    : 'w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all focus:border-red-600 focus:ring-1 focus:ring-red-600';

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${
        isDark ? 'bg-neutral-950 text-neutral-100' : 'bg-stone-100 text-stone-900'
      }`}
    >
      {/* Header Back-office */}
      <div
        className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors ${
          isDark
            ? 'border-neutral-800 bg-neutral-900/90'
            : 'border-stone-200 bg-white/90'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-sm font-black text-white">
              É
            </span>
            <span className="font-bold tracking-tight">
              L'ÉCHO <span className="text-red-600">INDÉPENDANT</span>
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                isDark
                  ? 'bg-red-950/80 text-red-400 border-red-800/50'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              Rédaction
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Bouton de changement de thème */}
            <button
              type="button"
              onClick={onToggleTheme}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                isDark
                  ? 'border-neutral-800 bg-neutral-800/80 text-neutral-300 hover:text-white'
                  : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {isDark ? (
                <>
                  <Sun size={14} className="text-amber-400" />
                  <span>Clair</span>
                </>
              ) : (
                <>
                  <Moon size={14} className="text-stone-700" />
                  <span>Sombre</span>
                </>
              )}
            </button>

            <button
              onClick={onBackToSite}
              className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                isDark ? 'text-neutral-400 hover:text-white' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ExternalLink size={14} /> Voir le site
            </button>

            <button
              onClick={onLogout}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                isDark
                  ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'
                  : 'bg-stone-200 text-stone-800 hover:bg-stone-300'
              }`}
            >
              <LogOut size={14} /> Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Barre d'onglets */}
      <div
        className={`border-b ${
          isDark ? 'border-neutral-800 bg-neutral-900/50' : 'border-stone-200 bg-white'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
          <div className="flex gap-2">
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-2 border-b-2 px-5 py-3.5 text-xs font-bold transition-all ${
                view === 'list'
                  ? 'border-red-600 text-red-600'
                  : isDark
                  ? 'border-transparent text-neutral-400 hover:text-white'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              <LayoutDashboard size={16} /> TABLEAU DE BORD
            </button>
            <button
              onClick={handleCreate}
              className={`flex items-center gap-2 border-b-2 px-5 py-3.5 text-xs font-bold transition-all ${
                view === 'form' && !editingArticle
                  ? 'border-red-600 text-red-600'
                  : isDark
                  ? 'border-transparent text-neutral-400 hover:text-white'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              <Plus size={16} /> NOUVEL ARTICLE
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* LIST VIEW */}
        {view === 'list' && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">ARTICLES PUBLIÉS</h2>
                <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-stone-500'}`}>
                  Gérez le contenu en direct de votre journal
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  isDark ? 'bg-neutral-800 text-neutral-300' : 'bg-stone-200 text-stone-700'
                }`}
              >
                {articles.length} article{articles.length > 1 ? 's' : ''}
              </span>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-20 text-stone-500">
                <Loader2 className="mb-3 animate-spin text-red-600" size={30} />
                <p className="text-xs font-medium">Chargement des articles…</p>
              </div>
            )}

            {!loading && articles.length === 0 && (
              <div
                className={`rounded-2xl border border-dashed py-20 text-center text-xs ${
                  isDark
                    ? 'border-neutral-800 text-neutral-500'
                    : 'border-stone-300 text-stone-500'
                }`}
              >
                <p>Aucun article publié. Cliquez sur « NOUVEL ARTICLE » pour commencer.</p>
              </div>
            )}

            {!loading && articles.length > 0 && (
              <div
                className={`overflow-hidden rounded-2xl border shadow-xl transition-all ${
                  isDark
                    ? 'border-neutral-800 bg-neutral-900/60'
                    : 'border-stone-200 bg-white'
                }`}
              >
                <table className="w-full text-left text-sm">
                  <thead
                    className={`border-b text-[11px] uppercase tracking-wider ${
                      isDark
                        ? 'border-neutral-800 bg-neutral-900 text-neutral-400'
                        : 'border-stone-200 bg-stone-50 text-stone-500'
                    }`}
                  >
                    <tr>
                      <th className="px-5 py-4">Titre</th>
                      <th className="hidden px-5 py-4 md:table-cell">Rubrique</th>
                      <th className="hidden px-5 py-4 lg:table-cell">Auteur</th>
                      <th className="hidden px-5 py-4 lg:table-cell">Date</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-neutral-800/60' : 'divide-stone-100'}`}>
                    {articles.map((article) => (
                      <tr
                        key={article.id}
                        className={`transition-colors ${
                          isDark ? 'hover:bg-neutral-800/40' : 'hover:bg-stone-50'
                        }`}
                      >
                        <td className="max-w-xs truncate px-5 py-4 font-semibold">
                          {article.titre}
                        </td>
                        <td className="hidden px-5 py-4 md:table-cell">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                              isDark
                                ? 'bg-red-950/80 text-red-400 border-red-800/40'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}
                          >
                            {article.categorie}
                          </span>
                        </td>
                        <td className={`hidden px-5 py-4 text-xs lg:table-cell ${isDark ? 'text-neutral-400' : 'text-stone-500'}`}>
                          {article.auteur || '—'}
                        </td>
                        <td className={`hidden px-5 py-4 text-xs lg:table-cell ${isDark ? 'text-neutral-500' : 'text-stone-400'}`}>
                          {article.created_at ? new Date(article.created_at).toLocaleDateString('fr-FR') : '—'}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(article)}
                              className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                                isDark
                                  ? 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:text-white'
                                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900'
                              }`}
                            >
                              <Pencil size={13} /> Éditer
                            </button>
                            <button
                              onClick={() => handleDelete(article.id)}
                              className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                                isDark
                                  ? 'bg-red-950/50 text-red-400 hover:bg-red-900/80 hover:text-white'
                                  : 'bg-red-50 text-red-700 hover:bg-red-600 hover:text-white'
                              }`}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* FORM VIEW (EDITION & CREATION) */}
        {view === 'form' && (
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black">
                {editingArticle ? "MODIFIER L'ARTICLE" : 'RÉDIGER UN ARTICLE'}
              </h2>
            </div>

            {submitStatus === 'success' && (
              <div className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-950/80 border border-emerald-800 p-4 text-xs font-bold text-emerald-300">
                <CheckCircle2 size={18} /> {submitMessage}
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-950/80 border border-red-800 p-4 text-xs font-bold text-red-300">
                <AlertCircle size={18} /> {submitMessage}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className={`space-y-6 rounded-2xl border p-6 shadow-2xl sm:p-8 transition-colors ${
                isDark ? 'border-neutral-800 bg-neutral-900' : 'border-stone-200 bg-white'
              }`}
            >
              {/* Titre */}
              <div>
                <label
                  className={`mb-2 block text-[11px] font-bold uppercase tracking-wider ${
                    isDark ? 'text-neutral-400' : 'text-stone-600'
                  }`}
                >
                  Titre de l'article
                </label>
                <input
                  type="text"
                  required
                  value={form.titre}
                  onChange={(e) => setForm({ ...form, titre: e.target.value })}
                  className={inputClass}
                  placeholder="ex: Titre percutant de votre actualité…"
                />
              </div>

              {/* Rubrique + Auteur */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    className={`mb-2 block text-[11px] font-bold uppercase tracking-wider ${
                      isDark ? 'text-neutral-400' : 'text-stone-600'
                    }`}
                  >
                    Rubrique
                  </label>
                  <input
                    type="text"
                    required
                    value={form.categorie}
                    onChange={(e) => setForm({ ...form, categorie: e.target.value })}
                    className={inputClass}
                    placeholder="POLITIQUE, ÉCONOMIE, CULTURE…"
                  />
                </div>
                <div>
                  <label
                    className={`mb-2 block text-[11px] font-bold uppercase tracking-wider ${
                      isDark ? 'text-neutral-400' : 'text-stone-600'
                    }`}
                  >
                    Auteur / Journaliste
                  </label>
                  <input
                    type="text"
                    required
                    value={form.auteur}
                    onChange={(e) => setForm({ ...form, auteur: e.target.value })}
                    className={inputClass}
                    placeholder="Nom du journaliste"
                  />
                </div>
              </div>

              {/* Image de l'article */}
              <div>
                <label
                  className={`mb-2 block text-[11px] font-bold uppercase tracking-wider ${
                    isDark ? 'text-neutral-400' : 'text-stone-600'
                  }`}
                >
                  Image d'illustration
                </label>

                <div className="mb-3">
                  <label
                    className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                      isDark
                        ? 'border-neutral-800 bg-neutral-950/50 hover:border-red-600 hover:bg-red-950/10'
                        : 'border-stone-300 bg-stone-50 hover:border-red-600 hover:bg-red-50/50'
                    }`}
                  >
                    {uploading ? (
                      <>
                        <Loader2 size={24} className="animate-spin text-red-600" />
                        <span className="text-xs text-neutral-400">Téléversement en cours…</span>
                      </>
                    ) : (
                      <>
                        <Upload size={24} className={isDark ? 'text-neutral-500' : 'text-stone-400'} />
                        <span className={`text-xs font-semibold ${isDark ? 'text-neutral-300' : 'text-stone-700'}`}>
                          Cliquez pour importer une image depuis votre ordinateur
                        </span>
                        <span className="text-[10px] text-neutral-500">PNG, JPG, WebP — max 5 Mo</span>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="relative my-3">
                  <input
                    type="url"
                    value={form.image_url.startsWith('data:') ? '' : form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    className={inputClass}
                    placeholder="Ou collez l'URL d'une image (https://…)"
                  />
                </div>

                {form.image_url && (
                  <div
                    className={`relative mt-3 overflow-hidden rounded-xl border ${
                      isDark ? 'border-neutral-800' : 'border-stone-200'
                    }`}
                  >
                    <img
                      src={form.image_url}
                      alt="Aperçu"
                      className="max-h-52 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, image_url: '' }))}
                      className="absolute right-3 top-3 rounded-lg bg-black/80 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-md hover:bg-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Chapô */}
              <div>
                <label
                  className={`mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider ${
                    isDark ? 'text-neutral-400' : 'text-stone-600'
                  }`}
                >
                  <span>Chapô (Résumé / Accroche)</span>
                  <span className="flex items-center gap-1 text-[10px] text-red-500">
                    <Sparkles size={12} /> Essentiel pour la Une
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={form.chapo}
                  onChange={(e) => setForm({ ...form, chapo: e.target.value })}
                  className={`${inputClass} resize-y italic`}
                  placeholder="Résumé percutant qui introduit le corps de votre article…"
                />
              </div>

              {/* Contenu */}
              <div>
                <label
                  className={`mb-2 block text-[11px] font-bold uppercase tracking-wider ${
                    isDark ? 'text-neutral-400' : 'text-stone-600'
                  }`}
                >
                  Corps de l'article
                </label>
                <textarea
                  required
                  rows={10}
                  value={form.contenu}
                  onChange={(e) => setForm({ ...form, contenu: e.target.value })}
                  className={`${inputClass} resize-y leading-relaxed`}
                  placeholder="Développez votre article ici…"
                />
              </div>

              {/* Actions */}
              <div
                className={`flex items-center justify-end gap-3 border-t pt-6 ${
                  isDark ? 'border-neutral-800' : 'border-stone-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className={`rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                    isDark
                      ? 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitStatus === 'loading'}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-red-600/30 transition-all hover:bg-red-500 disabled:opacity-50"
                >
                  {submitStatus === 'loading' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Publication…
                    </>
                  ) : (
                    <>
                      <Send size={16} /> {editingArticle ? 'Mettre à jour' : 'Publier en direct'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Lock,
  LogOut,
  Trash2,
  Send,
  Loader2,
  Plus,
  LayoutDashboard,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Pencil,
  Upload,
  X,
  ImageIcon,
  Sparkles,
} from 'lucide-react';
import type { Article } from '@/types/article';
import { supabase } from '@/lib/supabase';

const ADMIN_PASSWORD = 'redaction2026';
const STORAGE_KEY = 'echo_admin_auth';
const BUCKET_NAME = 'articles';

interface AdminPageProps {
  onBackToSite: () => void;
}

const EMPTY_FORM = {
  titre: '',
  categorie: '',
  chapo: '',
  auteur: '',
  image_url: '',
  contenu: '',
};

export function AdminPage({ onBackToSite }: AdminPageProps) {
  const [authed, setAuthed] = useState<boolean>(
    () => sessionStorage.getItem(STORAGE_KEY) === '1'
  );
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, '1');
      setAuthed(true);
      setLoginError(false);
      setPassword('');
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 font-sans text-white">
        <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900/90 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/30">
              <Lock size={22} />
            </div>
            <h1 className="text-xl font-black tracking-tight text-white">ESPACE RÉDACTION</h1>
            <p className="mt-1 text-xs text-neutral-400">L'Écho Indépendant — Administration</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLoginError(false);
                }}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none transition-colors focus:border-red-600 focus:ring-1 focus:ring-red-600"
                placeholder="••••••••••••"
                autoFocus
              />
              {loginError && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
                  <AlertCircle size={14} /> Mot de passe incorrect.
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-red-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-red-600/30 transition-all hover:bg-red-500 hover:shadow-red-600/50"
            >
              Se connecter
            </button>
          </form>

          <button
            onClick={onBackToSite}
            className="mt-6 block w-full text-center text-xs font-semibold text-neutral-500 transition-colors hover:text-neutral-300"
          >
            ← Retour au site
          </button>
        </div>
      </div>
    );
  }

  return <Dashboard onLogout={handleLogout} onBackToSite={onBackToSite} />;
}

function Dashboard({
  onLogout,
  onBackToSite,
}: {
  onLogout: () => void;
  onBackToSite: () => void;
}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, fetchError } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setArticles((data as Article[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleDelete = async (id: string | number) => {
    if (!confirm('Supprimer cet article définitivement ?')) return;

    const { error: deleteError } = await supabase.from('articles').delete().eq('id', id);

    if (deleteError) {
      alert('Erreur lors de la suppression : ' + deleteError.message);
      return;
    }
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setForm({
      titre: article.titre ?? '',
      categorie: article.categorie ?? '',
      chapo: article.chapo ?? '',
      auteur: article.auteur ?? '',
      image_url: article.image_url ?? '',
      contenu: article.contenu ?? '',
    });
    setSubmitStatus('idle');
    setSubmitMessage('');
    setUploadError(null);
    setView('form');
  };

  const handleCreate = () => {
    setEditingArticle(null);
    setForm(EMPTY_FORM);
    setSubmitStatus('idle');
    setSubmitMessage('');
    setUploadError(null);
    setView('form');
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        const dataUrl = await fileToBase64(file);
        setForm((prev) => ({ ...prev, image_url: dataUrl }));
      } else {
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(fileName);

        setForm((prev) => ({ ...prev, image_url: urlData.publicUrl }));
      }
    } catch {
      const dataUrl = await fileToBase64(file);
      setForm((prev) => ({ ...prev, image_url: dataUrl }));
    }
    setUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');
    setSubmitMessage('');

    const payload = {
      titre: form.titre,
      categorie: form.categorie.toUpperCase(),
      chapo: form.chapo,
      auteur: form.auteur,
      image_url: form.image_url,
      contenu: form.contenu,
    };

    if (editingArticle) {
      const { error: updateError } = await supabase
        .from('articles')
        .update(payload)
        .eq('id', editingArticle.id);

      if (updateError) {
        setSubmitStatus('error');
        setSubmitMessage(updateError.message);
        return;
      }
      setSubmitStatus('success');
      setSubmitMessage('Article mis à jour avec succès !');
    } else {
      const { error: insertError } = await supabase
        .from('articles')
        .insert([payload]);

      if (insertError) {
        setSubmitStatus('error');
        setSubmitMessage(insertError.message);
        return;
      }
      setSubmitStatus('success');
      setSubmitMessage('Article publié avec succès !');
    }

    setForm(EMPTY_FORM);
    setEditingArticle(null);
    fetchArticles();

    setTimeout(() => {
      setView('list');
      setSubmitStatus('idle');
    }, 1200);
  };

  const inputClass =
    'w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-all focus:border-red-600 focus:ring-2 focus:ring-red-600/20';

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-neutral-100">
      {/* Top Header Back-office */}
      <div className="sticky top-0 z-30 border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-sm font-black text-white">
              É
            </span>
            <span className="font-bold tracking-tight text-white">
              L'ÉCHO <span className="text-red-500">INDÉPENDANT</span>
            </span>
            <span className="rounded-full bg-red-950/80 px-2.5 py-0.5 text-[10px] font-bold text-red-400 border border-red-800/50">
              Studio Rédaction
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onBackToSite}
              className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 transition-colors hover:text-white"
            >
              <ExternalLink size={14} /> Voir le site
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 rounded-lg bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-white"
            >
              <LogOut size={14} /> Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Barre d'actions & Onglets */}
      <div className="border-b border-neutral-800 bg-neutral-900/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
          <div className="flex gap-2">
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-2 border-b-2 px-5 py-3.5 text-xs font-bold transition-all ${
                view === 'list'
                  ? 'border-red-500 text-red-500'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <LayoutDashboard size={16} /> TABLEAU DE BORD
            </button>
            <button
              onClick={handleCreate}
              className={`flex items-center gap-2 border-b-2 px-5 py-3.5 text-xs font-bold transition-all ${
                view === 'form' && !editingArticle
                  ? 'border-red-500 text-red-500'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Plus size={16} /> NOUVEL ARTICLE
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* LIST VIEW */}
        {view === 'list' && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">ARTICLES PUBLIÉS</h2>
                <p className="text-xs text-neutral-400">Gérez le contenu en direct de votre journal</p>
              </div>
              <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-bold text-neutral-300">
                {articles.length} article{articles.length > 1 ? 's' : ''}
              </span>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
                <Loader2 className="mb-3 animate-spin text-red-500" size={30} />
                <p className="text-xs font-medium">Chargement des articles…</p>
              </div>
            )}

            {!loading && articles.length === 0 && (
              <div className="rounded-2xl border border-dashed border-neutral-800 py-20 text-center text-neutral-500">
                <p className="text-sm">Aucun article publié. Cliquez sur « Nouvel article » pour rédiger.</p>
              </div>
            )}

            {!loading && articles.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-md shadow-xl">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-neutral-800 bg-neutral-900 text-[11px] uppercase tracking-wider text-neutral-400">
                    <tr>
                      <th className="px-5 py-4">Titre</th>
                      <th className="hidden px-5 py-4 md:table-cell">Rubrique</th>
                      <th className="hidden px-5 py-4 lg:table-cell">Auteur</th>
                      <th className="hidden px-5 py-4 lg:table-cell">Date</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {articles.map((article) => (
                      <tr key={article.id} className="transition-colors hover:bg-neutral-800/40">
                        <td className="max-w-xs truncate px-5 py-4 font-semibold text-white">
                          {article.titre}
                        </td>
                        <td className="hidden px-5 py-4 md:table-cell">
                          <span className="rounded-full bg-red-950/80 px-2.5 py-0.5 text-[10px] font-bold text-red-400 border border-red-800/40">
                            {article.categorie}
                          </span>
                        </td>
                        <td className="hidden px-5 py-4 text-xs text-neutral-400 lg:table-cell">
                          {article.auteur || '—'}
                        </td>
                        <td className="hidden px-5 py-4 text-xs text-neutral-500 lg:table-cell">
                          {article.created_at ? new Date(article.created_at).toLocaleDateString('fr-FR') : '—'}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(article)}
                              className="inline-flex items-center gap-1 rounded-lg bg-neutral-800 px-3 py-1.5 text-xs font-bold text-neutral-200 transition-colors hover:bg-neutral-700 hover:text-white"
                            >
                              <Pencil size={13} /> Éditer
                            </button>
                            <button
                              onClick={() => handleDelete(article.id)}
                              className="inline-flex items-center gap-1 rounded-lg bg-red-950/50 px-3 py-1.5 text-xs font-bold text-red-400 transition-colors hover:bg-red-900/80 hover:text-white"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* FORM VIEW (EDITION & CREATION) */}
        {view === 'form' && (
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black text-white">
                {editingArticle ? "MODIFIER L'ARTICLE" : 'RÉDIGER UN ARTICLE'}
              </h2>
            </div>

            {submitStatus === 'success' && (
              <div className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-950/80 border border-emerald-800 p-4 text-xs font-bold text-emerald-300">
                <CheckCircle2 size={18} /> {submitMessage}
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-950/80 border border-red-800 p-4 text-xs font-bold text-red-300">
                <AlertCircle size={18} /> {submitMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl sm:p-8">
              {/* Titre */}
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Titre de l'article
                </label>
                <input
                  type="text"
                  required
                  value={form.titre}
                  onChange={(e) => setForm({ ...form, titre: e.target.value })}
                  className={inputClass}
                  placeholder="ex: Titre captivant de votre actualité…"
                />
              </div>

              {/* Rubrique + Auteur */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Rubrique
                  </label>
                  <input
                    type="text"
                    required
                    value={form.categorie}
                    onChange={(e) => setForm({ ...form, categorie: e.target.value })}
                    className={inputClass}
                    placeholder="POLITIQUE, ÉCONOMIE, CULTURE…"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Auteur / Journaliste
                  </label>
                  <input
                    type="text"
                    required
                    value={form.auteur}
                    onChange={(e) => setForm({ ...form, auteur: e.target.value })}
                    className={inputClass}
                    placeholder="Nom du journaliste"
                  />
                </div>
              </div>

              {/* Image de l'article */}
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Image d'illustration
                </label>

                <div className="mb-3">
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-800 bg-neutral-950/50 p-6 text-center transition-all hover:border-red-600 hover:bg-red-950/10">
                    {uploading ? (
                      <>
                        <Loader2 size={24} className="animate-spin text-red-500" />
                        <span className="text-xs text-neutral-400">Téléversement en cours…</span>
                      </>
                    ) : (
                      <>
                        <Upload size={24} className="text-neutral-500" />
                        <span className="text-xs font-semibold text-neutral-300">
                          Cliquez pour importer une image depuis votre ordinateur
                        </span>
                        <span className="text-[10px] text-neutral-500">PNG, JPG, WebP — max 5 Mo</span>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="relative my-3">
                  <input
                    type="url"
                    value={form.image_url.startsWith('data:') ? '' : form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    className={inputClass}
                    placeholder="Ou collez l'URL d'une image (https://…)"
                  />
                </div>

                {form.image_url && (
                  <div className="relative mt-3 overflow-hidden rounded-xl border border-neutral-800">
                    <img
                      src={form.image_url}
                      alt="Aperçu"
                      className="max-h-52 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, image_url: '' }))}
                      className="absolute right-3 top-3 rounded-lg bg-black/80 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-md transition-colors hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Chapô */}
              <div>
                <label className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  <span>Chapô (Résumé / Accroche)</span>
                  <span className="flex items-center gap-1 text-[10px] text-red-400">
                    <Sparkles size={12} /> Essentiel pour la Une
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={form.chapo}
                  onChange={(e) => setForm({ ...form, chapo: e.target.value })}
                  className={`${inputClass} resize-y italic`}
                  placeholder="Résumé percutant qui introduit le corps de votre article…"
                />
              </div>

              {/* Contenu */}
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Corps de l'article
                </label>
                <textarea
                  required
                  rows={10}
                  value={form.contenu}
                  onChange={(e) => setForm({ ...form, contenu: e.target.value })}
                  className={`${inputClass} resize-y leading-relaxed`}
                  placeholder="Développez votre article ici…"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-neutral-800 pt-6">
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className="rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitStatus === 'loading'}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-red-600/30 transition-all hover:bg-red-500 hover:shadow-red-600/50 disabled:opacity-50"
                >
                  {submitStatus === 'loading' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Publication…
                    </>
                  ) : (
                    <>
                      <Send size={16} /> {editingArticle ? 'Mettre à jour' : 'Publier en direct'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
