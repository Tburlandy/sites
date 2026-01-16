import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { injectGTM } from "./vite-plugin-gtm";
import { injectSiteUrl } from "./vite-plugin-siteurl";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/pagina/',
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      ".ngrok-free.app",
      ".ngrok.io",
      "localhost",
    ],
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  },
  plugins: [
    react(), 
    injectGTM(),
    injectSiteUrl(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
