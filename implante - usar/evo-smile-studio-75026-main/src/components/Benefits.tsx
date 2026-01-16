import { motion } from "framer-motion";
import { Heart, Utensils, Smile } from "lucide-react";
import iconeSorriso from "@/assets/icone-sorriso.png";
import iconeExcelencia from "@/assets/icone-excelencia-1.png";

const benefits = [
  {
    icon: iconeExcelencia,
    isImage: true,
    title: "Dentes como se fossem naturais",
    subtitle: "fixos e funcionais",
    description: "Nada de próteses que saem do lugar. Estabilidade e aparência natural no dia a dia.",
    gradient: "from-primary to-primary-light",
  },
  {
    icon: Smile,
    title: "Conforto durante o procedimento",
    subtitle: "Tranquilidade e segurança",
    description: "Para quem tem medo/ansiedade, oferecemos anestesia para conforto e segurança.",
    gradient: "from-secondary to-secondary-light",
  },
  {
    icon: iconeSorriso,
    isImage: true,
    title: "Ninguém percebe que é implante",
    subtitle: "Sorriso bonito e natural",
    description: "Resultado estético premium. Além de funcional, o resultado é esteticamente incrível.",
    gradient: "from-accent to-accent-light",
  },
  {
    icon: Utensils,
    title: "Coma o que quiser",
    subtitle: "Liberdade total para comer",
    description: "Mastigue com força e segurança, sem dor, como com seus dentes naturais.",
    gradient: "from-primary-dark to-secondary",
  },
  {
    icon: Heart,
    title: "Fim das dores e desconfortos",
    subtitle: "Conforto absoluto",
    description: "Chega de gengiva machucada e incômodo ao mastigar. Alívio real, todos os dias.",
    gradient: "from-secondary to-accent",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export const Benefits = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-section" />
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
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
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
              VANTAGENS
            </span>
          </div>
          <h2 className="mb-6">
            Por que escolher{" "}
            <span className="gradient-text">implantes dentários?</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Recupere sua qualidade de vida com segurança, conforto e resultados que duram décadas.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -12, transition: { duration: 0.3 } }}
                className="group relative"
              >
                {/* Card */}
                <div className="relative h-full bg-card rounded-3xl p-8 shadow-soft hover:shadow-strong transition-all duration-500 border border-border/50 overflow-hidden">
                  {/* Gradient Glow on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.gradient} p-0.5`}>
                      <div className="w-full h-full bg-card rounded-2xl flex items-center justify-center">
                        {benefit.isImage ? (
                          <img 
                            src={benefit.icon as string} 
                            alt={benefit.title}
                            className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-300"
                            style={{ filter: 'brightness(0) saturate(100%) invert(55%) sepia(89%) saturate(2476%) hue-rotate(168deg) brightness(98%) contrast(96%)' }}
                          />
                        ) : (
                          <Icon className="w-8 h-8 text-black group-hover:scale-110 transition-transform duration-300" style={{ filter: 'brightness(0) saturate(100%) invert(55%) sepia(89%) saturate(2476%) hue-rotate(168deg) brightness(98%) contrast(96%)' }} />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-primary/70 font-medium mb-4">
                      {benefit.subtitle}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>

                  {/* Decorative Element */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
