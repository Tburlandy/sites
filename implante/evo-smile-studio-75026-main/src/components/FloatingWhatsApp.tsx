import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import whatsappIcon from "@/assets/whatsapp-icon.png";

interface FloatingWhatsAppProps {
  onOpenPopup: () => void;
}

export const FloatingWhatsApp = ({ onOpenPopup }: FloatingWhatsAppProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Altura aproximada do hero (90vh)
      const heroHeight = window.innerHeight * 0.9;
      const scrollPosition = window.scrollY;
      
      // Mostrar apenas após passar do hero
      setIsVisible(scrollPosition > heroHeight);
    };

    window.addEventListener("scroll", handleScroll);
    // Verificar posição inicial
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    // GTM event
    if (window.dataLayer) {
      window.dataLayer.push({
        event: "cta_whatsapp_click",
        placement: "floating_button",
      });
    }
    onOpenPopup();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={handleClick}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 left-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-2xl transition-colors duration-300 group"
          aria-label="Fale conosco no WhatsApp"
        >
          <img 
            src={whatsappIcon} 
            alt="WhatsApp" 
            className="w-8 h-8 brightness-0 invert"
          />
          
          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
