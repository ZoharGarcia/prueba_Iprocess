import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { Button } from "@/app/components/ui/button";
import logo from "@/assets/img/LOGO-IPROCESS-NARANJA-300x53.png";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Update active section based on scroll position
      const sections = ["inicio", "servicios", "industria", "partner", "contacto"];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) setActiveSection(currentSection);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const navItems = [
    { id: "inicio", label: "Inicio" },
    { id: "servicios", label: "Servicios" },
    { id: "industria", label: "Industria" },
    { id: "partner", label: "Partner" },
    { id: "contacto", label: "Contacto" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
  onClick={() => scrollToSection("inicio")}
  className="flex items-center group z-10"
>
  <img
    src={logo}
    alt="iP"
    className="
      h-8 w-auto
      transition-transform duration-300
      group-hover:scale-110
      drop-shadow-md
    "
  />
</button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors group ${
                  activeSection === item.id
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-all duration-300 ${
                    activeSection === item.id
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                  }`}
                />
              </button>
            ))}
          </nav>

          {/* Right Side - CTA + Theme Toggle */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />
            <Button
              onClick={() => scrollToSection("contacto")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Solicita Presupuesto
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-3 z-10">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
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
        <div className="lg:hidden border-t border-border bg-background/98 backdrop-blur-md shadow-xl">
          <nav className="container mx-auto px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4">
              <Button
                onClick={() => scrollToSection("contacto")}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
              >
                Solicita Presupuesto
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
