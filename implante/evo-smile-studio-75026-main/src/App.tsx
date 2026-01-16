import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
import Home from "./pages/Home";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";
// COMENTADO: Google Ads tag manual - usando apenas GTM agora
// import { GoogleAdsTag } from "@/analytics/GoogleAdsTag";

const DevStudio = lazy(() => import("./pages/DevStudio"));

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* COMENTADO: Google Ads tag manual - usando apenas GTM agora */}
        {/* <GoogleAdsTag /> */}
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/obrigado" element={<ThankYou />} />
            <Route
              path="/dev/studio"
              element={
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
                  <DevStudio />
                </Suspense>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
