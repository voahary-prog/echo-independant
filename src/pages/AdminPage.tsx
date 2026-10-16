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
  Image as ImageIcon,
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
      <div className="flex min-h-screen items-center justify-center bg-neutral-900 px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-800">
              <Lock className="text-white" size={24} />
            </div>
            <h1 className="font-serif text-2xl font-black text-white">Espace Rédaction</h1>
            <p className="mt-2 text-sm text-neutral-400">L'Écho Indépendant — Administration</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLoginError(false);
                }}
                className="w-full rounded-sm border border-neutral-700 bg-neutral-800 px-4 py-3 text-white placeholder-neutral-500 outline-none transition-colors focus:border-red-600"
                placeholder="••••••••••••"
                autoFocus
              />
              {loginError && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-red-400">
                  <AlertCircle size={14} /> Mot de passe incorrect.
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full rounded-sm bg-red-800 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-700"
            >
              Se connecter
            </button>
          </form>
          <button
            onClick={onBackToSite}
            className="mt-6 block w-full text-center text-xs uppercase tracking-wider text-neutral-500 transition-colors hover:text-neutral-300"
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

  // Form state
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
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

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet article définitivement ?')) return;

    const { error: deleteError } = await supabase.from('articles').delete().eq('id', id);

    if (deleteError) {
      alert('Erreur lors de la suppression : ' + deleteError.message);
      return;
    }
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  // SÉCURISÉ : Gestion des champs pouvant être null
  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setForm({
      titre: article.titre ?? '',
      categorie: article.categorie ?? '',
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
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        const dataUrl = await fileToBase64(file);
        setForm((prev) => ({ ...prev, image_url: dataUrl }));
        setUploadError(null);
      } else {
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(filePath);

        setForm((prev) => ({ ...prev, image_url: urlData.publicUrl }));
      }
    } catch {
      try {
        const dataUrl = await fileToBase64(file);
        setForm((prev) => ({ ...prev, image_url: dataUrl }));
      } catch {
        setUploadError("Impossible de charger l'image. Vérifiez le fichier.");
      }
    }
    setUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleClearImage = () => {
    setForm((prev) => ({ ...prev, image_url: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');
    setSubmitMessage('');

    const payload = {
      titre: form.titre,
      categorie: form.categorie,
      auteur: form.auteur,
      image_url: form.image_url,
      contenu: form.contenu,
    };

    if (editingArticle) {
      // Modification
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
      // Création
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
    }, 1500);
  };

  const inputClass =
    'w-full rounded-sm border border-neutral-300 bg-white px-4 py-2.5 text-neutral-900 outline-none transition-colors focus:border-red-700 focus:ring-1 focus:ring-red-700';

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Admin top bar */}
      <div className="border-b-2 border-neutral-900 bg-neutral-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg font-black">L'Écho Indépendant</span>
            <span className="rounded-sm bg-red-800 px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToSite}
              className="hidden items-center gap-1.5 text-sm text-neutral-300 transition-colors hover:text-white sm:flex"
            >
              <ExternalLink size={14} /> Voir le site
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-sm text-neutral-300 transition-colors hover:text-white"
            >
              <LogOut size={14} /> Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-300 bg-white">
        <div className="mx-auto flex max-w-7xl gap-1 px-4">
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              view === 'list'
                ? 'border-red-800 text-red-800'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <LayoutDashboard size={16} /> Tableau de bord
          </button>
          <button
            onClick={handleCreate}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              view === 'form' && !editingArticle
                ? 'border-red-800 text-red-800'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Plus size={16} /> Nouvel article
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* ===== LIST VIEW ===== */}
        {view === 'list' && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-black text-neutral-900">
                Tous les articles
              </h2>
              <span className="text-sm text-neutral-500">
                {articles.length} article{articles.length > 1 ? 's' : ''}
              </span>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
                <Loader2 className="mb-3 animate-spin" size={28} />
                <p className="text-sm">Chargement…</p>
              </div>
            )}

            {error && (
              <div className="border-l-4 border-red-800 bg-red-50 px-6 py-4">
                <p className="font-semibold text-red-900">Erreur</p>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            )}

            {!loading && !error && articles.length === 0 && (
              <div className="rounded-sm border border-dashed border-neutral-300 py-16 text-center text-neutral-400">
                <p className="text-sm">Aucun article. Cliquez sur « Nouvel article » pour en publier un.</p>
              </div>
            )}

            {!loading && !error && articles.length > 0 && (
              <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
                    <tr>
                      <th className="px-4 py-3">Titre</th>
                      <th className="hidden px-4 py-3 md:table-cell">Catégorie</th>
                      <th className="hidden px-4 py-3 lg:table-cell">Auteur</th>
                      <th className="hidden px-4 py-3 lg:table-cell">Date</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {articles.map((article) => (
                      <tr key={article.id} className="group transition-colors hover:bg-neutral-50">
                        <td className="max-w-xs truncate px-4 py-3 font-medium text-neutral-900">
                          {article.titre}
                        </td>
                        <td className="hidden px-4 py-3 md:table-cell">
                          <span className="rounded-sm bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-800">
                            {article.categorie}
                          </span>
                        </td>
                        <td className="hidden px-4 py-3 text-neutral-600 lg:table-cell">
                          {article.auteur || '—'}
                        </td>
                        <td className="hidden px-4 py-3 text-neutral-500 lg:table-cell">
                          {article.created_at ? new Date(article.created_at).toLocaleDateString('fr-FR') : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(article)}
                              className="inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-50"
                            >
                              <Pencil size={14} /> Modifier
                            </button>
                            <button
                              onClick={() => handleDelete(article.id)}
                              className="inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50"
                            >
                              <Trash2 size={14} /> Supprimer
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

        {/* ===== FORM VIEW ===== */}
        {view === 'form' && (
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 font-serif text-2xl font-black text-neutral-900">
              {editingArticle ? "Modifier l'article" : 'Rédiger un nouvel article'}
            </h2>

            {submitStatus === 'success' && (
              <div className="mb-6 flex items-center gap-2 rounded-sm border border-green-300 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
                <CheckCircle2 size={18} /> {submitMessage}
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mb-6 flex items-center gap-2 rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                <AlertCircle size={18} /> {submitMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 rounded-sm border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-700">
                  Titre
                </label>
                <input
                  type="text"
                  required
                  value={form.titre}
                  onChange={(e) => setForm({ ...form, titre: e.target.value })}
                  className={inputClass}
                  placeholder="Titre de l'article"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-700">
                    Catégorie
                  </label>
                  <input
                    type="text"
                    required
                    value={form.categorie}
                    onChange={(e) => setForm({ ...form, categorie: e.target.value })}
                    className={inputClass}
                    placeholder="ex: Politique, Culture…"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-700">
                    Auteur
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

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-700">
                  Image de l'article
                </label>

                <div className="mb-3">
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-6 text-center transition-colors hover:border-red-600 hover:bg-red-50/30">
                    {uploading ? (
                      <>
                        <Loader2 size={24} className="animate-spin text-red-700" />
                        <span className="text-sm text-neutral-600">Téléversement en cours…</span>
                      </>
                    ) : (
                      <>
                        <Upload size={24} className="text-neutral-400" />
                        <span className="text-sm text-neutral-600">
                          Cliquez pour importer une image depuis votre ordinateur
                        </span>
                        <span className="text-xs text-neutral-400">PNG, JPG, WebP — max 5 Mo</span>
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
                  {uploadError && (
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
                      <AlertCircle size={14} /> {uploadError}
                    </p>
                  )}
                </div>

                <div className="my-3 flex items-center gap-3">
                  <div className="h-px flex-1 bg-neutral-200" />
                  <span className="text-xs uppercase tracking-wider text-neutral-400">ou par URL</span>
                  <div className="h-px flex-1 bg-neutral-200" />
                </div>

                <div className="relative">
                  <input
                    type="url"
                    value={form.image_url.startsWith('data:') ? '' : form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    className={inputClass}
                    placeholder="https://exemple.com/image.jpg"
                  />
                </div>

                {form.image_url && (
                  <div className="relative mt-3 overflow-hidden rounded-sm border border-neutral-200">
                    <img
                      src={form.image_url}
                      alt="Aperçu"
                      className="max-h-56 w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="absolute right-2 top-2 flex items-center gap-1 rounded-sm bg-black/70 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-black/90"
                    >
                      <X size={12} /> Retirer
                    </button>
                    {form.image_url.startsWith('data:') && (
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-sm bg-black/70 px-2 py-1 text-xs text-white">
                        <ImageIcon size={12} /> Image importée
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-700">
                  Contenu
                </label>
                <textarea
                  required
                  rows={12}
                  value={form.contenu}
                  onChange={(e) => setForm({ ...form, contenu: e.target.value })}
                  className={`${inputClass} resize-y font-body leading-relaxed`}
                  placeholder="Rédigez votre article ici…"
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-neutral-200 pt-6">
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className="rounded-sm px-5 py-2.5 text-sm font-semibold text-neutral-600 transition-colors hover:bg-neutral-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitStatus === 'loading'}
                  className="inline-flex items-center gap-2 rounded-sm bg-red-800 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
                >
                  {submitStatus === 'loading' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {editingArticle ? 'Mise à jour…' : 'Publication…'}
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      {editingArticle ? 'Mettre à jour' : 'Publier'}
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
