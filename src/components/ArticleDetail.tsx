import { useState } from 'react';
import type { Article } from '@/types/article';
import {
  ArrowLeft,
  User,
  Calendar,
  Tag,
  Share2,
  Copy,
  Check,
  Facebook,
  Twitter,
  Linkedin,
} from 'lucide-react';

interface ArticleDetailProps {
  article: Article;
  relatedArticles?: Article[];
  onSelectArticle?: (article: Article) => void;
  onBack: () => void;
}

export function ArticleDetail({ article, onBack }: ArticleDetailProps) {
  const [copied, setCopied] = useState(false);

  // Génération d'un slug propre à partir du titre
  const slug = article.titre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9]+/g, '-')     // Remplacer les caractères spéciaux par des tirets
    .replace(/(^-|-$)+/g, '');       // Nettoyer les tirets aux extrémités

  // Construction de l'URL dédiée de l'article (sans dièse #)
  const baseUrl = window.location.origin;
  const articleUrl = `${baseUrl}/?article=${article.id}-${slug}`;
  const articleTitle = article.titre;

  // URLs de partage dynamiques
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(articleTitle)}&url=${encodeURIComponent(articleUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${articleTitle} :${articleUrl}`)}`,
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(articleUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

        {/* Métadonnées + Boutons de Partage rapide */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-neutral-200 py-3 text-xs text-neutral-500">
          <div className="flex flex-wrap items-center gap-4">
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

          {/* Module Partage */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              <Share2 size={13} /> Partager :
            </span>
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-neutral-100 p-2 text-neutral-600 transition-colors hover:bg-blue-600 hover:text-white"
              title="Partager sur Facebook"
            >
              <Facebook size={14} />
            </a>
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-neutral-100 p-2 text-neutral-600 transition-colors hover:bg-sky-500 hover:text-white"
              title="Partager sur X (Twitter)"
            >
              <Twitter size={14} />
            </a>
            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-neutral-100 p-2 text-neutral-600 transition-colors hover:bg-blue-700 hover:text-white"
              title="Partager sur LinkedIn"
            >
              <Linkedin size={14} />
            </a>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 rounded-lg bg-neutral-100 px-2.5 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:bg-neutral-800 hover:text-white"
              title="Copier le lien de l'article"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-500" />
                  <span className="text-[10px] text-emerald-600">Copié !</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span className="text-[10px]">Lien</span>
                </>
              )}
            </button>
          </div>
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

      {/* Corps de l'article avec interprétation HTML */}
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

      {/* Barre de partage en bas d'article */}
      <div className="mt-10 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h4 className="text-sm font-bold text-neutral-900">Vous avez aimé cet article ?</h4>
            <p className="text-xs text-neutral-500">Partagez l'information autour de vous.</p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
            >
              Facebook
            </a>
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-sky-500 px-3.5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
            >
              X / Twitter
            </a>
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
            >
              WhatsApp
            </a>
            <button
              onClick={handleCopyLink}
              className="rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-red-600"
            >
              {copied ? 'Lien copié !' : 'Copier le lien'}
            </button>
          </div>
        </div>
      </div>

      {/* Pied d'article */}
      <div className="mt-8 border-t border-neutral-200 pt-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-red-600"
        >
          <ArrowLeft size={16} /> Retour à la Une
        </button>
      </div>
    </article>
  );
}import { useState } from 'react';
import type { Article } from '@/types/article';
import {
  ArrowLeft,
  User,
  Calendar,
  Tag,
  Share2,
  Copy,
  Check,
  Facebook,
  Twitter,
  Linkedin,
} from 'lucide-react';

interface ArticleDetailProps {
  article: Article;
  relatedArticles?: Article[];
  onSelectArticle?: (article: Article) => void;
  onBack: () => void;
}

export function ArticleDetail({ article, onBack }: ArticleDetailProps) {
  const [copied, setCopied] = useState(false);

  const articleUrl = window.location.href;
  const articleTitle = article.titre;

  // URLs de partage
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(articleTitle)}&url=${encodeURIComponent(articleUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${articleTitle} :${articleUrl}`)}`,
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(articleUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

        {/* Métadonnées + Boutons de Partage rapide */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-neutral-200 py-3 text-xs text-neutral-500">
          <div className="flex flex-wrap items-center gap-4">
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

          {/* Module Partage */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              <Share2 size={13} /> Partager :
            </span>
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-neutral-100 p-2 text-neutral-600 transition-colors hover:bg-blue-600 hover:text-white"
              title="Partager sur Facebook"
            >
              <Facebook size={14} />
            </a>
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-neutral-100 p-2 text-neutral-600 transition-colors hover:bg-sky-500 hover:text-white"
              title="Partager sur X (Twitter)"
            >
              <Twitter size={14} />
            </a>
            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-neutral-100 p-2 text-neutral-600 transition-colors hover:bg-blue-700 hover:text-white"
              title="Partager sur LinkedIn"
            >
              <Linkedin size={14} />
            </a>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 rounded-lg bg-neutral-100 px-2.5 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:bg-neutral-800 hover:text-white"
              title="Copier le lien de l'article"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-500" />
                  <span className="text-[10px] text-emerald-600">Copié !</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span className="text-[10px]">Lien</span>
                </>
              )}
            </button>
          </div>
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

      {/* Corps de l'article avec interprétation HTML */}
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

      {/* Barre de partage en bas d'article */}
      <div className="mt-10 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h4 className="text-sm font-bold text-neutral-900">Vous avez aimé cet article ?</h4>
            <p className="text-xs text-neutral-500">Partagez l'information autour de vous.</p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
            >
              Facebook
            </a>
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-sky-500 px-3.5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
            >
              X / Twitter
            </a>
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
            >
              WhatsApp
            </a>
            <button
              onClick={handleCopyLink}
              className="rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-red-600"
            >
              {copied ? 'Lien copié !' : 'Copier le lien'}
            </button>
          </div>
        </div>
      </div>

      {/* Pied d'article */}
      <div className="mt-8 border-t border-neutral-200 pt-6">
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
