import { useState } from 'react';
import { X, Mail, ShieldCheck, Info } from 'lucide-react';

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
      <footer className="mt-16 border-t-2 border-stone-900 bg-stone-900 text-stone-300">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Section Marque */}
            <div>
              <h3 className="font-serif text-2xl font-black text-white">
                L'Écho Indépendant
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-400">
                Le journal d'information indépendant. Indépendance, rigueur et
                vérité au service des lecteurs.
              </p>
            </div>

            {/* Section Rubriques */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-red-500">
                Rubriques
              </h4>
              <ul className="mt-4 space-y-2 text-sm font-semibold">
                {allRubriques.map((cat) => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => {
                        if (onCategoryClick) onCategoryClick(cat);
                        window.scrollTo(0, 0);
                      }}
                      className="transition-colors hover:text-white"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section Informations & Admin */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-red-500">
                Informations
              </h4>
              <ul className="mt-4 space-y-2 text-sm">
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
                <li className="pt-2">
                  <button
                    type="button"
                    onClick={onAdminClick}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-400 transition-colors hover:text-red-300"
                  >
                    ⚙ Espace Rédaction
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 border-t border-stone-800 pt-6 text-center text-xs text-stone-500">
            © {new Date().getFullYear()} L'Écho Indépendant. Tous droits réservés.
          </div>
        </div>
      </footer>

      {/* ===== MODALE QUI SOMMES-NOUS ===== */}
      {activeModal === 'about' && (
        <Modal title="Qui sommes-nous" onClose={() => setActiveModal(null)}>
          <div className="flex items-center gap-3 mb-4 text-red-900">
            <Info size={24} />
            <span className="font-serif text-lg font-bold">Ligne Éditoriale</span>
          </div>
          <p className="leading-relaxed text-stone-700">
            <strong>L'Écho Indépendant</strong> est un média d'information numérique gratuit et autonome. Notre mission est d'offrir une couverture factuelle, rigoureuse et impartiale de l'actualité politique, économique et sociétale.
          </p>
          <p className="mt-3 leading-relaxed text-stone-700">
            Libre de toute influence politique ou financière, la rédaction privilégie l'investigation, l'analyse approfondie et la vérification systématique des faits.
          </p>
        </Modal>
      )}

      {/* ===== MODALE MENTIONS LÉGALES ===== */}
      {activeModal === 'legal' && (
        <Modal title="Mentions Légales" onClose={() => setActiveModal(null)}>
          <div className="flex items-center gap-3 mb-4 text-red-900">
            <ShieldCheck size={24} />
            <span className="font-serif text-lg font-bold">Informations Légales</span>
          </div>
          <div className="space-y-3 text-sm text-stone-700 leading-relaxed">
            <p><strong>Éditeur :</strong> L'Écho Indépendant Médias</p>
            <p><strong>Hébergement :</strong> Vercel Inc. — 340 S Lemon Ave #4133 Walnut, CA 91789, USA</p>
            <p><strong>Base de données :</strong> Supabase Inc.</p>
            <p><strong>Propriété intellectuelle :</strong> L'ensemble des contenus (textes, images, visuels) publiés sur ce site sont protégés par le droit d'auteur. Toute reproduction totale ou partielle sans autorisation préalable est strictement interdite.</p>
          </div>
        </Modal>
      )}

      {/* ===== MODALE CONTACT ===== */}
      {activeModal === 'contact' && (
        <Modal title="Contactez la Rédaction" onClose={() => setActiveModal(null)}>
          <div className="flex items-center gap-3 mb-4 text-red-900">
            <Mail size={24} />
            <span className="font-serif text-lg font-bold">Nous Écrire</span>
          </div>
          <p className="mb-4 text-sm text-stone-600">
            Une information à partager, un droit de réponse ou une question ? Contactez notre équipe rédactionnelle :
          </p>
          <div className="rounded border border-stone-200 bg-stone-50 p-4 space-y-2 text-sm text-stone-800">
            <p><strong>Rédaction :</strong> redaction@echo-independant.com</p>
            <p><strong>Support technique :</strong> contact@echo-independant.com</p>
          </div>
        </Modal>
      )}
    </>
  );
}

{/* Composant de Fenêtre Modale */}
function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded border border-stone-300 bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-4">
          <h3 className="font-serif text-xl font-black text-stone-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div>{children}</div>
        <div className="mt-6 border-t border-stone-200 pt-4 text-right">
          <button
            onClick={onClose}
            className="bg-stone-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-900 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
