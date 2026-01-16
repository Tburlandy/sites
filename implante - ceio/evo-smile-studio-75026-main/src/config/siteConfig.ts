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
  
  cidade: "Niterói",
  uf: "RJ",
  nomeClinica: "CEIO implantes",
  enderecoLinha1: "R. Dr. Paulo César, 337 - Sala 101 ",
  enderecoLinha2: "Santa Rosa, Niterói - RJ, 24230-240",
  cep: "24230-240",
  preposicao: "em", // Preposição para "em Barra da Tijuca" e "Estamos em..."

  // Logo da clínica (URL relativa ou absoluta)
  logoUrl: "/images/logo/logo-barra-da-tijuca-1764352986676.webp",

  // Estatísticas
  anosExperiencia: "30",
  implantesRealizados: "10000",
  avaliacaoGoogle: "5", // Avaliação no Google (ex: "4,9")

  // Horário de atendimento
  horarioAtendimento: {
    semana: "Quinta 3 Sexta: 9h às 19h",
    sabado: "", // Deixe vazio para não exibir
  },

  // CNPJ da clínica
  cnpj: "35.807.027/0001-75", // CNPJ no formato 00.000.000/0000-00

  // Google Maps
  googleMapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.4146400333934!2d-43.10366140000001!3d-22.898072300000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9983f1655afc6b%3A0xe339063950137e16!2sDENTISTA%20NITER%C3%93I%20-%20Dr.%20Wanderson%20Lug%C3%A3o%20Cl%C3%ADnica%20CEIO%20-%20centro%20especializado%20em%20implantes%20e%20ortodontia!5e0!3m2!1spt-BR!2sbr!4v1764353105318!5m2!1spt-BR!2sbr%22%20width=%22600%22%20height=%22450%22%20style=%22border:0;%22%20allowfullscreen=%22%22%20loading=%22lazy%22%20referrerpolicy=%22no-referrer-when-downgrade", // URL do embed do Google Maps

  // Informações dos médicos (até 2)
  doctors: [
    {
      nomeCompleto: "Dr. Wanderson Lugão",
      cro: "CRO/RJ 21.871",
      formacao: "Dr. Wanderson é um especialista em implantes dentários em Niterói reconhecido por sua meticulosa atenção aos detalhes e seu compromisso com a excelência em odontologia. \n\n",
      experiencia: "Com mais de 30 anos de experiência, o Dr. Wanderson e sua equipe de dentistas vêm desenvolvendo um excelente trabalho de reabilitação oral. Especialistas na área de implante dentário, aparelho ortodôntico, estética, clareamento dental, e mais.\n\nConheça nossa clínica humanizada e atendimento ímpar agendando um horário para sua avaliação.",
      atendimento: "",
    }
  ] as DoctorInfo[],

  // Só dígitos, com DDI 55
  whatsappE164: "552126119991",

  // IDs do formulário/canal
  canalId: "aSX86ORj0WDQmpOP",
  formId: "54b01719",
  formName: "Acompanhamento",

  // Webhook URL para envio de formulários
  webhookUrl: "https://script.google.com/macros/s/AKfycbyKuCaVtJ8L33Oc6Af1lj17bhfYurwQUxYS9niKo0bLSyirJSpdyQEzUtpp0LOJCvor/exec",

  // Google Tag Manager ID
  gtmId: " GTM-TQ4LTD4N",

  // Google Ads (sem GTM)
  googleAds: {
    conversionId: "",
    conversionLabel: "",
  } as GoogleAdsConfig,
};
