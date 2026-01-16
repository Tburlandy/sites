const Footer = () => {
  return (
    <footer className="relative bg-gradient-hero text-primary-foreground py-16 px-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }} />
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center space-y-6">
          <div className="inline-block">
            <div className="font-bold text-2xl bg-gradient-to-r from-white via-gold-light to-white bg-clip-text text-transparent mb-4">
              Advocacia Família
            </div>
          </div>
          
          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          
          <p className="text-sm text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Conteúdo informativo. Não há promessa de resultado. Atuação conforme a OAB.
          </p>

          <div className="pt-8">
            <p className="text-sm text-primary-foreground/60">
              © {new Date().getFullYear()} Advocacia Família. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;