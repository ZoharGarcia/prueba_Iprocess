import { Link } from "react-router-dom";
import {
  Github,
  Linkedin,
  Mail,
  Facebook,
  Instagram,
} from "lucide-react";

const WHATSAPP_URL =
  "https://api.whatsapp.com/message/SKFMZLLTWXMKD1?autoload=1&app_absent=0";

// Cambia estos por tus URLs reales
const SOCIALS = {
  facebook: "https://facebook.com/iProcessind/",
  instagram: "https://instagram.com/iprocessind/",
  linkedin: "https://www.linkedin.com/company/iprocessind/",
  github: "https://github.com/tu-org",
  email: "mailto:info@iprocess-ind.com",
};

export function Footer() {
  return (
    <footer className="bg-[#000000] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">X</span>
              </div>
              <span className="text-xl font-bold">Proyecto X</span>
            </Link>

            <p className="text-[#a3a2a2] text-sm mb-4">
              Monitoreo inteligente de sensores industriales para optimizar tus
              operaciones.
            </p>

            {/* Social icons */}
            <div className="flex space-x-4">
              <a
                href={SOCIALS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-[#a3a2a2]/20 hover:bg-primary flex items-center justify-center transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>

              <a
                href={SOCIALS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-[#a3a2a2]/20 hover:bg-primary flex items-center justify-center transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>

              <a
                href={SOCIALS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-[#a3a2a2]/20 hover:bg-primary flex items-center justify-center transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>

              <a
                href={SOCIALS.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-10 h-10 rounded-full bg-[#a3a2a2]/20 hover:bg-primary flex items-center justify-center transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>

              <a
                href={SOCIALS.email}
                aria-label="Email"
                className="w-10 h-10 rounded-full bg-[#a3a2a2]/20 hover:bg-primary flex items-center justify-center transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>

            {/* Quick contact */}
            <div className="mt-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#a3a2a2] hover:text-primary transition-colors"
              >
                Contactar por WhatsApp
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="font-bold mb-4">Producto</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/features"
                  className="text-[#a3a2a2] hover:text-primary transition-colors"
                >
                  Características
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-[#a3a2a2] hover:text-primary transition-colors"
                >
                  Precios
                </Link>
              </li>
              <li>
                <Link
                  to="/docs"
                  className="text-[#a3a2a2] hover:text-primary transition-colors"
                >
                  Documentación
                </Link>
              </li>
              <li>
                <Link
                  to="/api"
                  className="text-[#a3a2a2] hover:text-primary transition-colors"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  to="/changelog"
                  className="text-[#a3a2a2] hover:text-primary transition-colors"
                >
                  Actualizaciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-bold mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-[#a3a2a2] hover:text-primary transition-colors"
                >
                  Acerca de
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-[#a3a2a2] hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-[#a3a2a2] hover:text-primary transition-colors"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  to="/partners"
                  className="text-[#a3a2a2] hover:text-primary transition-colors"
                >
                  Partners
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="font-bold mb-4">Recursos</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/help"
                  className="text-[#a3a2a2] hover:text-primary transition-colors"
                >
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#a3a2a2] hover:text-primary transition-colors"
                >
                  Soporte (WhatsApp)
                </a>
              </li>
              <li>
                <Link
                  to="/community"
                  className="text-[#a3a2a2] hover:text-primary transition-colors"
                >
                  Comunidad
                </Link>
              </li>
              <li>
                <Link
                  to="/status"
                  className="text-[#a3a2a2] hover:text-primary transition-colors"
                >
                  Estado del Sistema
                </Link>
              </li>
              <li>
                <Link
                  to="/security"
                  className="text-[#a3a2a2] hover:text-primary transition-colors"
                >
                  Seguridad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#a3a2a2]/20 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-[#a3a2a2] text-sm">
            © 2026 Proyecto X. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6">
            <Link
              to="/privacy"
              className="text-[#a3a2a2] hover:text-primary text-sm transition-colors"
            >
              Privacidad
            </Link>
            <Link
              to="/terms"
              className="text-[#a3a2a2] hover:text-primary text-sm transition-colors"
            >
              Términos
            </Link>
            <Link
              to="/cookies"
              className="text-[#a3a2a2] hover:text-primary text-sm transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}