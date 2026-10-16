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
  'SPORT',
  'PEOPLE',
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

  const formattedCategories = categories.map((c) => c.toUpperCase());
  const allRubriques = Array.from(
    new Set([...DEFAULT_RUBRIQUES, ...formattedCategories])
  );

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      {/* Top Bar minimale */}
      <div className="border-b border-neutral-100 bg-neutral-900 text-neutral-400 py-1.5 px-4 text-[11px] font-medium tracking-wide">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span className="capitalize">{currentDate}</span>
          <span className="flex items-center gap-2 text-neutral-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Édition Direct
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => {
            if (onSelectCategory) onSelectCategory(null);
            if (onHomeClick) onHomeClick();
          }}
          className="group text-left"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-xl font-black text-white shadow-lg shadow-red-600/30 transition-transform group-hover:scale-105">
              É
            </span>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-neutral-900 sm:text-3xl">
                L'ÉCHO <span className="text-red-600">INDÉPENDANT</span>
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Le média d'actualité en continu
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Navigation Rubriques */}
      <nav className="border-t border-neutral-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 text-xs font-bold tracking-wider">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (onSelectCategory) onSelectCategory(null);
              if (onHomeClick) onHomeClick();
            }}
            className={`rounded-lg px-4 py-2 transition-all ${
              !selectedCategory
                ? 'bg-neutral-900 text-white shadow-md'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            🔥 À LA UNE
          </button>

          {allRubriques.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (onSelectCategory) onSelectCategory(cat);
              }}
              className={`rounded-lg px-4 py-2 transition-all whitespace-nowrap ${
                selectedCategory?.toUpperCase() === cat
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
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
