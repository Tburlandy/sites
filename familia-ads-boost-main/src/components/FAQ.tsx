import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Inventário pode ser feito em cartório?",
    answer: "Sim, quando não há menores de idade, incapazes ou testamento, e todos os herdeiros estão de acordo, o inventário pode ser feito de forma extrajudicial em cartório, sendo mais rápido e econômico.",
  },
  {
    question: "Quando posso revisar a pensão alimentícia?",
    answer: "A revisão pode ser solicitada quando houver mudança significativa na situação financeira do alimentante (quem paga) ou do alimentado (quem recebe), seja para aumentar, diminuir ou exonerar a pensão.",
  },
  {
    question: "Qual a diferença entre guarda compartilhada e unilateral?",
    answer: "Na guarda compartilhada, ambos os pais participam ativamente das decisões importantes sobre a vida dos filhos, mesmo que a criança resida com apenas um deles. Na guarda unilateral, apenas um genitor detém a guarda, e o outro tem direito de visitas.",
  },
  {
    question: "Preciso de advogado para fazer divórcio?",
    answer: "Sim, a presença de advogado é obrigatória em qualquer tipo de divórcio. No divórcio consensual sem filhos menores e sem bens a partilhar, é possível fazer em cartório, mas ainda assim com assistência de advogado.",
  },
  {
    question: "Quanto tempo demora um processo de família?",
    answer: "O tempo varia conforme a complexidade e o tipo de ação. Processos consensuais podem ser resolvidos em meses, enquanto processos litigiosos podem levar de 1 a 2 anos ou mais, dependendo do caso e da vara judicial.",
  },
];

const FAQ = () => {
  return (
    <section id="perguntas" className="py-24 px-4 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--border)) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-gold uppercase tracking-wider">FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent mb-6">
            Perguntas Frequentes
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Tire suas principais dúvidas sobre Direito de Família e Sucessões
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="group bg-gradient-card border border-border/40 hover:border-gold/30 rounded-2xl px-8 transition-all duration-300 hover:shadow-medium overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
              <AccordionTrigger className="relative text-left font-bold text-lg text-card-foreground hover:text-primary py-6 transition-colors duration-300">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="relative text-muted-foreground leading-relaxed text-base pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;