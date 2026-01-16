import { motion } from "framer-motion";
import heroSmile from "@/assets/hero-smile-reference.jpg";
import { Check, Award, Car, Trophy, CreditCard, Star } from "lucide-react";
import iconImplant from "@/assets/icone-implante.png";
import whatsappIcon from "@/assets/whatsapp-icon.png";
import { SITE_CONFIG } from "@/config/siteConfig";

interface HeroProps {
  onOpenPopup: () => void;
}

// Extend Window interface for dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const Hero = ({ onOpenPopup }: HeroProps) => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#f8f9fa] pt-24">
      {/* Content */}
      <div className="relative z-10 w-full mx-auto" style={{ maxWidth: '1400px', paddingLeft: '40px', paddingRight: '40px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="bg-[#e0f2fe] px-4 py-2 rounded-full inline-flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#0ea5e9]" />
                <span className="text-[#0ea5e9] text-sm font-medium">
                  Especialistas em Implantes Dentários
                </span>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-5 leading-[1.1]"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}
            >
              <span className="text-[#1e293b] font-bold">Especialistas em implantes dentários {SITE_CONFIG.preposicao} </span>
              <span className="font-bold bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] bg-clip-text text-transparent">{SITE_CONFIG.cidade}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-[#64748b] text-base mb-5 max-w-xl"
            >
              Volte a comer o que quiser sem dor e sorrir com aparência dos seus dentes naturais.
            </motion.p>

            {/* No Insurance Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="inline-block mb-6"
            >
              <div className="bg-red-50 px-4 py-2.5 rounded-xl inline-flex items-center gap-3 shadow-sm">
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-red-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-0.5 bg-red-500 rotate-45" />
                  </div>
                </div>
                <span className="text-red-600 text-sm font-semibold">
                  Não atendemos planos de saúde
                </span>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 mb-8 items-center sm:items-start"
            >
              <button
                onClick={() => {
                  if (window.dataLayer) {
                    window.dataLayer.push({
                      event: "cta_whatsapp_click",
                      placement: "hero_primary",
                    });
                  }
                  onOpenPopup();
                }}
                className="w-full sm:w-auto px-8 py-3 bg-[#0ea5e9] text-white font-medium rounded-lg hover:bg-[#0284c7] transition-all duration-300 text-base shadow-[0_4px_14px_rgba(14,165,233,0.4)]"
              >
                Agendar avaliação gratuita
              </button>
              <button
                onClick={() => {
                  if (window.dataLayer) {
                    window.dataLayer.push({
                      event: "cta_whatsapp_click",
                      placement: "hero_whatsapp",
                    });
                  }
                  onOpenPopup();
                }}
                className="w-full sm:w-auto px-8 py-3 bg-white text-[#475569] font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 border-2 border-[#25D366] text-base shadow-sm flex items-center gap-2 justify-center"
              >
                <img src={whatsappIcon} alt="WhatsApp" className="w-4 h-4" style={{ filter: 'brightness(0) saturate(100%) invert(64%) sepia(57%) saturate(3705%) hue-rotate(93deg) brightness(93%) contrast(86%)' }} />
                Fale no WhatsApp
              </button>
            </motion.div>

            {/* Divider */}
            <div className="w-full h-px bg-gray-200 mb-6" />

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-wrap gap-12 items-center justify-center lg:justify-start"
            >
              {[
                { label: "Anos de Experiência", value: `${SITE_CONFIG.anosExperiencia}+`, icon: <Award className="w-8 h-8 text-[#0ea5e9]" /> },
                { label: "Implantes Realizados", value: `${SITE_CONFIG.implantesRealizados}+`, icon: <img src={iconImplant} alt="Implantes" className="w-8 h-8" style={{ filter: 'brightness(0) saturate(100%) invert(55%) sepia(89%) saturate(2476%) hue-rotate(168deg) brightness(98%) contrast(96%)' }} /> },
                { 
                  label: "Avaliação no Google", 
                  value: `${SITE_CONFIG.avaliacaoGoogle || "5"}/5`, 
                  icon: null
                },
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="group"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div className="group-hover:scale-105 transition-transform duration-200">
                      {stat.icon || (stat.label === "Avaliação no Google" ? (
                        <Star className="w-8 h-8 text-[#0ea5e9]" strokeWidth={2} />
                      ) : null)}
                    </div>
                    {stat.value && (
                      <div className="text-3xl font-bold text-[#0ea5e9]">
                        {stat.value}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-[#94a3b8] font-semibold">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroSmile}
                alt="Sorriso perfeito com implantes dentários de alta qualidade"
                className="w-full h-auto object-cover max-h-[500px]"
                loading="eager"
                decoding="async"
              />

              {/* Badge - Garantia Vitalícia */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-4 left-4 lg:bottom-8 lg:left-8 bg-white rounded-xl lg:rounded-2xl px-3 py-2 lg:px-6 lg:py-4 shadow-xl"
              >
                <div className="flex items-center gap-2 lg:gap-4">
                  <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 lg:w-6 lg:h-6 text-white stroke-[3]" />
                  </div>
                  <div>
                    <div className="font-bold text-[#1e293b] text-xs lg:text-base">Aparência Natural</div>
                    <div className="text-xs lg:text-sm text-[#64748b]">Implantes Certificados</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
