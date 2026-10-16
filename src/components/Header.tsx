import { useMemo } from 'react';

interface HeaderProps {
  onLogoClick: () => void;
  onCategoryClick: (category: string) => void;
  activeCategory: string | null;
  categories: string[];
}

export function Header({ onLogoClick, onCategoryClick, activeCategory, categories }: HeaderProps) {
  const today = useMemo(() => {
    const date = new Date();
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  return (
    <header className="border-b-2 border-neutral-900 bg-white">
      {/* Date bar */}
      <div className="border-b border-neutral-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs uppercase tracking-wider text-neutral-500">
          <span className="hidden sm:inline">{today}</span>
          <span className="sm:hidden">{today.split(',')[0]}</span>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">Édition Nationale</span>
            <span className="font-semibold text-red-800">N° 1 — Année 2026</span>
          </div>
        </div>
      </div>

      {/* Masthead */}
      <div className="mx-auto max-w-7xl px-4 py-6 text-center sm:py-8">
        <button onClick={onLogoClick} className="group inline-block">
          <h1 className="font-serif text-4xl font-black leading-none tracking-tight text-neutral-900 transition-colors group-hover:text-red-800 sm:text-6xl md:text-7xl">
            L'Écho Indépendant
          </h1>
        </button>
        <p className="mt-3 text-xs uppercase tracking-[0.3em] text-neutral-500 sm:text-sm">
          Indépendance — Rigueur — Vérité
        </p>
      </div>

      {/* Category nav bar */}
      <nav className="border-y-2 border-neutral-900 bg-neutral-900">
        <div className="mx-auto max-w-7xl px-4">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 py-3 text-sm font-medium uppercase tracking-wide">
            <li>
              <button
                onClick={() => onCategoryClick('')}
                className={`font-serif transition-colors hover:text-white ${
                  activeCategory === null ? 'text-white' : 'text-neutral-400'
                }`}
              >
                Une
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => onCategoryClick(cat)}
                  className={`font-serif transition-colors hover:text-white ${
                    activeCategory === cat ? 'text-white' : 'text-neutral-400'
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
