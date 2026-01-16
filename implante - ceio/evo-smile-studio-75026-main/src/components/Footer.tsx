import { CTAButton } from "./CTAButton";
import whatsappIcon from "@/assets/whatsapp-icon.png";
import { SITE_CONFIG } from "@/config/siteConfig";

interface FooterProps {
  onOpenPopup: () => void;
}

export const Footer = ({ onOpenPopup }: FooterProps) => {
  return (
    <footer className="bg-foreground text-white py-12 md:py-16">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Pronto para transformar seu sorriso?
          </h3>
          <p className="text-white/80 text-lg mb-6 max-w-2xl mx-auto">
            Agende sua avaliação e descubra como podemos ajudá-lo
          </p>
          <CTAButton
            variant="primary"
            onClick={onOpenPopup}
            placement="footer"
            className="bg-white text-foreground hover:bg-white/90"
          >
            Agendar avaliação agora
          </CTAButton>
        </div>

        <div className="border-t border-white/20 pt-8 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h4 className="font-semibold mb-2">{SITE_CONFIG.nomeClinica}</h4>
              {SITE_CONFIG.doctors.map((doctor, index) => (
                <p key={index} className="text-white/70 text-sm">
                  {doctor.nomeCompleto} - {doctor.cro}
                </p>
              ))}
              {SITE_CONFIG.cnpj && (
                <p className="text-white/70 text-sm mt-2">CNPJ: {SITE_CONFIG.cnpj}</p>
              )}
            </div>

            <div>
              <h4 className="font-semibold mb-3">Contato</h4>
              <div className="flex justify-center md:justify-start mb-3">
                <button
                  onClick={onOpenPopup}
                  className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-2.5 rounded-lg hover:bg-[#20BA5A] transition-all duration-300 shadow-md hover:shadow-lg font-medium text-sm"
                >
                  <img src={whatsappIcon} alt="WhatsApp" className="w-4 h-4 brightness-0 invert" />
                  <span>WhatsApp</span>
                </button>
              </div>
              <p className="text-white/70 text-sm">{SITE_CONFIG.enderecoLinha1}, {SITE_CONFIG.enderecoLinha2}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Links</h4>
              <p className="text-white/70 text-sm">
                <a href="/politica-privacidade" className="hover:text-white transition-colors">
                  Política de Privacidade
                </a>
              </p>
            </div>
          </div>

          <div className="text-center text-white/60 text-sm mt-8">
            <p>© {new Date().getFullYear()} {SITE_CONFIG.nomeClinica}. Todos os direitos reservados.</p>
            <p className="mt-2 text-xs">
              Resultados podem variar de acordo com cada paciente. Fotos de tratamentos divulgadas com consentimento.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
