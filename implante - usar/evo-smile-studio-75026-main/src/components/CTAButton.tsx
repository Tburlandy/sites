import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CTAButtonProps {
  variant?: "primary" | "secondary";
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  placement: string;
}

export const CTAButton = ({
  variant = "primary",
  onClick,
  children,
  className,
  placement,
}: CTAButtonProps) => {
  const handleClick = () => {
    // GTM event
    if (window.dataLayer) {
      window.dataLayer.push({
        event: "cta_whatsapp_click",
        placement,
      });
    }
    onClick();
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        size="lg"
        onClick={handleClick}
        className={cn(
          "relative min-h-[56px] px-10 text-base md:text-lg font-semibold transition-all duration-300 overflow-hidden group",
          variant === "primary" &&
            "bg-gradient-premium text-white hover:shadow-glow",
          variant === "secondary" &&
            "bg-gradient-accent text-accent-foreground hover:shadow-accent",
          className
        )}
      >
        {/* Shine Effect on Hover */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
        
        <span className="relative z-10">{children}</span>
      </Button>
    </motion.div>
  );
};
