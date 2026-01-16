import { motion } from "framer-motion";
import { CheckCircle2, Award, Clock, Heart } from "lucide-react";
import implantImage from "@/assets/implant-exploded.jpg";

const reasons = [
  {
    icon: Award,
    title: "Especializados em implantes",
    description: "Você será atendido por profissionais especializados e experientes, que fazem esse tipo de tratamento toda semana. ",
  },
  {
    icon: CheckCircle2,
    title: "Planejamento completo (estético + funcional)",
    description: "Avaliamos proporções do rosto, alinhamento dos dentes, cor, mastigação, estrutura óssea e até a fala, nada é feito “no olho” ou no improviso, usamos tecnologia de ponta para planejar seu sorriso",
  },
  {
    icon: Clock,
    title: "Conforto e segurança em cada etapa",
    description: "Do primeiro exame ao pós-operatório, todo o processo é pensado para o seu bem-estar. Oferecemos opções de anestesia para quem tem medo ou ansiedade e acompanhamento de perto em cada fase do tratamento.",
  },
  {
    icon: Heart,
    title: "Materiais de alta resistência e naturalidade",
    description: "Trabalhamos apenas com implantes e próteses de alta qualidade, com alta resistência ao desgaste, cor estável e textura muito próxima ao dente natural. Assim, além de bonito, seu sorriso fica durável e discreto.",
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="py-12 md:py-16 relative overflow-hidden bg-background">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-30">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center justify-items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-semibold">
                DIFERENCIAIS
              </span>
            </div>

            <h2 className="mb-4 text-3xl md:text-4xl">
              Por que{" "}
              <span className="text-[#0ea5e9]">nos escolher?</span>
            </h2>

            <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed">
              Tecnologia de ponta, equipe especializada e uma estrutura pensada para o seu conforto e segurança.
            </p>

            <div className="space-y-4">
              {reasons.map((reason, index) => {
                const Icon = reason.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ x: 8 }}
                    className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-premium flex items-center justify-center shadow-medium group-hover:shadow-glow transition-shadow duration-300">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                        {reason.title}
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {reason.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Image with 3D Effect */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative max-w-md mx-auto lg:max-w-lg w-full flex items-center justify-center self-center"
          >
            <div className="relative">
              {/* Floating Frame */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-premium opacity-20 blur-3xl" />

                {/* Main Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-strong">
                  <img
                    src={implantImage}
                    alt="Componentes de implante dentário premium - parafuso de titânio, pilar e coroa de porcelana"
                    className="w-full h-auto"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
