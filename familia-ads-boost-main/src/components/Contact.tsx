import { MapPin, Phone, Mail, FileText } from "lucide-react";

const Contact = () => {
  return (
    <section id="contato" className="py-24 px-4 bg-gradient-to-b from-muted to-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-gold uppercase tracking-wider">Contato</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent mb-6">
            Informações de Contato
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Estamos prontos para atender você com excelência
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="group bg-gradient-card p-8 rounded-2xl border border-border/40 hover:border-gold/30 shadow-soft hover:shadow-large transition-all duration-500 text-center hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-500 rounded-2xl" />
            <div className="relative w-16 h-16 bg-gradient-accent rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
              <MapPin className="w-8 h-8 text-primary group-hover:text-gold transition-colors duration-300" />
            </div>
            <h3 className="font-bold text-lg text-card-foreground mb-3 group-hover:text-primary transition-colors duration-300">Endereço</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              [Rua, Número - Bairro]
              <br />
              [Cidade/UF - CEP]
            </p>
          </div>

          <div className="group bg-gradient-card p-8 rounded-2xl border border-border/40 hover:border-gold/30 shadow-soft hover:shadow-large transition-all duration-500 text-center hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-500 rounded-2xl" />
            <div className="relative w-16 h-16 bg-gradient-accent rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
              <Phone className="w-8 h-8 text-primary group-hover:text-gold transition-colors duration-300" />
            </div>
            <h3 className="font-bold text-lg text-card-foreground mb-3 group-hover:text-primary transition-colors duration-300">Telefone</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              (00) 0000-0000
              <br />
              (00) 00000-0000
            </p>
          </div>

          <div className="group bg-gradient-card p-8 rounded-2xl border border-border/40 hover:border-gold/30 shadow-soft hover:shadow-large transition-all duration-500 text-center hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-500 rounded-2xl" />
            <div className="relative w-16 h-16 bg-gradient-accent rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
              <Mail className="w-8 h-8 text-primary group-hover:text-gold transition-colors duration-300" />
            </div>
            <h3 className="font-bold text-lg text-card-foreground mb-3 group-hover:text-primary transition-colors duration-300">E-mail</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              contato@escritorio.adv.br
            </p>
          </div>

          <div className="group bg-gradient-card p-8 rounded-2xl border border-border/40 hover:border-gold/30 shadow-soft hover:shadow-large transition-all duration-500 text-center hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-500 rounded-2xl" />
            <div className="relative w-16 h-16 bg-gradient-accent rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
              <FileText className="w-8 h-8 text-primary group-hover:text-gold transition-colors duration-300" />
            </div>
            <h3 className="font-bold text-lg text-card-foreground mb-3 group-hover:text-primary transition-colors duration-300">CNPJ</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              00.000.000/0001-00
              <br />
              OAB/UF
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;