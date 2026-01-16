import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { ClinicStructure } from "@/components/ClinicStructure";
import { Dentist } from "@/components/Dentist";
import { Process } from "@/components/Process";
import { FAQ } from "@/components/FAQ";
import { Location } from "@/components/Location";
import { Footer } from "@/components/Footer";
import { ContactPopup } from "@/components/ContactPopup";
import { SmileGallery } from "@/components/SmileGallery";
import { VideoTestimonials } from "@/components/VideoTestimonials";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { SITE_CONFIG } from "@/config/siteConfig";
import whatsappIcon from "@/assets/whatsapp-icon.png";

// Extend Window interface for dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}

const Home = () => {
  const [popupOpen, setPopupOpen] = useState(false);

  // Formatar telefone para exibição (remover DDI 55 e formatar)
  const formatPhoneForDisplay = (e164: string) => {
    const numbers = e164.replace(/^55/, "").replace(/\D/g, "");
    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    }
    return numbers;
  };

  // Extrair horários do siteConfig
  const parseHours = (horarioStr: string) => {
    const match = horarioStr.match(/(\d{1,2})h.*?(\d{1,2})h/);
    if (match) {
      return { opens: `${match[1].padStart(2, '0')}:00`, closes: `${match[2].padStart(2, '0')}:00` };
    }
    return { opens: "09:00", closes: "18:00" };
  };

  const semanaHours = parseHours(SITE_CONFIG.horarioAtendimento.semana);
  const sabadoHours = SITE_CONFIG.horarioAtendimento.sabado 
    ? parseHours(SITE_CONFIG.horarioAtendimento.sabado)
    : null;

  const fullUrl = SITE_CONFIG.siteUrl + import.meta.env.BASE_URL.replace(/\/$/, '');
  const logoUrl = SITE_CONFIG.logoUrl ? `${fullUrl}${SITE_CONFIG.logoUrl.startsWith('/') ? '' : '/'}${SITE_CONFIG.logoUrl}` : `${fullUrl}/favicon.ico`;

  const jsonLdSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "Dentist",
      name: SITE_CONFIG.nomeClinica,
      image: logoUrl,
      "@id": fullUrl,
      url: fullUrl,
      telephone: formatPhoneForDisplay(SITE_CONFIG.whatsappE164),
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE_CONFIG.enderecoLinha1,
        addressLocality: SITE_CONFIG.cidade,
        addressRegion: SITE_CONFIG.uf,
        postalCode: SITE_CONFIG.cep,
        addressCountry: "BR",
      },
      geo: {
        "@type": "GeoCoordinates",
        // Coordenadas de Barra da Tijuca (aproximadas do endereço)
        latitude: -23.0065,
        longitude: -43.3653,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: semanaHours.opens,
          closes: semanaHours.closes,
        },
        ...(sabadoHours ? [{
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: sabadoHours.opens,
          closes: sabadoHours.closes,
        }] : []),
      ],
      priceRange: "$$",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Dói para colocar implante?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "O procedimento é realizado com anestesia local, sem dor. Para pacientes com ansiedade, oferecemos anestesia. A recuperação costuma ser tranquila, com desconforto mínimo controlado por medicação.",
          },
        },
        {
          "@type": "Question",
          name: "Quanto tempo dura um implante?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Com higiene adequada e acompanhamento regular, implantes podem durar décadas ou a vida toda. A taxa de sucesso ultrapassa 95%.",
          },
        },
        {
          "@type": "Question",
          name: "Tenho pouco osso, é possível fazer implante?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sim. Técnicas de enxerto ósseo e regeneração permitem viabilizar implantes mesmo em casos de pouco volume ósseo. Avaliamos cada caso individualmente.",
          },
        },
      ],
    },
  ];

  return (
    <>
      <SEO
        title={`Implante Dentário ${SITE_CONFIG.preposicao} ${SITE_CONFIG.cidade} — Cirurgia Guiada, Carga Imediata e Prótese Protocolo | ${SITE_CONFIG.nomeClinica}`}
        description={`Implante dentário ${SITE_CONFIG.preposicao} ${SITE_CONFIG.cidade} com especialistas. Sem dor, com anestesia, estacionamento perto. Carga imediata, All-on-4 e implante unitário. Agende sua avaliação.`}
        canonical={SITE_CONFIG.siteUrl + import.meta.env.BASE_URL}
        jsonLd={jsonLdSchemas}
      />

      <Navbar onOpenPopup={() => setPopupOpen(true)} />
      
      <main>
        <Hero onOpenPopup={() => setPopupOpen(true)} />
        <section id="servicos">
          <Benefits />
        </section>
        <SmileGallery onOpenPopup={() => setPopupOpen(true)} />
        <Dentist />
        <VideoTestimonials onOpenPopup={() => setPopupOpen(true)} />
        <ClinicStructure />
        <WhyChooseUs />
        <section id="como-funciona">
          <Process />
        </section>
        <section id="faq">
          <FAQ />
        </section>
        <section id="contato">
          <Location onOpenPopup={() => setPopupOpen(true)} />
          <section className="py-16 md:py-24 bg-gradient-hero">
            <div className="container px-4 mx-auto">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="mb-4 text-3xl md:text-4xl font-bold text-gray-900">Agende sua avaliação</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Entre em contato conosco e agende sua consulta gratuita
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => {
                      if (window.dataLayer) {
                        window.dataLayer.push({
                          event: "cta_whatsapp_click",
                          placement: "contact_section_primary",
                        });
                      }
                      setPopupOpen(true);
                    }}
                    className="w-full sm:w-auto px-8 py-3 bg-[#0ea5e9] text-white font-medium rounded-lg hover:bg-[#0284c7] transition-all duration-300 text-base shadow-[0_4px_14px_rgba(14,165,233,0.4)]"
                  >
                    Agendar avaliação gratuita
                  </button>
                  <button
                    onClick={() => {
                      if (window.dataLayer) {
                        window.dataLayer.push({
                          event: "cta_whatsapp_click",
                          placement: "contact_section_whatsapp",
                        });
                      }
                      setPopupOpen(true);
                    }}
                    className="w-full sm:w-auto px-8 py-3 bg-white text-[#475569] font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 border-2 border-[#25D366] text-base shadow-sm flex items-center gap-2 justify-center"
                  >
                    <img 
                      src={whatsappIcon} 
                      alt="WhatsApp" 
                      className="w-4 h-4" 
                      style={{ filter: 'brightness(0) saturate(100%) invert(64%) sepia(57%) saturate(3705%) hue-rotate(93deg) brightness(93%) contrast(86%)' }} 
                    />
                    Fale no WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </section>
        </section>
        <Footer onOpenPopup={() => setPopupOpen(true)} />
      </main>

      <ContactPopup open={popupOpen} onOpenChange={setPopupOpen} />
      <FloatingWhatsApp onOpenPopup={() => setPopupOpen(true)} />
    </>
  );
};

export default Home;
