import whatsappIcon from "@/assets/whatsapp-icon.png";
import { SITE_CONFIG } from "@/config/siteConfig";
import { getAssetPath } from "@/lib/pathUtils";

interface NavbarProps {
  onOpenPopup: () => void;
}

// Extend Window interface for dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const Navbar = ({ onOpenPopup }: NavbarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border/10 shadow-sm">
      <div className="container mx-auto px-6 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {SITE_CONFIG.logoUrl ? (
              <img 
                src={getAssetPath(SITE_CONFIG.logoUrl)} 
                alt={SITE_CONFIG.nomeClinica} 
                className="h-14 w-auto"
              />
            ) : (
              <div className="text-xl font-bold text-[#1e293b]">
                Implantes Dentários
              </div>
            )}
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            <a 
              href="#casos-de-implante" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('casos-de-implante')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="text-[#64748b] hover:text-[#1e293b] transition-colors text-sm font-medium cursor-pointer"
            >
              Casos de Implante
            </a>
            <a 
              href="#sobre-o-doutor" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('sobre-o-doutor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="text-[#64748b] hover:text-[#1e293b] transition-colors text-sm font-medium cursor-pointer"
            >
              Sobre os Doutores
            </a>
            <a 
              href="#estrutura-da-clinica" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('estrutura-da-clinica')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="text-[#64748b] hover:text-[#1e293b] transition-colors text-sm font-medium cursor-pointer"
            >
              Estrutura da Clínica
            </a>
            <a 
              href="#contato" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="text-[#64748b] hover:text-[#1e293b] transition-colors text-sm font-medium cursor-pointer"
            >
              Contato
            </a>
          </div>

          {/* WhatsApp Button */}
          <button
            onClick={() => {
              if (window.dataLayer) {
                window.dataLayer.push({
                  event: "cta_whatsapp_click",
                  placement: "navbar",
                });
              }
              onOpenPopup();
            }}
            className="flex items-center gap-1.5 md:gap-2 bg-[#25D366] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg hover:bg-[#20BA5A] transition-all duration-300 shadow-md hover:shadow-lg font-medium text-xs md:text-sm w-[50%] max-w-[60%] md:w-auto md:max-w-none justify-center"
          >
            <img src={whatsappIcon} alt="WhatsApp" className="w-3.5 h-3.5 md:w-4 md:h-4 brightness-0 invert flex-shrink-0" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
