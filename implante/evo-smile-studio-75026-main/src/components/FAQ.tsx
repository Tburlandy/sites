import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Dói para colocar implante? E a recuperação?",
    answer: "O procedimento é realizado com anestesia local, sem dor. A recuperação costuma ser tranquila, com desconforto mínimo controlado por medicação.",
  },
  {
    question: "Dá para sair com dentes no mesmo dia?",
    answer: "Sim! A carga imediata permite que você saia com dentes provisórios no mesmo dia do procedimento, quando indicada pelo profissional após avaliação.",
  },
  {
    question: "Tenho pouco osso, é possível fazer implante?",
    answer: "Sim. Técnicas de enxerto ósseo e regeneração permitem viabilizar implantes mesmo em casos de pouco volume ósseo. Avaliamos cada caso individualmente.",
  },
  {
    question: "Qual a diferença entre protocolo/All-on-4 e implante unitário?",
    answer: "Implante unitário substitui um dente. Protocolo/All-on-4/All-on-6 são próteses fixas sobre 4 a 6 implantes, ideais para quem perdeu todos ou muitos dentes de uma arcada.",
  },
  {
    question: "Quanto tempo dura um implante?",
    answer: "Com higiene adequada e acompanhamento regular, implantes podem durar décadas ou a vida toda. A taxa de sucesso ultrapassa 95%.",
  },
  {
    question: "Como é o cuidado com o implante?",
    answer: "Cuide como se fosse dente natural: escova, fio dental e visitas regulares ao dentista. Simples e eficaz.",
  },
  {
    question: "Quais são as formas de pagamento?",
    answer: "Oferecemos diversas opções de parcelamento e facilitamos o investimento no seu sorriso. Consulte-nos para conhecer as condições.",
  },
];

export const FAQ = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12 md:mb-16 animate-slide-up">
          <h2 className="mb-4">Perguntas Frequentes</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Dúvidas mais comuns sobre implantes dentários
          </p>
        </div>

        <div className="max-w-3xl mx-auto animate-fade-in">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border-none shadow-soft rounded-xl px-6 hover-lift"
              >
                <AccordionTrigger className="text-left text-base md:text-lg font-semibold py-5 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
