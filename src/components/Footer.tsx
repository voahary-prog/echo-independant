import { useState } from 'react';
import { X, Lock } from 'lucide-react';

interface FooterProps {
  categories?: string[];
  onAdminClick?: () => void;
  onCategoryClick?: (category: string | null) => void;
}

const DEFAULT_RUBRIQUES = [
  'POLITIQUE',
  'ÉCONOMIE',
  'CULTURE',
  'INTERNATIONAL',
  'SOCIÉTÉ',
  'SPORT',
  'PEOPLE',
];

export function Footer({
  categories = [],
  onAdminClick,
  onCategoryClick,
}: FooterProps) {
  const [activeModal, setActiveModal] = useState<
    'about' | 'legal' | 'contact' | null
  >(null);

  const formattedCategories = categories.map((c) => c.toUpperCase());
  const allRubriques = Array.from(
    new Set([...DEFAULT_RUBRIQUES, ...formattedCategories])
  );

  return (
    <>
      <footer className="mt-20 border-t border-neutral-800 bg-neutral-950 text-neutral-400">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 items-start">
            
            {/* Colonne 1 : Logo + Description */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-lg font-black text-white shadow-md shadow-red-600/30">
                  É
                </span>
                <span className="text-xl font-black tracking-tight text-white">
                  L'ÉCHO <span className="text-red-500">INDÉPENDANT</span>
                </span>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-neutral-400 max-w-sm">
                Le média d'information libre et indépendant. Suivez toute l'actualité en temps réel avec rigueur et impartialité.
              </p>
            </div>

            {/* Colonne 2 : Rubriques alignées sur la même rangée */}
            <div className="md:col-span-5">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-white mb-4">
                Rubriques
              </h4>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs font-semibold uppercase tracking-wider">
                {allRubriques.map((cat) => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => {
                        if (onCategoryClick) onCategoryClick(cat);
                        window.scrollTo(0, 0);
                      }}
                      className="transition-colors hover:text-red-500"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colonne 3 : Informations & Espace Rédaction discret à droite */}
            <div className="md:col-span-3 flex flex-col justify-between h-full">
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

              {/* Bouton Espace Rédaction discret */}
              <div className="mt-6 pt-4 border-t border-neutral-900">
                <button
                  type="button"
                  onClick={onAdminClick}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  <Lock size={12} className="text-neutral-500" />
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
              <h3 className="text-lg font-bold">
                {activeModal === 'about' && 'Qui sommes-nous'}
                {activeModal === 'legal' && 'Mentions Légales'}
                {activeModal === 'contact' && 'Contactez-nous'}
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
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="mt-6 w-full rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-500 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}
