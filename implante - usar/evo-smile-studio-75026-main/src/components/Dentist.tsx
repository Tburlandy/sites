import { motion } from "framer-motion";
import { Award, GraduationCap, Users, Sparkles } from "lucide-react";
import dentistImage from "@/assets/dentist-professional.jpg";
import mediaSections from "@/content/mediaSections.json";
import type { MediaSections } from "@/types/media";
import { SITE_CONFIG } from "@/config/siteConfig";
import { getAssetPath } from "@/lib/pathUtils";
import { getTransformStyle } from "@/lib/transformUtils";

const media = mediaSections as MediaSections;
const doctorImages = media.doctorHighlight.filter((item) => item.type === "image");

// Usar imagens do JSON se existirem, senão usar a padrão
const doctors = doctorImages.length > 0 
  ? doctorImages.slice(0, 2).map((item, index) => ({
      src: item.src.startsWith('/src/assets/') ? dentistImage : getAssetPath(item.src),
      alt: item.alt,
      description: item.description,
      transform: item.transform,
      info: SITE_CONFIG.doctors[index] || SITE_CONFIG.doctors[0] || {
        nomeCompleto: "[Nome Completo]",
        cro: "CRO/RJ [NÚMERO]",
        formacao: "Especialização em Implantodontia e Prótese Dentária",
        experiencia: "Mais de [X] anos com índice de sucesso superior a 95%",
        atendimento: "Centenas de pacientes satisfeitos",
      },
    }))
  : [{ 
      src: dentistImage, 
      alt: "Dr(a). [Nome] - Especialista em Implantodontia - CRO/RJ",
      description: undefined,
      transform: undefined,
      info: SITE_CONFIG.doctors[0] || {
        nomeCompleto: "[Nome Completo]",
        cro: "CRO/RJ [NÚMERO]",
        formacao: "Especialização em Implantodontia e Prótese Dentária",
        experiencia: "Mais de [X] anos com índice de sucesso superior a 95%",
        atendimento: "Centenas de pacientes satisfeitos",
      },
    }];

export const Dentist = () => {
  const hasMultipleDoctors = doctors.length > 1;

  // Verificar quais campos devem ser exibidos (só exibir se todos os médicos tiverem preenchido)
  // Considera vazio: string vazia, apenas espaços, ou undefined/null
  const isFieldEmpty = (value: string | undefined | null) => {
    return !value || value.trim() === "";
  };
  
  const shouldShowFormacao = doctors.every(d => !isFieldEmpty(d.info?.formacao));
  const shouldShowExperiencia = doctors.every(d => !isFieldEmpty(d.info?.experiencia));
  const shouldShowAtendimento = doctors.every(d => !isFieldEmpty(d.info?.atendimento));

  return (
    <section id="sobre-o-doutor" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
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
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold flex items-center gap-2 justify-center">
              <Sparkles className="w-4 h-4" />
              ESPECIALISTA{hasMultipleDoctors ? "S" : ""}
            </span>
          </div>
          <h2 className="mb-6">
            Quem vai <span className="gradient-text">cuidar de você?</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Especialista em Implantodontia, com anos de experiência e formação de excelência.
          </p>
        </motion.div>

        {/* Doctors Layout */}
        {hasMultipleDoctors ? (
          // Layout elegante para 2 médicos - Cards lado a lado mais compactos
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {doctors.map((doctor, doctorIndex) => (
                <motion.div
                  key={doctorIndex}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: doctorIndex * 0.15 }}
                  className="group"
                >
                  <div className="bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-strong transition-all duration-300 border border-border/50 h-full flex flex-col">
                    {/* Image Section */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={doctor.src}
                        alt={doctor.alt}
                        className={`w-full h-full ${doctor.transform ? 'object-contain' : 'object-cover'} transition-transform duration-500 group-hover:scale-105`}
                        style={getTransformStyle(doctor.transform)}
                        loading="lazy"
                        decoding="async"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Decorative Elements */}
                      <div className="absolute top-4 right-4 w-20 h-20 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Content Section */}
                    <div className="p-8 flex-1 flex flex-col">
                      {/* Name and Credentials */}
                      <div className="mb-6">
                        <h3 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">
                          {doctor.info.nomeCompleto}
                        </h3>
                        <p className="text-primary font-semibold text-lg mb-3">{doctor.info.cro}</p>
                        {doctor.description && (
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {doctor.description}
                          </p>
                        )}
                      </div>

                      {/* Features - Compactos */}
                      <div className="space-y-4 mt-auto">
                        {[
                          shouldShowFormacao && {
                            icon: GraduationCap,
                            title: "Formação",
                            description: doctor.info.formacao,
                            gradient: "from-primary to-primary-light",
                          },
                          shouldShowExperiencia && {
                            icon: Award,
                            title: "Experiência",
                            description: doctor.info.experiencia,
                            gradient: "from-secondary to-secondary-light",
                          },
                          shouldShowAtendimento && {
                            icon: Users,
                            title: "Atendimento",
                            description: doctor.info.atendimento,
                            gradient: "from-accent to-accent-light",
                          },
                        ].filter(Boolean).map((item, index) => {
                          const Icon = item.icon;
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.4, delay: doctorIndex * 0.1 + index * 0.1 }}
                              className="flex items-start gap-4"
                            >
                              <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-medium`}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1 pt-1">
                                <h4 className="font-bold text-base mb-1 text-foreground">
                                  {item.title}
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                  {item.description}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          // Layout original para 1 médico
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              {/* Glow Background */}
              <div className="absolute -inset-4 bg-gradient-premium opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500" />

              {/* Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-strong">
                <img
                  src={doctors[0].src}
                  alt={doctors[0].alt}
                  className={`w-full h-auto aspect-square ${doctors[0].transform ? 'object-contain' : 'object-cover'}`}
                  style={getTransformStyle(doctors[0].transform)}
                  loading="lazy"
                  decoding="async"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Title */}
              <div>
                <h3 className="text-3xl md:text-4xl font-bold mb-2">{doctors[0].info.nomeCompleto}</h3>
                <p className="text-primary font-semibold text-xl">{doctors[0].info.cro}</p>
                {doctors[0].description && (
                  <p className="text-muted-foreground mt-2">{doctors[0].description}</p>
                )}
              </div>

              {/* Features */}
              <div className="space-y-6">
                {[
                  shouldShowFormacao && {
                    icon: GraduationCap,
                    title: "Formação",
                    description: doctors[0].info.formacao,
                    gradient: "from-primary to-primary-light",
                  },
                  shouldShowExperiencia && {
                    icon: Award,
                    title: "Experiência",
                    description: doctors[0].info.experiencia,
                    gradient: "from-secondary to-secondary-light",
                  },
                  shouldShowAtendimento && {
                    icon: Users,
                    title: "Atendimento",
                    description: doctors[0].info.atendimento,
                    gradient: "from-accent to-accent-light",
                  },
                ].filter(Boolean).map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.15 }}
                      whileHover={{ x: 8 }}
                      className="group/item relative"
                    >
                      <div className="flex gap-5 bg-card p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 shadow-soft hover:shadow-strong">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-medium group-hover/item:shadow-glow transition-shadow duration-300`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h4 className="font-bold text-lg md:text-xl mb-2 group-hover/item:text-primary transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};
