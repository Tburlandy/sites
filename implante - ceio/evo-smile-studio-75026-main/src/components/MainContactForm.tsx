import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { SITE_CONFIG } from "@/config/siteConfig";
// COMENTADO: Conversão manual do Google Ads - usando apenas GTM agora
// import { trackLeadFormConversion } from "@/analytics/googleAdsConversion";

export const MainContactForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
  });

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    // Limitar a 11 dígitos (máximo)
    const limitedNumbers = numbers.slice(0, 11);
    if (limitedNumbers.length <= 10) {
      return limitedNumbers.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    }
    return limitedNumbers.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, telefone: formatted });
  };

  const validatePhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, "");
    return numbers.length >= 10 && numbers.length <= 11;
  };

  // Helper para ler webhookUrl do SITE_CONFIG
  const getWebhookUrl = () => {
    return SITE_CONFIG.webhookUrl || "";
  };

  // Helper para ler parâmetros de tracking (URL + localStorage)
  const getTrackingParams = () => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl: Record<string, string> = {};
    
    // Parâmetros da URL
    const urlParams = [
      "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
      "gclid", "gbraid", "wbraid",
      "CampanhaID", "GrupoID", "Extensão", "CorrespondenciaPalavra",
      "Dispositivo", "Anuncio", "PalavraChave",
      // NOVOS
      "matchType", "keyword", "adId",
    ];
    
    urlParams.forEach(key => {
      const value = params.get(key);
      if (value) fromUrl[key] = value;
    });

    // Tentar ler do localStorage (fallback)
    try {
      const fromStorage = JSON.parse(localStorage.getItem("utm_data") || "{}");
      return { ...fromStorage, ...fromUrl };
    } catch {
      return fromUrl;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.telefone) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (!validatePhone(formData.telefone)) {
      toast.error("Telefone inválido. Use o formato (99) 99999-9999");
      return;
    }
    setLoading(true);

    try {
      const params = new URLSearchParams(window.location.search);
      const trackingParams = getTrackingParams();
      
      // Formatar data e hora no formato correto (DD/MM/YYYY)
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const dataDDMMYYYY = `${day}/${month}/${year}`;
      const horaHHmm = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

      const webhookData = new URLSearchParams({
        Nome: formData.nome,
        Telefone: formData.telefone,
        Forma_de_Contato: "Formulário",
        
        // Parâmetros de tracking avançados
        CampanhaID: trackingParams.CampanhaID || params.get("CampanhaID") || "",
        GrupoID: trackingParams.GrupoID || params.get("GrupoID") || "",
        Extensão: trackingParams.Extensão || params.get("Extensão") || "",
        CorrespondenciaPalavra: trackingParams.CorrespondenciaPalavra || params.get("CorrespondenciaPalavra") || "",
        Dispositivo: trackingParams.Dispositivo || params.get("Dispositivo") || "",
        Anuncio: trackingParams.Anuncio || params.get("Anuncio") || "",
        PalavraChave: trackingParams.PalavraChave || params.get("PalavraChave") || "",
        
        // IDs do formulário
        canal_id: SITE_CONFIG.canalId,
        form_id: SITE_CONFIG.formId,
        form_name: SITE_CONFIG.formName,
        
        // Data e hora
        Data: dataDDMMYYYY,
        Horário: horaHHmm,
      });

      // Enviar para webhook
      const webhookUrl = getWebhookUrl();
      
      if (webhookUrl && webhookUrl.trim() !== "") {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);

        try {
          await fetch(webhookUrl, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: webhookData.toString(),
            signal: controller.signal,
          });
          clearTimeout(timeout);
        } catch (error) {
          clearTimeout(timeout);
          console.warn("Webhook error:", error);
        }
      }

      // COMENTADO: Conversão manual do Google Ads - usando apenas GTM agora
      // trackLeadFormConversion();

      // GTM event - Enviar evento para o GTM processar
      if (window.dataLayer) {
        window.dataLayer.push({
          event: "lead_submit",
          form_origin: "formulario",
        });
      }

      navigate("/obrigado");
    } catch (error) {
      console.error("Form error:", error);
      toast.error("Erro ao enviar. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Extend Window interface for dataLayer
  declare global {
    interface Window {
      dataLayer: any[];
    }
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-hero">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-hover p-8 md:p-12 animate-scale-in">
          <div className="text-center mb-8">
            <h2 className="mb-4">Agende sua avaliação</h2>
            <p className="text-lg text-muted-foreground">
              Preencha o formulário e entraremos em contato para agendar sua consulta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="main-nome">Nome completo *</Label>
              <Input
                id="main-nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Seu nome"
                required
                className="min-h-[48px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="main-telefone">Telefone/WhatsApp *</Label>
              <Input
                id="main-telefone"
                type="tel"
                value={formData.telefone}
                onChange={handlePhoneChange}
                placeholder="(99) 99999-9999"
                required
                className="min-h-[48px]"
              />
            </div>

            <div className="flex justify-center w-full">
              <Button
                type="submit"
                className="w-full min-h-[48px] bg-primary hover:bg-primary/90 text-lg max-w-md mx-auto"
                disabled={loading}
              >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Agendar minha avaliação"
              )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
