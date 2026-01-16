import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import whatsappIcon from "@/assets/whatsapp-icon.png";
import mediaSections from "@/content/mediaSections.json";
import type { MediaSections } from "@/types/media";

interface VideoTestimonialsProps {
  onOpenPopup: () => void;
}

// Extend Window interface for dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}

const media = mediaSections as MediaSections;
const testimonials = media.realStories.filter((item) => item.type === "video");

export const VideoTestimonials = ({ onOpenPopup }: VideoTestimonialsProps) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [videoDimensions, setVideoDimensions] = useState<Record<string, { width: number; height: number }>>({});
  const [videoPosters, setVideoPosters] = useState<Record<string, string>>({});
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const hasContent = testimonials.length > 0;

  // Detectar dimensões dos vídeos
  useEffect(() => {
    testimonials.forEach((testimonial) => {
      const video = document.createElement("video");
      video.src = testimonial.src;
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        setVideoDimensions((prev) => ({
          ...prev,
          [testimonial.id]: {
            width: video.videoWidth,
            height: video.videoHeight,
          },
        }));
      };
    });
  }, [testimonials]);

  const handleVideoClick = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (playingId === id) {
      // Pausar vídeo
      video.pause();
      setPlayingId(null);
    } else {
      // Pausar vídeo anterior se houver
      if (playingId && videoRefs.current[playingId]) {
        videoRefs.current[playingId]?.pause();
      }
      // Reproduzir novo vídeo
      video.play();
      setPlayingId(id);
    }
  };

  const handleVideoEnded = (id: string) => {
    setPlayingId(null);
  };

  const isVerticalVideo = (id: string) => {
    const dims = videoDimensions[id];
    if (!dims) return false;
    return dims.height > dims.width;
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#1e293b] mb-4">
            Histórias reais de quem voltou a sorrir com confiança
          </h2>
          <p className="text-lg text-[#64748b] max-w-2xl mx-auto">
            Ouça diretamente de nossos pacientes que fizeram o implante e hoje vivem outra realidade.
          </p>
        </motion.div>

        {hasContent ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => {
              const isVertical = isVerticalVideo(testimonial.id);
              const isPlaying = playingId === testimonial.id;

              return (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-black"
                >
                  <div
                    className={`relative ${
                      isVertical ? "aspect-[9/16] max-w-xs mx-auto" : "aspect-video"
                    } w-full cursor-pointer`}
                    onClick={() => handleVideoClick(testimonial.id)}
                  >
                    <video
                      ref={(el) => {
                        videoRefs.current[testimonial.id] = el;
                        if (el && !testimonial.poster && !videoPosters[testimonial.id]) {
                          // Gerar thumbnail quando o vídeo estiver pronto
                          const generateThumbnail = () => {
                            if (el.videoWidth > 0 && el.videoHeight > 0) {
                              try {
                                el.currentTime = 0.1;
                                setTimeout(() => {
                                  const canvas = document.createElement('canvas');
                                  canvas.width = el.videoWidth;
                                  canvas.height = el.videoHeight;
                                  const ctx = canvas.getContext('2d');
                                  if (ctx) {
                                    ctx.drawImage(el, 0, 0, canvas.width, canvas.height);
                                    const posterDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                                    setVideoPosters(prev => ({ ...prev, [testimonial.id]: posterDataUrl }));
                                    el.poster = posterDataUrl;
                                  }
                                }, 200);
                              } catch (error) {
                                console.warn('Erro ao gerar thumbnail:', error);
                              }
                            }
                          };
                          el.addEventListener('loadedmetadata', generateThumbnail, { once: true });
                          el.addEventListener('canplay', generateThumbnail, { once: true });
                        }
                      }}
                      src={testimonial.src}
                      className={`w-full h-full object-contain ${
                        isPlaying ? "" : "pointer-events-none"
                      }`}
                      poster={testimonial.poster || videoPosters[testimonial.id] || undefined}
                      preload="metadata"
                      onLoadedMetadata={(e) => {
                        const video = e.currentTarget;
                        if (!testimonial.poster && !videoPosters[testimonial.id] && video.videoWidth > 0 && video.videoHeight > 0) {
                          try {
                            video.currentTime = 0.1;
                            setTimeout(() => {
                              const canvas = document.createElement('canvas');
                              canvas.width = video.videoWidth;
                              canvas.height = video.videoHeight;
                              const ctx = canvas.getContext('2d');
                              if (ctx) {
                                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                                const posterDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                                setVideoPosters(prev => ({ ...prev, [testimonial.id]: posterDataUrl }));
                                video.poster = posterDataUrl;
                              }
                            }, 300);
                          } catch (error) {
                            console.warn('Erro ao gerar thumbnail:', error);
                          }
                        }
                      }}
                      onEnded={() => handleVideoEnded(testimonial.id)}
                      playsInline
                      muted={!isPlaying}
                    />

                    {/* Overlay com botão de play/pause */}
                    {!isPlaying && (
                      <div
                        className="absolute inset-0 bg-black/20 hover:bg-black/30 transition-colors duration-300 flex items-center justify-center cursor-pointer z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVideoClick(testimonial.id);
                        }}
                      >
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg">
                          <Play className="w-8 h-8 text-[#0ea5e9] ml-1" fill="currentColor" />
                        </div>
                      </div>
                    )}

                    {/* Botão de pause quando está tocando */}
                    {isPlaying && (
                      <div
                        className="absolute top-4 right-4 cursor-pointer z-10"
                        onClick={() => handleVideoClick(testimonial.id)}
                      >
                        <div className="w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors duration-300">
                          <Pause className="w-6 h-6 text-white" fill="currentColor" />
                        </div>
                      </div>
                    )}

                    {/* Descrição */}
                    {testimonial.description && !isPlaying && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-white text-sm font-medium">{testimonial.description}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">
              Adicione vídeos através do painel de desenvolvimento em /dev/studio
            </p>
          </motion.div>
        )}

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
                  placement: "video_testimonials_primary",
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
                  placement: "video_testimonials_whatsapp",
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
