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
  const formattedCategories = categories.map((c) => c.toUpperCase());
  const allRubriques = Array.from(
    new Set([...DEFAULT_RUBRIQUES, ...formattedCategories])
  );

  return (
    <footer className="mt-16 border-t-2 border-stone-900 bg-stone-900 text-stone-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Section Marque */}
          <div>
            <h3 className="font-serif text-2xl font-black text-white">
              L'Écho Indépendant
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-stone-400">
              Le journal d'information indépendant. Indépendance, rigueur et vérité au service des lecteurs.
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
                <span className="text-stone-400">Qui sommes-nous</span>
              </li>
              <li>
                <span className="text-stone-400">Mentions légales</span>
              </li>
              <li>
                <span className="text-stone-400">Contact</span>
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
  );
}
