import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { applyPhoneMask } from "@/lib/phoneMask";
import { getUTMParams, getDeviceType } from "@/lib/tracking";

interface ContactFormProps {
  formOrigin: "principal" | "popup_whatsapp";
  onSuccess?: (nome: string, telefone: string, assunto: string) => void;
}

const WEBHOOK_URL = "https://seu-webhook.com/endpoint"; // TODO: Substituir pela URL real

const ContactForm = ({ formOrigin, onSuccess }: ContactFormProps) => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [assunto, setAssunto] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = applyPhoneMask(e.target.value);
    setTelefone(masked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim() || !telefone.trim() || !assunto) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const utmParams = getUTMParams();
      const now = new Date();

      const formData = new URLSearchParams({
        nome: nome.trim(),
        telefone: telefone.trim(),
        assunto,
        ...utmParams,
        device: getDeviceType(),
        Forma_de_Contato: formOrigin === "principal" ? "Formulário" : "Popup WhatsApp",
        form_id: "5",
        form_name: "Captação Família",
        data: now.toLocaleDateString("pt-BR"),
        horario: now.toLocaleTimeString("pt-BR"),
      });

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) throw new Error("Erro ao enviar");

      // GTM Event
      if (typeof window !== "undefined" && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: "lead_submit",
          form_origin: formOrigin,
        });
      }

      if (onSuccess) {
        onSuccess(nome, telefone, assunto);
      } else {
        window.location.href = "/obrigado";
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nome">Nome completo *</Label>
        <Input
          id="nome"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Seu nome"
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="telefone">Telefone *</Label>
        <Input
          id="telefone"
          type="tel"
          value={telefone}
          onChange={handleTelefoneChange}
          placeholder="(00) 00000-0000"
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="assunto">Assunto *</Label>
        <Select value={assunto} onValueChange={setAssunto} required>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecione o assunto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Divórcio">Divórcio</SelectItem>
            <SelectItem value="Pensão">Pensão</SelectItem>
            <SelectItem value="Inventário">Inventário</SelectItem>
            <SelectItem value="Guarda/Convivência">Guarda/Convivência</SelectItem>
            <SelectItem value="União Estável">União Estável</SelectItem>
            <SelectItem value="Curatela">Curatela</SelectItem>
            <SelectItem value="Outro">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Enviando..." : "Solicitar contato agora"}
      </Button>
    </form>
  );
};

export default ContactForm;