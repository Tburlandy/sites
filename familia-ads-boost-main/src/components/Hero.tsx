import { Button } from "@/components/ui/button";
import ContactForm from "./ContactForm";

interface HeroProps {
  onWhatsAppClick: () => void;
}

const Hero = ({ onWhatsAppClick }: HeroProps) => {
  return (
    <section className="relative pt-32 pb-24 px-4 overflow-hidden bg-gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }} />
      </div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-light rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-white space-y-8 animate-fade-in">
            <div className="inline-block">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                Excelência em Direito de Família
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
              Advogado de Família em{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-gold-light to-gold bg-clip-text text-transparent">
                  [Cidade]
                </span>
                <span className="absolute inset-0 blur-xl bg-gradient-gold opacity-40" />
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light">
              Divórcio, Pensão e Inventário
            </p>
            
            <p className="text-lg text-white/80 leading-relaxed max-w-xl">
              Atuação ética e estratégica conforme a OAB. Atendimento humano, claro e sigiloso para proteger seus direitos e sua família.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="button"
                size="lg"
                className="relative bg-secondary hover:bg-secondary-dark text-secondary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group overflow-hidden text-lg px-8 py-6"
                onClick={onWhatsAppClick}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-secondary-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">Falar no WhatsApp</span>
              </Button>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-8 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-gold">✓</span>
                </div>
                <span>OAB Certificado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-gold">✓</span>
                </div>
                <span>Atendimento Sigiloso</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-gold">✓</span>
                </div>
                <span>Respostas em 24h</span>
              </div>
            </div>
          </div>

          <div className="relative group animate-fade-in">
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-gold opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500 rounded-3xl" />
            
            <div className="relative bg-white rounded-2xl p-8 md:p-10 shadow-large backdrop-blur-sm border border-white/20">
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-gold opacity-10 blur-3xl rounded-full" />
              
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-2">
                Solicite um contato
              </h2>
              <p className="text-muted-foreground mb-8">
                Responderemos em até 24 horas
              </p>
              <ContactForm formOrigin="principal" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;