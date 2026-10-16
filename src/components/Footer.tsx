interface FooterProps {
  onAdminClick?: () => void;
}

export function Footer({ onAdminClick }: FooterProps) {
  return (
    <footer className="mt-16 border-t-2 border-neutral-900 bg-neutral-900 text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-serif text-2xl font-black text-white">L'Écho Indépendant</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">
              Le journal d'information indépendant. Indépendance, rigueur et vérité au service des lecteurs.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-red-500">Rubriques</h4>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li className="hover:text-white"><a href="#">Politique</a></li>
              <li className="hover:text-white"><a href="#">Économie</a></li>
              <li className="hover:text-white"><a href="#">Culture</a></li>
              <li className="hover:text-white"><a href="#">International</a></li>
              <li className="hover:text-white"><a href="#">Société</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-red-500">Informations</h4>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li className="hover:text-white"><a href="#">Qui sommes-nous</a></li>
              <li className="hover:text-white"><a href="#">Mentions légales</a></li>
              <li className="hover:text-white"><a href="#">Contact</a></li>
              <li className="hover:text-white"><a href="#">Newsletter</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-between border-t border-neutral-700 pt-6 text-xs text-neutral-500">
          <span>© 2026 L'Écho Indépendant. Tous droits réservés.</span>
          {onAdminClick && (
            <button
              onClick={onAdminClick}
              className="uppercase tracking-wider transition-colors hover:text-neutral-300"
            >
              Rédaction
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
