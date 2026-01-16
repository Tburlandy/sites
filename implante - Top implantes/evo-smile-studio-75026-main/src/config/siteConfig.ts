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
  // URL base do site (sem barra final)
  siteUrl: "https://topimplantes.com",
  
  cidade: "Barra da Tijuca",
  uf: "RJ",
  nomeClinica: "Top Implantes",
  enderecoLinha1: "Av. Alm. Júlio de Sá Bierrenbach, 65 - Bloco 4, Sala 705 ",
  enderecoLinha2: "Barra da Tijuca, Rio de Janeiro - RJ",
  cep: "22775-028",
  preposicao: "na", // Preposição para "em Barra da Tijuca" e "Estamos em..."

  // Logo da clínica (URL relativa ou absoluta)
  logoUrl: "/images/logo/logo-barra-da-tijuca-1763149014597.webp",

  // Estatísticas
  anosExperiencia: "12",
  implantesRealizados: "15000",
  avaliacaoGoogle: "5", // Avaliação no Google (ex: "4,9")

  // Horário de atendimento
  horarioAtendimento: {
    semana: "Segunda a Sexta: 9h às 18h",
    sabado: "", // Deixe vazio para não exibir
  },

  // CNPJ da clínica
  cnpj: "13.380.293/0001-21", // CNPJ no formato 00.000.000/0000-00

  // Google Maps
  googleMapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3673.4133503493263!2d-43.3695816!3d-22.971822799999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9bda49454ae2c7%3A0x84d2e76bc05672a2!2sTop%20Implantes%20Odontologia%20-%20Dentista%20Rio%20de%20Janeiro!5e0!3m2!1spt-BR!2sbr!4v1763148532390!5m2!1spt-BR!2sbr", // URL do embed do Google Maps

  // Informações dos médicos (até 2)
  doctors: [
    {
      nomeCompleto: "Dr. Paulo Topfer",
      cro: "CRO/RJ 36084",
      formacao: "Graduado em 1994 pela UNISA SP.\n\nPós Graduado em Prótese Dentária em 2007 pela UNICSUL SP.\n\nPossui uma vasta lista de cursos na área de reabilitação oral e frequenta os principais congressos internacionais de Odontologia realizados no Brasil.",
      experiencia: "Membro ABOD (Associação Brasileira de Odontologia Digital).\n\nMembro da SBOE (Sociedade Brasileira de Odontologia Estética).",
      atendimento: "",
    },
    {
      nomeCompleto: "Dr. Marcus Campanha",
      cro: "CRO/RJ 33322",
      formacao: "Graduado em 1994 pela UNISA SP.\n\nPós Graduado em Prótese Dentária em 2007 pela UNICSUL SP.\n\nPossui uma vasta lista de cursos na área de reabilitação oral e frequenta os principais congressos internacionais de Odontologia realizados no Brasil.",
      experiencia: "Membro ABOD (Associação Brasileira de Odontologia Digital).\n\nMembro da SBOE (Sociedade Brasileira de Odontologia Estética).\n",
      atendimento: "",
    }
  ] as DoctorInfo[],

  // Só dígitos, com DDI 55
  whatsappE164: "5521973390029",

  // IDs do formulário/canal
  canalId: "aRS-1CUhmYer0CMz",
  formId: "54b01719",
  formName: "Acompanhamento",

  // Webhook URL para envio de formulários
  webhookUrl: "https://script.google.com/macros/s/AKfycbyKQUn40aBVdhwYNhhgPTFmk6JCiL4UFSBgyq_M0r0dUy0Rh-x7JvJ7Z2dBGqS4aha3/exec",

  // Google Tag Manager ID
  gtmId: "GTM-M2FVJM4H",

  // Google Ads (sem GTM)
  googleAds: {
    conversionId: "",
    conversionLabel: "",
  } as GoogleAdsConfig,
};
