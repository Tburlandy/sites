import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowWeWork from "@/components/HowWeWork";
import Team from "@/components/Team";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppPopup from "@/components/WhatsAppPopup";

const Index = () => {
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  useEffect(() => {
    // GTM Event quando a página carrega
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: "page_view",
      });
    }
  }, []);

  const handleWhatsAppClick = () => {
    setIsWhatsAppOpen(true);
    // GTM Event
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: "cta_whatsapp_click",
      });
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LegalService",
        "@id": "https://seusite.com/#legalservice",
        "name": "Advocacia Família",
        "description": "Escritório especializado em Direito de Família e Sucessões em [Cidade/UF]",
        "url": "https://seusite.com",
        "areaServed": {
          "@type": "City",
          "name": "[Cidade]",
        },
        "knowsAbout": [
          "Divórcio",
          "Pensão Alimentícia",
          "Inventário",
          "Guarda de Filhos",
          "União Estável",
          "Curatela",
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://seusite.com/#faqpage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Inventário pode ser feito em cartório?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim, quando não há menores de idade, incapazes ou testamento, e todos os herdeiros estão de acordo, o inventário pode ser feito de forma extrajudicial em cartório, sendo mais rápido e econômico.",
            },
          },
          {
            "@type": "Question",
            "name": "Quando posso revisar a pensão alimentícia?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A revisão pode ser solicitada quando houver mudança significativa na situação financeira do alimentante (quem paga) ou do alimentado (quem recebe), seja para aumentar, diminuir ou exonerar a pensão.",
            },
          },
          {
            "@type": "Question",
            "name": "Qual a diferença entre guarda compartilhada e unilateral?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Na guarda compartilhada, ambos os pais participam ativamente das decisões importantes sobre a vida dos filhos, mesmo que a criança resida com apenas um deles. Na guarda unilateral, apenas um genitor detém a guarda, e o outro tem direito de visitas.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Advogado de Família em [Cidade] — Divórcio, Pensão e Inventário</title>
        <meta
          name="description"
          content="Escritório especializado em Direito de Família em [Cidade/UF]. Divórcio, pensão, inventário, guarda e união estável. Atendimento ético e humanizado."
        />
        <link rel="canonical" href="https://seusite.com/" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Advogado de Família em [Cidade] — Divórcio, Pensão e Inventário" />
        <meta property="og:description" content="Escritório especializado em Direito de Família em [Cidade/UF]. Atendimento ético e humanizado." />
        <meta property="og:url" content="https://seusite.com/" />
        
        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>

        {/* GTM - TODO: Substituir GTM-XXXX pelo ID real */}
        <script>{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-XXXX');
        `}</script>
      </Helmet>

      {/* GTM noscript - TODO: Substituir GTM-XXXX */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-XXXX"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        ></iframe>
      </noscript>

      <div className="min-h-screen">
        <Header onWhatsAppClick={handleWhatsAppClick} />
        <main>
          <Hero onWhatsAppClick={handleWhatsAppClick} />
          <Services />
          <HowWeWork />
          <Team />
          <FAQ />
          <Contact />
        </main>
        <Footer />
        <WhatsAppPopup
          isOpen={isWhatsAppOpen}
          onClose={() => setIsWhatsAppOpen(false)}
        />
      </div>
    </>
  );
};

export default Index;