import { MapPin, Phone, Clock, Car } from "lucide-react";
import whatsappIcon from "@/assets/whatsapp-icon.png";
import { SITE_CONFIG } from "@/config/siteConfig";

interface LocationProps {
  onOpenPopup: () => void;
}

// Helper para extrair URL do embed do Google Maps
// Aceita tanto URL direta quanto HTML completo do iframe
function extractGoogleMapsEmbedUrl(input: string): string {
  if (!input || input.trim() === "") {
    return "";
  }

  const trimmed = input.trim();

  // Se já é uma URL direta (começa com https://www.google.com/maps/embed)
  if (trimmed.startsWith("https://www.google.com/maps/embed")) {
    // Remove parâmetros extras que não são parte da URL (width, height, style, etc)
    const urlMatch = trimmed.match(/https:\/\/www\.google\.com\/maps\/embed\?[^"'\s]+/);
    if (urlMatch) {
      return urlMatch[0];
    }
    return trimmed.split('"')[0] || trimmed.split("'")[0] || trimmed;
  }

  // Se é HTML completo do iframe, extrair o src
  const iframeMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (iframeMatch && iframeMatch[1]) {
    const src = iframeMatch[1];
    // Garantir que é uma URL do Google Maps
    if (src.includes("google.com/maps/embed")) {
      return src;
    }
  }

  // Tentar extrair URL de qualquer forma possível
  const urlPattern = /https:\/\/www\.google\.com\/maps\/embed\?[^\s"'>]+/;
  const urlMatch = trimmed.match(urlPattern);
  if (urlMatch) {
    return urlMatch[0];
  }

  // Se não conseguir extrair, retornar como está (pode ser uma URL válida)
  return trimmed;
}

export const Location = ({ onOpenPopup }: LocationProps) => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12 md:mb-16 animate-slide-up">
          <h2 className="mb-4">Localização e Contato</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Estamos {SITE_CONFIG.preposicao} {SITE_CONFIG.cidade} com fácil acesso e estacionamento
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="space-y-6 animate-slide-up">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Endereço</h3>
                <p className="text-muted-foreground">
                  {SITE_CONFIG.enderecoLinha1}<br />
                  {SITE_CONFIG.enderecoLinha2}<br />
                  CEP: {SITE_CONFIG.cep}
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-3">Telefone/WhatsApp</h3>
                <button
                  onClick={onOpenPopup}
                  className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-2.5 rounded-lg hover:bg-[#20BA5A] transition-all duration-300 shadow-md hover:shadow-lg font-medium text-sm"
                >
                  <img src={whatsappIcon} alt="WhatsApp" className="w-4 h-4 brightness-0 invert" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Horário de Atendimento</h3>
                <p className="text-muted-foreground">
                  {SITE_CONFIG.horarioAtendimento.semana}
                  {SITE_CONFIG.horarioAtendimento.sabado && SITE_CONFIG.horarioAtendimento.sabado.trim() !== "" && (
                    <>
                      <br />
                      {SITE_CONFIG.horarioAtendimento.sabado}
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Car className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Estacionamento</h3>
                <p className="text-muted-foreground">
                  Estacionamento disponível próximo à clínica para sua comodidade
                </p>
              </div>
            </div>
          </div>

          <div className="animate-fade-in">
            {SITE_CONFIG.googleMapsUrl ? (
              <div className="bg-muted rounded-xl overflow-hidden shadow-soft h-full min-h-[400px]">
                <iframe
                  src={extractGoogleMapsEmbedUrl(SITE_CONFIG.googleMapsUrl)}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "400px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização da clínica"
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div className="bg-muted rounded-xl overflow-hidden shadow-soft h-full min-h-[400px] flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    [Inserir mapa estático ou iframe do Google Maps aqui]
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Configure o Google Maps no painel de desenvolvimento (/dev/studio)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
