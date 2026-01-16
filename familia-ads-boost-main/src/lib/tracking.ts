export function getUTMParams() {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  
  // Tenta buscar do localStorage como fallback
  const stored = localStorage.getItem("utm_params");
  const storedParams = stored ? JSON.parse(stored) : {};

  const utmParams = {
    utm_source: params.get("utm_source") || storedParams.utm_source || "",
    utm_medium: params.get("utm_medium") || storedParams.utm_medium || "",
    utm_campaign: params.get("utm_campaign") || storedParams.utm_campaign || "",
    utm_term: params.get("utm_term") || storedParams.utm_term || "",
    utm_content: params.get("utm_content") || storedParams.utm_content || "",
    gclid: params.get("gclid") || storedParams.gclid || "",
    gbraid: params.get("gbraid") || storedParams.gbraid || "",
    wbraid: params.get("wbraid") || storedParams.wbraid || "",
    matchType: params.get("matchType") || storedParams.matchType || "",
    keyword: params.get("keyword") || storedParams.keyword || "",
    adId: params.get("adId") || storedParams.adId || "",
    CampanhaID: params.get("CampanhaID") || storedParams.CampanhaID || "",
    GrupoID: params.get("GrupoID") || storedParams.GrupoID || "",
    Extensão: params.get("Extensão") || storedParams.Extensão || "",
    CorrespondenciaPalavra: params.get("CorrespondenciaPalavra") || storedParams.CorrespondenciaPalavra || "",
    Dispositivo: params.get("Dispositivo") || storedParams.Dispositivo || "",
    Anuncio: params.get("Anuncio") || storedParams.Anuncio || "",
    PalavraChave: params.get("PalavraChave") || storedParams.PalavraChave || "",
    canal_id: params.get("canal_id") || storedParams.canal_id || "",
  };

  // Salva no localStorage para uso posterior
  if (Object.values(utmParams).some(v => v)) {
    localStorage.setItem("utm_params", JSON.stringify(utmParams));
  }

  return utmParams;
}

export function getDeviceType(): string {
  if (typeof window === "undefined") return "desktop";
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}