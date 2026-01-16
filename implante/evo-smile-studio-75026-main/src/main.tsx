import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Declaração global para TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

// COMENTADO: Google Ads tag manual - usando apenas GTM agora
// Helper para obter Google Ads config (do env ou localStorage)
// function getGoogleAdsConfig() {
//   // Primeiro tenta variáveis de ambiente
//   const conversionId = import.meta.env.VITE_GOOGLE_ADS_CONVERSION_ID;
//   if (conversionId) {
//     return {
//       conversionId,
//       conversionLabel: import.meta.env.VITE_GOOGLE_ADS_CONVERSION_LABEL || "",
//     };
//   }
//
//   // Se não tiver, tenta do localStorage do Dev Studio
//   try {
//     const saved = localStorage.getItem("config_editor_state");
//     if (saved) {
//       const parsed = JSON.parse(saved);
//       if (parsed?.googleAds?.conversionId) {
//         return {
//           conversionId: parsed.googleAds.conversionId,
//           conversionLabel: parsed.googleAds.conversionLabel || "",
//         };
//       }
//     }
//   } catch (e) {
//     // Ignora erros de parse
//   }
//
//   return null;
// }
// Inicializar Google Ads tag ANTES do React renderizar (para Tag Assistant detectar)
// const googleAdsConfig = getGoogleAdsConfig();
// if (googleAdsConfig?.conversionId) {
//   // Inicializar dataLayer
//   window.dataLayer = window.dataLayer || [];
//   
//   // Função gtag
//   function gtag(...args: any[]) {
//     window.dataLayer.push(args);
//   }
//   window.gtag = gtag;
//
//   // Script do Google tag
//   const script = document.createElement("script");
//   script.async = true;
//   script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAdsConfig.conversionId}`;
//   document.head.appendChild(script);
//
//   // Inicializar Google tag
//   gtag("js", new Date());
//   gtag("config", googleAdsConfig.conversionId);
// }

// Inicializar dataLayer apenas para GTM
window.dataLayer = window.dataLayer || [];

// Helper para obter GTM ID (do env ou localStorage)
function getGtmId() {
  // Primeiro tenta variáveis de ambiente
  const fromEnv = import.meta.env.VITE_GTM_ID;
  if (fromEnv && fromEnv.trim() !== "") {
    return fromEnv;
  }

  // Se não tiver, tenta do localStorage do Dev Studio
  try {
    const saved = localStorage.getItem("config_editor_state");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.gtmId && parsed.gtmId.trim() !== "") {
        return parsed.gtmId;
      }
    }
  } catch (e) {
    // Ignora erros de parse
  }

  return null;
}

// Inicializar GTM se configurado
const gtmId = getGtmId();
if (gtmId) {
  // GTM Script
  const gtmScript = document.createElement("script");
  gtmScript.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');
  `;
  document.head.appendChild(gtmScript);

  // Atualizar noscript iframe se existir
  const noscriptIframe = document.querySelector('noscript iframe[src*="googletagmanager.com"]');
  if (noscriptIframe) {
    noscriptIframe.setAttribute('src', `https://www.googletagmanager.com/ns.html?id=${gtmId}`);
  }
}

createRoot(document.getElementById("root")!).render(<App />);
