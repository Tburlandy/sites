import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageCircle } from "lucide-react";
import ContactForm from "./ContactForm";

interface WhatsAppPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const WhatsAppPopup = ({ isOpen, onClose }: WhatsAppPopupProps) => {
  const handleSuccess = (nome: string, telefone: string, assunto: string) => {
    const telefoneNumeros = telefone.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Olá, sou ${nome} e preciso de ajuda em ${assunto}. Vim pelo Google.`
    );
    window.location.href = `https://wa.me/55${telefoneNumeros}?text=${message}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <MessageCircle className="w-6 h-6 text-secondary" />
            Falar pelo WhatsApp
          </DialogTitle>
          <DialogDescription>
            Preencha seus dados para iniciar a conversa
          </DialogDescription>
        </DialogHeader>

        <ContactForm formOrigin="popup_whatsapp" onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppPopup;