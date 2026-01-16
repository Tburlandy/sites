import { motion } from "framer-motion";
import { Calendar, Scan, Wrench, Smile, UserCheck } from "lucide-react";

const steps = [
  {
    icon: Calendar,
    title: "Avaliação",
    description: "Consulta inicial com análise completa da sua saúde bucal e definição do melhor plano",
  },
  {
    icon: Scan,
    title: "Planejamento Estético e Funcional",
    description: "Avaliação e planejamento do seu sorriso com tecnologia de ponta",
  },
  {
    icon: Wrench,
    title: "Procedimento Confortável",
    description: "Procedimento de alta precisão com anestesia para máximo conforto",
  },
  {
    icon: Smile,
    title: "Prótese Premium",
    description: "Instalação da coroa/prótese customizada com resultado natural e estético",
  },
  {
    icon: UserCheck,
    title: "Acompanhamento",
    description: "Suporte contínuo para garantir saúde, durabilidade e sua satisfação",
  },
];

export const Process = () => {
  return (
    <section className="py-24 md:py-32 bg-gradient-section relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
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
              PROCESSO
            </span>
          </div>
          <h2 className="mb-6">
            Como funciona o{" "}
            <span className="gradient-text">tratamento</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Processo simples, seguro e transparente do planejamento ao acompanhamento contínuo
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2">
              <div className="h-full w-full bg-gradient-to-b from-primary via-secondary to-accent" />
            </div>

            <div className="space-y-12 md:space-y-16">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isEven = index % 2 === 0;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="relative"
                  >
                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${isEven ? "" : "lg:text-right"}`}>
                      {/* Content - Left or Right based on index */}
                      <div className={`${isEven ? "lg:pr-12" : "lg:pl-12 lg:col-start-2"}`}>
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          className="group relative bg-card rounded-3xl p-8 shadow-soft hover:shadow-strong transition-all duration-300 border border-border/50"
                        >
                          {/* Step Number Badge */}
                          <div className={`inline-flex items-center gap-2 mb-4 ${isEven ? "" : "lg:justify-end"}`}>
                            <span className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">
                              ETAPA {index + 1}
                            </span>
                          </div>

                          <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground text-lg leading-relaxed">
                            {step.description}
                          </p>

                          {/* Decorative Gradient */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </motion.div>
                      </div>

                      {/* Icon - Center on Desktop */}
                      <div className={`hidden lg:block ${isEven ? "lg:col-start-2" : "lg:col-start-1 lg:row-start-1"}`}>
                        <div className="flex justify-center">
                          <motion.div
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            className="relative z-10"
                          >
                            <div className="w-20 h-20 rounded-2xl bg-gradient-premium p-0.5 shadow-glow">
                              <div className="w-full h-full bg-card rounded-2xl flex items-center justify-center">
                                <Icon className="w-10 h-10 text-primary" />
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      {/* Mobile Icon */}
                      <div className="lg:hidden flex justify-start mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-premium flex items-center justify-center shadow-medium">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
