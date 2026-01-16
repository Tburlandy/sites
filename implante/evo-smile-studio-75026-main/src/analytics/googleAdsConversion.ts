import { SITE_CONFIG } from "@/config/siteConfig";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// Helper para obter configuração do Google Ads (do SITE_CONFIG ou localStorage do Dev Studio)
function getGoogleAdsConfig() {
  // Primeiro tenta do SITE_CONFIG (variáveis de ambiente)
  const fromConfig = SITE_CONFIG.googleAds?.conversionId;
  if (fromConfig) {
    return {
      conversionId: SITE_CONFIG.googleAds.conversionId,
      conversionLabel: SITE_CONFIG.googleAds.conversionLabel,
    };
  }

  // Se não tiver, tenta do localStorage do Dev Studio
  try {
    const saved = localStorage.getItem("config_editor_state");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.googleAds?.conversionId) {
        return {
          conversionId: parsed.googleAds.conversionId,
          conversionLabel: parsed.googleAds.conversionLabel || "",
        };
      }
    }
  } catch (e) {
    // Ignora erros de parse
  }

  return null;
}

export function trackLeadFormConversion() {
  const config = getGoogleAdsConfig();
  const { conversionId, conversionLabel } = config || {};

  if (!conversionId || !conversionLabel) {
    console.warn("⚠️ Google Ads: Não foi possível disparar conversão. Verifique se conversionId e conversionLabel estão configurados.");
    return;
  }

  // Função para tentar disparar a conversão
  const fireConversion = () => {
    if (window.gtag) {
      try {
        window.gtag("event", "conversion", {
          send_to: `${conversionId}/${conversionLabel}`,
        });
        console.log(`✅ Google Ads: Conversão disparada para ${conversionId}/${conversionLabel}`);
      } catch (error) {
        console.warn("⚠️ Google Ads: Erro ao disparar conversão:", error);
      }
    } else {
      // Se gtag não estiver disponível, tentar novamente após um delay
      setTimeout(() => {
        if (window.gtag) {
          try {
            window.gtag("event", "conversion", {
              send_to: `${conversionId}/${conversionLabel}`,
            });
            console.log(`✅ Google Ads: Conversão disparada para ${conversionId}/${conversionLabel} (retry)`);
          } catch (error) {
            console.warn("⚠️ Google Ads: Erro ao disparar conversão (retry):", error);
          }
        } else {
          console.warn("⚠️ Google Ads: gtag não disponível após retry. Verifique se o script do Google Ads está carregado.");
        }
      }, 500);
    }
  };

  // Tentar disparar imediatamente ou aguardar um pouco
  if (window.gtag) {
    fireConversion();
  } else {
    // Aguardar um pouco para o script carregar
    setTimeout(fireConversion, 100);
  }
}

