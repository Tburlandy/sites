import { useEffect } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/config/siteConfig";

const ThankYou = () => {
  useEffect(() => {
    // GTM event
    if (window.dataLayer) {
      window.dataLayer.push({
        event: "lead_thankyou_view",
      });
    }
  }, []);

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      "Olá, acabei de enviar o formulário do site e gostaria de confirmar minha avaliação."
    );
    window.location.href = `https://wa.me/${SITE_CONFIG.whatsappE164}?text=${message}`;
  };

  return (
    <>
      <SEO
        title={`Obrigado - ${SITE_CONFIG.nomeClinica}`}
        description="Recebemos seu contato e entraremos em contato em breve"
        canonical={window.location.origin + "/obrigado"}
        noindex
      />

      <main className="min-h-screen flex items-center justify-center bg-gradient-section px-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-hover p-8 md:p-12 text-center animate-scale-in">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-accent" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Obrigado pelo contato!
          </h1>

          <p className="text-lg text-muted-foreground mb-8">
            Recebemos suas informações e nossa equipe entrará em contato em breve para agendar sua avaliação.
          </p>

          <div className="bg-muted/50 rounded-xl p-6 mb-8">
            <p className="text-foreground mb-4">
              <strong>Precisa de atendimento urgente?</strong>
            </p>
            <Button
              onClick={handleWhatsApp}
              size="lg"
              className="bg-accent hover:bg-accent/90 min-h-[48px]"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Falar agora no WhatsApp
            </Button>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>📍 {SITE_CONFIG.enderecoLinha1}, {SITE_CONFIG.enderecoLinha2}</p>
            <p>📞 {SITE_CONFIG.whatsappE164.replace(/^55/, "").replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")}</p>
            <p>🕐 Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h</p>
          </div>

          <div className="mt-8">
            <a href="/" className="text-primary hover:underline">
              ← Voltar para o site
            </a>
          </div>
        </div>
      </main>
    </>
  );
};

export default ThankYou;
