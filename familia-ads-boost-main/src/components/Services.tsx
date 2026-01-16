import { Scale, Heart, FileText, Users, Home, Shield } from "lucide-react";

const services = [
  {
    icon: Scale,
    title: "Divórcio e Separação",
    description: "Divórcio consensual e litigioso, partilha e sobrepartilha de bens. Atuação judicial e extrajudicial com foco em soluções céleres e justas.",
  },
  {
    icon: Heart,
    title: "Pensão Alimentícia",
    description: "Fixação, revisão e execução de pensão alimentícia com base em necessidade e possibilidade. Defesa técnica em ações de alimentos.",
  },
  {
    icon: FileText,
    title: "Inventário e Sucessões",
    description: "Inventário extrajudicial (quando cabível) e judicial. Orientação sobre testamento, doações e planejamento sucessório.",
  },
  {
    icon: Users,
    title: "Guarda e Convivência",
    description: "Guarda compartilhada e unilateral. Regulamentação de visitas e calendário de convivência. Autorizações de viagem e mudança de domicílio.",
  },
  {
    icon: Home,
    title: "União Estável",
    description: "Reconhecimento e dissolução de união estável, inclusive post mortem. Partilha de bens e direitos decorrentes da relação.",
  },
  {
    icon: Shield,
    title: "Curatela / Tomada de Decisão",
    description: "Medidas protetivas para pessoas com deficiência, respeitando sua autonomia. Curatela e tomada de decisão apoiada conforme o Estatuto da Pessoa com Deficiência.",
  },
];

const Services = () => {
  return (
    <section id="servicos" className="py-24 px-4 bg-gradient-to-b from-muted to-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-gold uppercase tracking-wider">Especialização</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent mb-6">
            Áreas de Atuação
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Soluções jurídicas especializadas em Direito de Família e Sucessões com excelência e compromisso
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group relative bg-gradient-card p-8 rounded-2xl border border-border/40 hover:border-gold/30 transition-all duration-500 hover:shadow-large hover:-translate-y-2"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-500 rounded-2xl" />
                
                {/* Icon */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-xl" />
                  <div className="relative w-16 h-16 bg-gradient-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-soft">
                    <Icon className="w-8 h-8 text-primary group-hover:text-gold transition-colors duration-300" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-card-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                
                {/* Bottom Accent Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;