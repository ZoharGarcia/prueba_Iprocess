import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import ReactGA from "react-ga4";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { Button } from "@/app/components/ui/button";
import logoProyectoX from "@/assets/img/LOGO-IPROCESS-NARANJA-300x53.png";
import "@/styles/Header.css";

type NavItem = {
  path: string;
  label: string;
  section?: string;
};

const SECTIONS = [
  "inicio",
  "caracteristicas",
  "precios",
  "documentacion",
  "contacto",
] as const;

export default function HeaderForm() {
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("inicio");

  const navItems = useMemo<NavItem[]>(
    () => [
      { path: "/", label: "Inicio", section: "inicio" },
      {
        path: "/caracteristicas",
        label: "Características",
        section: "caracteristicas",
      },
      { path: "/precios", label: "Precios", section: "precios" },
      {
        path: "/documentacion",
        label: "Documentación",
        section: "documentacion",
      },
      { path: "/dashboard", label: "Dashboard" },
      { path: "/contacto", label: "Contacto", section: "contacto" },
    ],
    []
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (location.pathname !== "/") return;

      const current = SECTIONS.find((section) => {
        const el = document.getElementById(section);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });

      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // Si cambias de ruta, cierra el menú móvil para evitar estados raros.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    element.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsMenuOpen(false);
  };

  const trackClick = (label: string, isCTA = false) => {
    ReactGA.event({
      category: "Navegación",
      action: isCTA ? "Clic CTA" : "Clic Menú",
      label,
    });
  };

  const toggleMenu = () => setIsMenuOpen((p) => !p);
  const closeMenu = () => setIsMenuOpen(false);

  const locationPathname = location.pathname;

  return (
    <header
      className={`site-header fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "is-scrolled bg-background/95 backdrop-blur-md border-b border-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <Link
            to="/"
            className="site-header__brand flex items-center group z-10"
            onClick={() => trackClick("Logo", false)}
          >
            <img
              src={logoProyectoX}
              alt="Proyecto X - iProcess Ind"
              className="site-header__logo h-8 w-auto"
            />
            <span className="site-header__subtitle ml-2 text-sm font-medium text-foreground/80 hidden sm:block">
              Monitoreo de Sensores en la Nube
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="site-header__nav hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`site-header__nav-link relative px-4 py-2 text-sm font-medium transition-colors group ${
                  locationPathname === item.path
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
                onClick={(e) => {
                  if (item.section && locationPathname === "/") {
                    e.preventDefault();
                    scrollToSection(item.section);
                  }
                  trackClick(item.label, false);
                }}
              >
                {item.label}
                {item.section && (
                  <span
                    className={`site-header__nav-underline absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-all duration-300 ${
                      activeSection === item.section
                        ? "opacity-100 scale-x-100"
                        : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                    }`}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />
            <Button asChild>
              <Link
                to="/register"
                className="site-header__cta"
                onClick={() => trackClick("Comienza Ahora", true)}
              >
                Comienza Ahora
              </Link>
            </Button>
          </div>

          {/* Mobile Controls */}
          <div className="site-header__mobile flex lg:hidden items-center space-x-3 z-10">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="site-header__mobile-button p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="site-header__mobile-panel lg:hidden border-t border-border bg-background/98 backdrop-blur-md shadow-xl">
          <nav className="container mx-auto px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`site-header__mobile-link block w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                  locationPathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
                onClick={(e) => {
                  if (item.section && locationPathname === "/") {
                    e.preventDefault();
                    scrollToSection(item.section);
                  }
                  trackClick(item.label, false);
                  closeMenu();
                }}
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-4">
              <Button asChild>
                <Link
                  to="/register"
                  className="site-header__cta w-full"
                  onClick={() => {
                    trackClick("Comienza Ahora", true);
                    closeMenu();
                  }}
                >
                  Comienza Ahora
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
