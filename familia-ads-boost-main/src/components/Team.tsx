const team = [
  {
    name: "Dr. [Nome do Advogado]",
    oab: "OAB/UF 123.456",
    description: "Especialista em Direito de Família e Sucessões",
  },
  {
    name: "Dra. [Nome da Advogada]",
    oab: "OAB/UF 234.567",
    description: "Atuação em mediação e divórcio consensual",
  },
];

const Team = () => {
  return (
    <section id="equipe" className="py-24 px-4 bg-gradient-to-b from-background to-muted relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-gold uppercase tracking-wider">Excelência</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent mb-6">
            Nossa Equipe
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Profissionais experientes, éticos e comprometidos com a excelência jurídica
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {team.map((member, index) => (
            <div
              key={index}
              className="group relative bg-gradient-card p-10 rounded-3xl border border-border/40 hover:border-gold/30 shadow-soft hover:shadow-large transition-all duration-500 text-center"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 blur-2xl transition-opacity duration-500 rounded-3xl" />
              
              {/* Avatar */}
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 rounded-full" />
                <div className="relative w-32 h-32 bg-gradient-to-br from-primary/10 to-gold/10 rounded-full mx-auto flex items-center justify-center border-2 border-gold/20 group-hover:border-gold/40 transition-all duration-500 shadow-medium">
                  <span className="text-5xl font-bold bg-gradient-to-br from-primary to-primary-light bg-clip-text text-transparent">
                    {member.name.charAt(member.name.indexOf("[") + 1)}
                  </span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-card-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                {member.name}
              </h3>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-accent border border-gold/20 mb-4">
                <span className="w-2 h-2 rounded-full bg-gold" />
                <p className="text-sm text-primary font-semibold">
                  {member.oab}
                </p>
              </div>
              
              <p className="text-muted-foreground leading-relaxed text-lg">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;