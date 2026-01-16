export interface DoctorInfo {
  nomeCompleto: string;
  cro: string;
  formacao: string;
  experiencia: string;
  atendimento: string;
}

export type GoogleAdsConfig = {
  /** Ex: "AW-700923237" */
  conversionId: string;
  /** Ex: "Qjg0CPHd6sAbEOX6nM4C" */
  conversionLabel: string;
};

export const SITE_CONFIG = {
  // URL base do site (sem barra final e sem subpasta)
  siteUrl: "https://odontoalberticlinica.com.br",
  basePath: "/pagina/",
  
  cidade: "Osasco",
  uf: "SP",
  nomeClinica: "Odonto Alberti",
  enderecoLinha1: "Pátio Osasco - Av. dos Autonomistas, 896 Loja 228 - Piso Térreo - Vila Yara - Osasco/SP",
  enderecoLinha2: "Vila Yara - Osasco/SP",
  cep: "06020-010",
  preposicao: "em", // Preposição para "em Barra da Tijuca" e "Estamos em..."

  // Logo da clínica (URL relativa ou absoluta)
  logoUrl: "/images/logo/logo-barra-da-tijuca-1763412070860.webp",

  // Estatísticas
  anosExperiencia: "20",
  implantesRealizados: "1400",
  avaliacaoGoogle: "4,9", // Avaliação no Google (ex: "4,9")

  // Horário de atendimento
  horarioAtendimento: {
    semana: "Segunda a Sexta: 9h às 18h",
    sabado: "", // Deixe vazio para não exibir
  },

  // CNPJ da clínica
  cnpj: "29.831.037/0001-43", // CNPJ no formato 00.000.000/0000-00

  // Google Maps
  googleMapsUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3657.696416426994!2d-46.763243!3d-23.543419!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ceff41a3146087%3A0xef52f4f20614e659!2sOdonto%20Alberti%20Prime%20-%20Dentista%20na%20Vila%20Yara%2FOsasco%20-%20Implante%20Dent%C3%A1rio%20-%20Pr%C3%B3teses%20-%20Est%C3%A9tica%20Dental!5e0!3m2!1spt-BR!2sus!4v1763412291918!5m2!1spt-BR!2sus%22%20width=%22600%22%20height=%22450%22%20style=%22border:0;%22%20allowfullscreen=%22%22%20loading=%22lazy%22%20referrerpolicy=%22no-referrer-when-downgrade", // URL do embed do Google Maps

  // Informações dos médicos (até 2)
  doctors: [
    {
      nomeCompleto: "Dra. Cristiane Alberti",
      cro: "CRO/SP 98487",
      formacao: "Minha formação inclui instituições renomadas como o Hospital Israelita Albert Einstein e a APCD-SJC ",
      experiencia: "Há mais de 15 anos me dedico a transformar sorrisos com precisão e cuidado. Acredito que cada paciente merece um atendimento humanizado e personalizado, com tratamentos modernos e eficazes. ",
      atendimento: "",
    }
  ] as DoctorInfo[],

  // Só dígitos, com DDI 55
  whatsappE164: "5511994235612",

  // IDs do formulário/canal
  canalId: "aRYYKHAZQLndKUDN",
  formId: "54b01719", // ID do formulário usado na planilha/AppScript
  formName: "Acompanhamento", // Nome do formulário usado na planilha/AppScript

  // Webhook URL para envio de formulários
  webhookUrl: "https://script.google.com/macros/s/AKfycbzxOzoHXW0Aj3lZujyWVR4JzSBvv98rxM4fHmnJIcxWr19GR7fbY0Qe8LqFhFPlI1kECQ/exec",

  // Google Tag Manager ID
  gtmId: "GTM-T75MM5DP",

  // Google Ads (sem GTM)
  googleAds: {
    conversionId: "AW-700923237",
    conversionLabel: "Qjg0CPHd6sAbEOX6nM4C",
  } as GoogleAdsConfig,
};
