import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import whatsappIcon from "@/assets/whatsapp-icon.png";
import { SITE_CONFIG } from "@/config/siteConfig";
// COMENTADO: Conversão manual do Google Ads - usando apenas GTM agora
// import { trackLeadFormConversion } from "@/analytics/googleAdsConversion";

interface ContactPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ContactPopup = ({ open, onOpenChange }: ContactPopupProps) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    nome: "",
    telefone: "",
  });
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
  });

  // Capturar UTM params e outros dados
  useEffect(() => {
    if (open) {
      const params = new URLSearchParams(window.location.search);
      const trackingData: Record<string, string> = {
        utm_source: params.get("utm_source") || "",
        utm_medium: params.get("utm_medium") || "",
        utm_campaign: params.get("utm_campaign") || "",
        utm_term: params.get("utm_term") || "",
        utm_content: params.get("utm_content") || "",
        gclid: params.get("gclid") || "",
        gbraid: params.get("gbraid") || "",
        wbraid: params.get("wbraid") || "",
        CampanhaID: params.get("CampanhaID") || "",
        GrupoID: params.get("GrupoID") || "",
        Extensão: params.get("Extensão") || "",
        CorrespondenciaPalavra: params.get("CorrespondenciaPalavra") || "",
        Dispositivo: params.get("Dispositivo") || "",
        Anuncio: params.get("Anuncio") || "",
        PalavraChave: params.get("PalavraChave") || "",
        // NOVOS
        matchType: params.get("matchType") || "",
        keyword: params.get("keyword") || "",
        adId: params.get("adId") || "",
        referrer: document.referrer || "",
      };

      // Salvar no localStorage
      localStorage.setItem("utm_data", JSON.stringify(trackingData));
      
      // Limpar erros quando o popup abrir
      setErrors({ nome: "", telefone: "" });
      setFormData({ nome: "", telefone: "" });
    }
  }, [open]);

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
    // Limpar erro quando o usuário começar a digitar
    if (errors.telefone) {
      setErrors({ ...errors, telefone: "" });
    }
  };

  const validatePhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, "");
    return numbers.length >= 10 && numbers.length <= 11;
  };

  // Helper para ler webhookUrl do SITE_CONFIG
  const getWebhookUrl = () => {
    return SITE_CONFIG.webhookUrl || "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Limpar erros anteriores
    setErrors({ nome: "", telefone: "" });

    // Validar campos
    let hasErrors = false;
    const newErrors = { nome: "", telefone: "" };

    if (!formData.nome) {
      newErrors.nome = "Este campo é obrigatório";
      hasErrors = true;
    }

    if (!formData.telefone) {
      newErrors.telefone = "Este campo é obrigatório";
      hasErrors = true;
    } else if (!validatePhone(formData.telefone)) {
      newErrors.telefone = "Telefone inválido. Use o formato (99) 99999-9999";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);

    try {
      // Recuperar UTM data do localStorage
      const utmDataStr = localStorage.getItem("utm_data") || "{}";
      const trackingParams = JSON.parse(utmDataStr);
      
      // Formatar data e hora no formato correto (DD/MM/YYYY)
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const dataDDMMYYYY = `${day}/${month}/${year}`;
      const horaHHmm = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

      // Montar payload do webhook
      const webhookData = new URLSearchParams({
        Nome: formData.nome,
        Telefone: formData.telefone,
        Forma_de_Contato: "Popup WhatsApp",
        
        // Parâmetros de tracking avançados
        CampanhaID: trackingParams.CampanhaID || "",
        GrupoID: trackingParams.GrupoID || "",
        Extensão: trackingParams.Extensão || "",
        CorrespondenciaPalavra: trackingParams.CorrespondenciaPalavra || "",
        Dispositivo: trackingParams.Dispositivo || "",
        Anuncio: trackingParams.Anuncio || "",
        PalavraChave: trackingParams.PalavraChave || "",
        
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
          form_origin: "popup_whatsapp",
        });
      }

      // Redirecionar para WhatsApp
      const phoneNumbers = formData.telefone.replace(/\D/g, "");
      const message = encodeURIComponent(
        `Olá, sou ${formData.nome} e tenho interesse em implantes dentários. Quero agendar avaliação.`
      );
      window.location.href = `https://wa.me/${SITE_CONFIG.whatsappE164}?text=${message}`;
      
      onOpenChange(false);
    } catch (error) {
      console.error("Form error:", error);
      toast.error("Erro ao enviar. Vamos tentar pelo WhatsApp.", {
        style: {
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#991b1b',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        },
        icon: '⚠️',
      });
      
      const phoneNumbers = formData.telefone.replace(/\D/g, "");
      const message = encodeURIComponent(
        `Olá, sou ${formData.nome} e tenho interesse em implantes dentários. Quero agendar avaliação.`
      );
      window.location.href = `https://wa.me/${SITE_CONFIG.whatsappE164}?text=${message}`;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-md animate-scale-in rounded-lg"
        aria-modal="true"
        onEscapeKeyDown={() => onOpenChange(false)}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-center gap-2 text-center">
            Agendar Avaliação Gratuita
          </DialogTitle>
          
          {/* No Insurance Notice */}
          <div className="mt-6 mb-6 flex justify-center">
            <div className="bg-red-50 px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-sm">
              <div className="relative">
                <CreditCard className="w-4 h-4 text-red-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-0.5 bg-red-500 rotate-45" />
                </div>
              </div>
              <span className="text-red-600 text-sm font-semibold">
                Não atendemos planos de saúde
              </span>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="nome">Nome completo *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => {
                setFormData({ ...formData, nome: e.target.value });
                if (errors.nome) {
                  setErrors({ ...errors, nome: "" });
                }
              }}
              placeholder="Seu nome"
              className={`min-h-[48px] ${errors.nome ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            />
            {errors.nome && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-start gap-2 mt-1">
                <span className="text-red-600 text-sm">⚠️</span>
                <p className="text-sm text-red-700 font-medium">{errors.nome}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone/WhatsApp *</Label>
            <Input
              id="telefone"
              type="tel"
              value={formData.telefone}
              onChange={handlePhoneChange}
              placeholder="(99) 99999-9999"
              className={`min-h-[48px] ${errors.telefone ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            />
            {errors.telefone && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-start gap-2 mt-1">
                <span className="text-red-600 text-sm">⚠️</span>
                <p className="text-sm text-red-700 font-medium">{errors.telefone}</p>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full min-h-[48px] bg-[#25D366] hover:bg-[#20BA5A] text-white"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <img src={whatsappIcon} alt="WhatsApp" className="w-4 h-4 brightness-0 invert mr-2" />
                Iniciar conversa no WhatsApp
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Extend Window interface for dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}
