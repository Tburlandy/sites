import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface HeaderProps {
  onWhatsAppClick: () => void;
}

const Header = ({ onWhatsAppClick }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-background/80 backdrop-blur-xl shadow-medium border-b border-border/40" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-2 bg-gradient-gold opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500 rounded-lg" />
            <div className="relative font-bold text-xl bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent">
              Advocacia Família
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("servicos")}
              className="relative text-sm font-medium text-foreground/80 hover:text-primary transition-colors group"
            >
              <span className="relative z-10">Serviços</span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
            <button
              onClick={() => scrollToSection("como-atuamos")}
              className="relative text-sm font-medium text-foreground/80 hover:text-primary transition-colors group"
            >
              <span className="relative z-10">Como atuamos</span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
            <button
              onClick={() => scrollToSection("equipe")}
              className="relative text-sm font-medium text-foreground/80 hover:text-primary transition-colors group"
            >
              <span className="relative z-10">Equipe</span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
            <button
              onClick={() => scrollToSection("perguntas")}
              className="relative text-sm font-medium text-foreground/80 hover:text-primary transition-colors group"
            >
              <span className="relative z-10">Perguntas</span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
            <button
              onClick={() => scrollToSection("contato")}
              className="relative text-sm font-medium text-foreground/80 hover:text-primary transition-colors group"
            >
              <span className="relative z-10">Contato</span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
          </nav>

          <Button
            onClick={onWhatsAppClick}
            className="relative bg-secondary hover:bg-secondary-dark text-secondary-foreground gap-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-secondary-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <MessageCircle className="w-5 h-5 relative z-10" />
            <span className="hidden sm:inline relative z-10">WhatsApp</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;