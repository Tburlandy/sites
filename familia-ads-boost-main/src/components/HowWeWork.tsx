import { CheckCircle } from "lucide-react";

const steps = [
  {
    title: "Análise do Caso",
    description: "Primeiro contato para compreender sua situação e necessidades. Atendimento sigiloso e sem compromisso.",
  },
  {
    title: "Estratégia Jurídica",
    description: "Definimos a melhor estratégia: judicial ou extrajudicial, sempre priorizando soluções mais rápidas e econômicas quando viáveis.",
  },
  {
    title: "Acompanhamento",
    description: "Transparência em todas as etapas. Você receberá atualizações constantes sobre o andamento do seu processo.",
  },
  {
    title: "Resolução",
    description: "Atuação técnica e humanizada até a conclusão do caso, com foco em resultados justos e duradouros.",
  },
];

const HowWeWork = () => {
  return (
    <section id="como-atuamos" className="py-24 px-4 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--border)) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-gold uppercase tracking-wider">Metodologia</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent mb-6">
            Como Atuamos
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Processo claro, transparente e focado em resultados do início ao fim
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/4 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card */}
              <div className="relative bg-gradient-card p-8 rounded-2xl border border-border/40 hover:border-gold/30 transition-all duration-500 hover:shadow-large text-center h-full flex flex-col">
                {/* Number Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-gold blur-lg opacity-50" />
                    <div className="relative w-12 h-12 bg-gradient-to-br from-gold-light to-gold rounded-xl flex items-center justify-center shadow-gold">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                  </div>
                </div>
                
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-accent rounded-2xl mb-6 mx-auto mt-6 group-hover:scale-110 transition-transform duration-500">
                  <CheckCircle className="w-8 h-8 text-primary group-hover:text-gold transition-colors duration-300" />
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed flex-grow">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;