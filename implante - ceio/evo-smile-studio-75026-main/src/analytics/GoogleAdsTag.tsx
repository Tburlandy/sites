import { useEffect } from "react";
import { SITE_CONFIG } from "@/config/siteConfig";

declare global {
  interface Window {
    dataLayer: any[];
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

export function GoogleAdsTag() {
  useEffect(() => {
    // Verifica se já foi inicializado no main.tsx
    if (window.gtag && window.dataLayer && window.dataLayer.length > 0) {
      const config = getGoogleAdsConfig();
      if (config?.conversionId) {
        console.log(`✅ Google Ads: Tag já inicializada no main.tsx com ID ${config.conversionId}`);
      }
      return;
    }

    // Fallback: inicializa aqui se não foi inicializado no main.tsx
    const config = getGoogleAdsConfig();
    const conversionId = config?.conversionId;
    
    if (!conversionId) {
      console.log("⚠️ Google Ads: conversionId não configurado. Configure no Dev Studio ou via variáveis de ambiente.");
      return;
    }

    // Script principal (Google tag)
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${conversionId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;

    // Inicializa Google tag (usa Google Ads como "tag principal")
    gtag("js", new Date());
    gtag("config", conversionId); // remarketing + base para conversão
    
    console.log(`✅ Google Ads: Tag inicializada com ID ${conversionId}`);
  }, []);

  return null;
}

