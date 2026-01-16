import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageCircle } from "lucide-react";

const Obrigado = () => {
  useEffect(() => {
    // GTM Event
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: "lead_thankyou_view",
      });
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Recebemos seu contato</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-primary to-primary/80">
        <div className="max-w-md w-full bg-white rounded-lg shadow-medium p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-secondary" />
          </div>

          <h1 className="text-3xl font-bold text-primary">
            Recebemos seu contato!
          </h1>

          <p className="text-muted-foreground leading-relaxed">
            Nossa equipe entrará em contato em breve. Se preferir, fale conosco agora mesmo pelo WhatsApp.
          </p>

          <Button
            size="lg"
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-2"
            onClick={() => {
              window.location.href = "https://wa.me/5500000000000?text=" + 
                encodeURIComponent("Olá, acabei de enviar meus dados pelo site.");
            }}
          >
            <MessageCircle className="w-5 h-5" />
            Falar pelo WhatsApp agora
          </Button>

          <a
            href="/"
            className="block text-sm text-primary hover:underline pt-4"
          >
            Voltar para o site
          </a>
        </div>
      </div>
    </>
  );
};

export default Obrigado;