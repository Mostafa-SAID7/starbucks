import { Link } from "react-router-dom";
import { Logo } from "@/components/ui";
import { Language } from "@/hooks";

interface NavbarHeaderProps {
  lang: Language;
  onClose: () => void;
}

/**
 * Navbar Header Component
 * Displays logo and branding
 * ~50 LOC
 */
export function NavbarHeader({ lang, onClose }: NavbarHeaderProps) {
  return (
    <Link
      to={`/${lang}`}
      onClick={onClose}
      className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-starbucks-green focus-visible:rounded-lg"
      aria-label="Starbucks Home"
    >
      <Logo className="h-10 lg:h-12 w-auto aspect-square object-contain hover:scale-105 transition-transform duration-300" />
    </Link>
  );
}
