interface HeaderProps {
  categories?: string[];
  selectedCategory?: string | null;
  onSelectCategory?: (category: string | null) => void;
  onHomeClick?: () => void;
}

const DEFAULT_RUBRIQUES = [
  'POLITIQUE',
  'ÉCONOMIE',
  'CULTURE',
  'INTERNATIONAL',
  'SOCIÉTÉ',
];

export function Header({
  categories = [],
  selectedCategory,
  onSelectCategory,
  onHomeClick,
}: HeaderProps) {
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Convertir toutes les catégories saisies en majuscules pour éviter les doublons
  const formattedCategories = categories.map((c) => c.toUpperCase());

  // Fusionner et dédupliquer
  const allRubriques = Array.from(
    new Set([...DEFAULT_RUBRIQUES, ...formattedCategories])
  );

  return (
    <header className="border-b border-stone-300 bg-white">
      {/* Top Bar avec date */}
      <div className="border-b border-stone-200 py-2 text-center text-xs text-stone-500 capitalize">
        {currentDate} — Édition numérique
      </div>

      {/* Titre du journal */}
      <div className="mx-auto max-w-7xl px-4 py-8 text-center sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => {
            if (onSelectCategory) onSelectCategory(null);
            if (onHomeClick) onHomeClick();
          }}
          className="text-center font-serif transition-opacity hover:opacity-80"
        >
          <h1 className="font-serif text-4xl font-black tracking-tight text-stone-900 sm:text-6xl md:text-7xl">
            L'Écho Indépendant
          </h1>
          <p className="mt-2 text-xs uppercase tracking-widest text-stone-500">
            Indépendance — Rigueur — Vérité
          </p>
        </button>
      </div>

      {/* Barre de navigation / Rubriques en MAJUSCULES */}
      <nav className="border-t border-stone-900 bg-stone-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 overflow-x-auto px-4 py-3 text-xs font-bold uppercase tracking-widest sm:gap-8">
          {/* Bouton UNE */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (onSelectCategory) onSelectCategory(null);
              if (onHomeClick) onHomeClick();
            }}
            className={`transition-colors hover:text-red-400 ${
              !selectedCategory ? 'text-red-500 underline underline-offset-4' : 'text-stone-300'
            }`}
          >
            UNE
          </button>

          {/* Liste nettoyée des rubriques en majuscules */}
          {allRubriques.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (onSelectCategory) onSelectCategory(cat);
              }}
              className={`transition-colors hover:text-red-400 ${
                selectedCategory?.toUpperCase() === cat
                  ? 'text-red-500 underline underline-offset-4'
                  : 'text-stone-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
