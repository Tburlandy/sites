import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import whatsappIcon from "@/assets/whatsapp-icon.png";
import smileTransformation1 from "@/assets/smile-transformation-1.jpg";
import smileTransformation2 from "@/assets/smile-transformation-2.jpg";
import smileTransformation3 from "@/assets/smile-transformation-3.jpg";
import mediaSections from "@/content/mediaSections.json";
import type { MediaSections } from "@/types/media";
import { SITE_CONFIG } from "@/config/siteConfig";

interface SmileGalleryProps {
  onOpenPopup: () => void;
}

// Extend Window interface for dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}

const media = mediaSections as MediaSections;
const transformationsFromJson = media.smilesTransformed.filter((item) => item.type === "image");

// Imagens padrão como fallback
const defaultTransformations = [
  {
    image: smileTransformation1,
    alt: "Transformação de sorriso com implante dentário 1",
  },
  {
    image: smileTransformation2,
    alt: "Transformação de sorriso com implante dentário 2",
  },
  {
    image: smileTransformation3,
    alt: "Transformação de sorriso com implante dentário 3",
  },
];

// Usar imagens do JSON se existirem, senão usar as padrão
const transformations = transformationsFromJson.length > 0 
  ? transformationsFromJson.map((item) => ({
      id: item.id,
      image: item.src,
      alt: item.alt,
    }))
  : defaultTransformations.map((item, index) => ({
      id: `default-${index}`,
      image: item.image,
      alt: item.alt,
    }));

export const SmileGallery = ({ onOpenPopup }: SmileGalleryProps) => {
  return (
    <section id="casos-de-implante" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#1e293b] mb-4">
            Mais de {SITE_CONFIG.implantesRealizados} sorrisos transformados
          </h2>
          <p className="text-lg text-[#64748b] max-w-2xl mx-auto">
            Veja alguns dos resultados reais conquistados pelos nossos pacientes
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <Carousel
            opts={{
              align: "start",
              loop: transformations.length > 3,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {transformations.map((transformation) => (
                <CarouselItem key={transformation.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                    <img
                      src={transformation.image}
                      alt={transformation.alt}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {transformations.length > 1 && (
              <>
                <CarouselPrevious className="left-2 md:left-4 bg-white/90 hover:bg-white border-2 border-gray-200 shadow-lg opacity-100 hover:opacity-100 disabled:opacity-70" />
                <CarouselNext className="right-2 md:right-4 bg-white/90 hover:bg-white border-2 border-gray-200 shadow-lg opacity-100 hover:opacity-100 disabled:opacity-70" />
              </>
            )}
          </Carousel>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-12"
        >
          <button
            onClick={() => {
              if (window.dataLayer) {
                window.dataLayer.push({
                  event: "cta_whatsapp_click",
                  placement: "smile_gallery_primary",
                });
              }
              onOpenPopup();
            }}
            className="px-8 py-3 bg-[#0ea5e9] text-white font-medium rounded-lg hover:bg-[#0284c7] transition-all duration-300 text-base shadow-[0_4px_14px_rgba(14,165,233,0.4)]"
          >
            Agendar avaliação gratuita
          </button>
          <button
            onClick={() => {
              if (window.dataLayer) {
                window.dataLayer.push({
                  event: "cta_whatsapp_click",
                  placement: "smile_gallery_whatsapp",
                });
              }
              onOpenPopup();
            }}
            className="px-8 py-3 bg-white text-[#475569] font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 border-2 border-[#25D366] text-base shadow-sm flex items-center gap-2 justify-center"
          >
            <img src={whatsappIcon} alt="WhatsApp" className="w-4 h-4" style={{ filter: 'brightness(0) saturate(100%) invert(64%) sepia(57%) saturate(3705%) hue-rotate(93deg) brightness(93%) contrast(86%)' }} />
            Fale no WhatsApp
          </button>
        </motion.div>
      </div>
    </section>
  );
};
