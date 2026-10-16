import { useState } from 'react';
import { X, Lock, Mail, ShieldCheck, Info, Send, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  categories?: string[];
  onAdminClick?: () => void;
  onCategoryClick?: (category: string | null) => void;
}

export function Footer({ onAdminClick }: FooterProps) {
  const [activeModal, setActiveModal] = useState<
    'about' | 'legal' | 'contact' | 'newsletter' | null
  >(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterSubscribed(false);
        setNewsletterEmail('');
        setActiveModal(null);
      }, 2000);
    }
  };

  return (
    <>
      <footer className="mt-20 border-t border-neutral-800 bg-neutral-950 text-neutral-400">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 items-start">
            
            {/* Colonne 1 : Logo & Description */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-lg font-black text-white shadow-md shadow-red-600/30">
                  É
                </span>
                <span className="text-xl font-black tracking-tight text-white">
                  L'ÉCHO <span className="text-red-500">INDÉPENDANT</span>
                </span>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-neutral-400 max-w-sm">
                Le média d'information numérique indépendant. Suivez toute l'actualité en temps réel avec rigueur, impartialité et liberté éditoriale.
              </p>
              <div className="mt-4 flex items-center gap-3 text-[11px] font-semibold text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  Rigueur
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  Indépendance
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  Vérité
                </span>
              </div>
            </div>

            {/* Colonne 2 : Services & Direct */}
            <div className="md:col-span-4">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-white mb-4">
                Services & Direct
              </h4>
              <ul className="space-y-3 text-xs font-medium">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('newsletter')}
                    className="flex items-center gap-2 text-neutral-300 hover:text-red-400 transition-colors"
                  >
                    <Mail size={14} className="text-red-500" />
                    <span>S'abonner à l'Édition Numérique</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('contact')}
                    className="flex items-center gap-2 text-neutral-300 hover:text-red-400 transition-colors"
                  >
                    <Send size={14} className="text-red-500" />
                    <span>Transmettre une alerte ou un témoignage</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Colonne 3 : Informations & Accès Rédaction discret */}
            <div className="md:col-span-3 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-white mb-4">
                  Informations
                </h4>
                <ul className="space-y-2.5 text-xs font-medium">
                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveModal('about')}
                      className="transition-colors hover:text-white"
                    >
                      Qui sommes-nous
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveModal('legal')}
                      className="transition-colors hover:text-white"
                    >
                      Mentions légales
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveModal('contact')}
                      className="transition-colors hover:text-white"
                    >
                      Contact
                    </button>
                  </li>
                </ul>
              </div>

              {/* Bouton Espace Rédaction ultra-discret */}
              <div className="mt-6 pt-4 border-t border-neutral-900">
                <button
                  type="button"
                  onClick={onAdminClick}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  <Lock size={12} className="text-neutral-600" />
                  <span>Espace Rédaction</span>
                </button>
              </div>
            </div>

          </div>

          {/* Copyright */}
          <div className="mt-12 border-t border-neutral-900 pt-6 text-center text-[11px] text-neutral-600">
            © {new Date().getFullYear()} L'Écho Indépendant. Tous droits réservés.
          </div>
        </div>
      </footer>

      {/* Pop-up Modales */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-white shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                {activeModal === 'about' && (
                  <>
                    <Info size={18} className="text-red-500" /> Qui sommes-nous
                  </>
                )}
                {activeModal === 'legal' && (
                  <>
                    <ShieldCheck size={18} className="text-red-500" /> Mentions Légales
                  </>
                )}
                {activeModal === 'contact' && (
                  <>
                    <Mail size={18} className="text-red-500" /> Contactez-nous
                  </>
                )}
                {activeModal === 'newsletter' && (
                  <>
                    <Mail size={18} className="text-red-500" /> Newsletter Numérique
                  </>
                )}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-full bg-neutral-800 p-1.5 text-neutral-400 hover:bg-neutral-700 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 text-xs text-neutral-300 leading-relaxed">
              {activeModal === 'about' && (
                <p>
                  <strong>L'Écho Indépendant</strong> est un média numérique d'information libre de toute influence politique et commerciale.
                </p>
              )}
              {activeModal === 'legal' && (
                <div className="space-y-2">
                  <p><strong>Éditeur :</strong> L'Écho Indépendant Médias</p>
                  <p><strong>Hébergement :</strong> Vercel Inc. & Supabase</p>
                </div>
              )}
              {activeModal === 'contact' && (
                <div className="space-y-2">
                  <p><strong>Rédaction :</strong> redaction@echo-independant.com</p>
                  <p><strong>Support :</strong> contact@echo-independant.com</p>
                </div>
              )}
              {activeModal === 'newsletter' && (
                <div>
                  {newsletterSubscribed ? (
                    <div className="flex items-center gap-2 py-4 text-emerald-400 font-bold text-sm">
                      <CheckCircle2 size={20} /> Inscription réussie ! Merci.
                    </div>
                  ) : (
                    <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                      <p className="text-neutral-400">Recevez chaque matin l'essentiel des actualités directement par email.</p>
                      <input
                        type="email"
                        required
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder="votre.email@exemple.com"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-white outline-none focus:border-red-600"
                      />
                      <button
                        type="submit"
                        className="w-full rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-500 transition-colors"
                      >
                        S'abonner gratuitement
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {activeModal !== 'newsletter' && (
              <button
                onClick={() => setActiveModal(null)}
                className="mt-6 w-full rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-500 transition-colors"
              >
                Fermer
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
