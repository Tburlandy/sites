import { motion, AnimatePresence } from "framer-motion";
import { Camera, Shield, MapPin, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import surgicalCenter from "@/assets/surgical-center.jpg";
import { SITE_CONFIG } from "@/config/siteConfig";
import { useState, useEffect } from "react";
import mediaSections from "@/content/mediaSections.json";
import type { MediaSections } from "@/types/media";
import { getAssetPath } from "@/lib/pathUtils";
import { getTransformStyle } from "@/lib/transformUtils";

const media = mediaSections as MediaSections;
const clinicImages = media.clinicStructure?.filter((item) => item.type === "image") || [];

const features = [
  {
    icon: Camera,
    title: "Equipamentos e laboratório de última geração",
    description: "Imagens 3D de alta precisão que permitem que sua prótese seja feita com precisão: encaixe perfeito, resultado previsível e sorriso fiel ao planejado.",
    gradient: "from-primary to-primary-light",
  },
  {
    icon: Shield,
    title: "Protocolo de Higiene Avançada",
    description: "Usamos materiais esterilizados e seguimos cuidados rígidos de higiene para proteger você o tempo todo.",
    gradient: "from-secondary to-secondary-light",
  },
  {
    icon: MapPin,
    title: "Estacionamento Fácil",
    description: "Localização privilegiada com estacionamento.",
    gradient: "from-accent to-accent-light",
  },
];

export const ClinicStructure = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = clinicImages.length > 0 
    ? clinicImages.map((item) => ({
        src: getAssetPath(item.src),
        transform: item.transform,
      }))
    : [{ src: surgicalCenter, transform: undefined }];

  // Auto-play carrossel
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section id="estrutura-da-clinica" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold flex items-center gap-2 justify-center">
              <Sparkles className="w-4 h-4" />
              ESTRUTURA
            </span>
          </div>
          <h2 className="mb-4">
            Nossa{" "}
            <span className="gradient-text">estrutura</span>
          </h2>
          <div className="flex items-center justify-center gap-2 mb-6">
            <MapPin className="w-12 h-12 md:w-14 md:h-14 text-primary flex-shrink-0" />
            <p className="text-base md:text-lg text-muted-foreground font-medium">
              {SITE_CONFIG.enderecoLinha1}, {SITE_CONFIG.enderecoLinha2}
            </p>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Clínica moderna e completa, com equipamentos de última geração e totalmente pensada para o seu conforto e segurança.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
          {/* Carrossel de Imagens */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative group"
          >
            {/* Glow Background */}
            <div className="absolute -inset-4 bg-gradient-premium opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500" />

            {/* Image Container com Carrossel */}
            <div className="relative rounded-3xl overflow-hidden shadow-strong">
              <div className="relative aspect-video w-full overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    className="absolute inset-0"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                  >
                    <img
                      src={images[currentIndex].src}
                      alt="Centro cirúrgico moderno com equipamentos de última geração e tecnologia avançada"
                      className={`w-full h-full ${images[currentIndex].transform ? 'object-contain' : 'object-cover'}`}
                      style={getTransformStyle(images[currentIndex].transform)}
                      loading="lazy"
                      decoding="async"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/60 via-transparent to-transparent" />

                {/* Navigation Buttons */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevious}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
                      aria-label="Imagem anterior"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
                      aria-label="Próxima imagem"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Dots Indicator */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentIndex
                            ? "bg-white w-8"
                            : "bg-white/50 hover:bg-white/75"
                        }`}
                        aria-label={`Ir para imagem ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Features Cards */}
          <div className="flex flex-col gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ scale: 1.03, x: 8 }}
                  className="group relative"
                >
                  <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-strong transition-all duration-300 border border-border/50 overflow-hidden">
                    {/* Background Gradient on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                    {/* Icon */}
                    <div className="relative flex items-start gap-5">
                      <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-medium group-hover:shadow-glow transition-shadow duration-300`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>

                    {/* Decorative Corner */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 glass px-8 py-4 rounded-2xl shadow-medium">
            <Shield className="w-6 h-6 text-primary" />
            <span className="text-foreground font-semibold">
              Seguimos os mais altos padrões de biossegurança
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
