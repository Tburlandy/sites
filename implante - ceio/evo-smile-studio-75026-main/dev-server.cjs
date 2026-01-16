const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configurar multer para upload temporário
const upload = multer({ dest: "temp-uploads/" });

// Ler SITE_CONFIG
async function getSiteConfig() {
  try {
    const configPath = path.join(__dirname, "src", "config", "siteConfig.ts");
    const configContent = await fs.readFile(configPath, "utf-8");
    
    // Extrair valores básicos do config (simples parsing)
    const cidadeMatch = configContent.match(/cidade:\s*"([^"]+)"/);
    const nomeClinicaMatch = configContent.match(/nomeClinica:\s*"([^"]+)"/);
    
    return {
      cidade: cidadeMatch ? cidadeMatch[1] : "Maricá",
      nomeClinica: nomeClinicaMatch ? nomeClinicaMatch[1] : "Evo Smile Studio",
    };
  } catch (error) {
    console.error("Erro ao ler SITE_CONFIG:", error);
    return {
      cidade: "Maricá",
      nomeClinica: "Evo Smile Studio",
    };
  }
}

// Slugify
function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Gerar nome de arquivo
function generateFileName(sectionKey, mediaType, cidade, descricao = "") {
  const cidadeSlug = slugify(cidade);
  const descSlug = descricao ? slugify(descricao) : sectionKey;
  const ext = mediaType === "image" ? "webp" : "mp4";
  return `${mediaType === "image" ? "implante-dentario" : "video-implante-dentario"}-${cidadeSlug}-${descSlug}-${Date.now()}.${ext}`;
}

// Gerar path baseado na seção
function getMediaPath(sectionKey, fileName, mediaType) {
  const folderMap = {
    smilesTransformed: "smiles",
    doctorHighlight: "doctor",
    realStories: "stories",
    clinicStructure: "clinic",
  };
  
  const folder = folderMap[sectionKey] || "other";
  const baseFolder = mediaType === "image" ? "images" : "videos";
  return path.join("public", baseFolder, folder, fileName);
}

// Gerar alt text
function generateAltText(sectionKey, categoria, descricao, cidade) {
  if (sectionKey === "smilesTransformed") {
    return descricao 
      ? `${descricao} - Antes e depois de implante dentário em ${cidade}`
      : `Antes e depois de paciente tratado com implante dentário em ${cidade}`;
  }
  
  if (sectionKey === "doctorHighlight") {
    return descricao
      ? `${descricao} - Dentista especialista em implante dentário em ${cidade}`
      : `Dentista especialista em implante dentário em ${cidade}`;
  }
  
  if (sectionKey === "realStories") {
    return descricao 
      ? `${descricao} - Depoimento de paciente sobre implante dentário em ${cidade}`
      : `Depoimento de paciente sobre implante dentário em ${cidade}`;
  }
  
  if (sectionKey === "clinicStructure") {
    return descricao
      ? `${descricao} - Estrutura da clínica de implante dentário em ${cidade}`
      : `Estrutura da clínica de implante dentário em ${cidade}`;
  }
  
  return `Mídia relacionada a implante dentário em ${cidade}`;
}

// Ler mediaSections.json
async function readMediaSections() {
  const filePath = path.join(__dirname, "src", "content", "mediaSections.json");
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Erro ao ler mediaSections.json:", error);
    return {
      smilesTransformed: [],
      doctorHighlight: [],
      realStories: [],
      clinicStructure: [],
    };
  }
}

// Salvar mediaSections.json
async function saveMediaSections(data) {
  const filePath = path.join(__dirname, "src", "content", "mediaSections.json");
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// Processar imagem com sharp
async function processImage(inputPath, outputPath, maxWidth) {
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  
  let width = metadata.width;
  let height = metadata.height;
  
  if (width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }
  
  await image
    .resize(width, height, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toFile(outputPath);
  
  return { width, height };
}

// POST /api/media/upload
app.post("/api/media/upload", upload.fields([
  { name: "file", maxCount: 1 },
  { name: "poster", maxCount: 1 },
]), async (req, res) => {
  try {
    const { sectionKey, mediaType, description } = req.body;
    const file = req.files?.file?.[0];
    const posterFile = req.files?.poster?.[0];
    
    if (!file || !sectionKey || !mediaType) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }
    
    const siteConfig = await getSiteConfig();
    const fileName = generateFileName(sectionKey, mediaType, siteConfig.cidade, description);
    const outputPath = getMediaPath(sectionKey, fileName, mediaType);
    const outputDir = path.dirname(outputPath);
    
    // Criar diretório se não existir
    await fs.mkdir(outputDir, { recursive: true });
    
    let posterPath = null;
    
    if (mediaType === "image") {
      // Processar imagem
      const maxWidth = sectionKey === "doctorHighlight" ? 1400 : 1000;
      await processImage(file.path, outputPath, maxWidth);
      
      // Processar poster se fornecido
      if (posterFile) {
        const posterFileName = fileName.replace(".webp", "-poster.webp");
        const posterOutputPath = getMediaPath(sectionKey, posterFileName, "image");
        await processImage(posterFile.path, posterOutputPath, 800);
        posterPath = `/images/${path.basename(path.dirname(posterOutputPath))}/${posterFileName}`;
      }
    } else {
      // Para vídeo, apenas mover o arquivo
      await fs.copyFile(file.path, outputPath);
      
      // Processar poster se fornecido
      if (posterFile) {
        const posterFileName = fileName.replace(".mp4", "-poster.webp");
        const posterOutputPath = getMediaPath(sectionKey, posterFileName, "image");
        await processImage(posterFile.path, posterOutputPath, 800);
        posterPath = `/images/${path.basename(path.dirname(posterOutputPath))}/${posterFileName}`;
      }
    }
    
    // Limpar arquivo temporário
    await fs.unlink(file.path);
    if (posterFile) {
      await fs.unlink(posterFile.path);
    }
    
    // Criar MediaItem
    const mediaItem = {
      id: uuidv4(),
      type: mediaType,
      src: `/${mediaType === "image" ? "images" : "videos"}/${path.basename(path.dirname(outputPath))}/${fileName}`,
      alt: generateAltText(sectionKey, "", description || "", siteConfig.cidade),
      description: description || undefined,
      poster: posterPath || undefined,
      order: 0,
    };
    
    // Atualizar mediaSections.json
    const mediaSections = await readMediaSections();
    
    if (sectionKey === "doctorHighlight") {
      // Permitir até 2 médicos
      const section = mediaSections.doctorHighlight || [];
      if (section.length >= 2) {
        // Se já tem 2, substituir o último
        section[1] = mediaItem;
      } else {
        // Adicionar novo médico
        mediaItem.order = section.length;
        section.push(mediaItem);
      }
      mediaSections.doctorHighlight = section;
    } else if (sectionKey === "clinicStructure") {
      // Permitir múltiplas imagens (carrossel)
      const section = mediaSections.clinicStructure || [];
      mediaItem.order = section.length;
      section.push(mediaItem);
      mediaSections.clinicStructure = section;
    } else {
      // Adicionar ao final
      const section = mediaSections[sectionKey] || [];
      mediaItem.order = section.length;
      section.push(mediaItem);
      mediaSections[sectionKey] = section;
    }
    
    await saveMediaSections(mediaSections);
    
    res.json(mediaItem);
  } catch (error) {
    console.error("Erro no upload:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/media/:sectionKey/:id
app.delete("/api/media/:sectionKey/:id", async (req, res) => {
  try {
    const { sectionKey, id } = req.params;
    
    const mediaSections = await readMediaSections();
    const section = mediaSections[sectionKey];
    
    if (!section) {
      return res.status(404).json({ error: "Seção não encontrada" });
    }
    
    const index = section.findIndex((item) => item.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Item não encontrado" });
    }
    
    // Remover arquivo físico
    const item = section[index];
    const filePath = path.join(__dirname, "public", item.src);
    try {
      await fs.unlink(filePath);
    } catch (e) {
      console.warn("Erro ao remover arquivo:", e);
    }
    
    // Remover poster se existir
    if (item.poster) {
      const posterPath = path.join(__dirname, "public", item.poster);
      try {
        await fs.unlink(posterPath);
      } catch (e) {
        console.warn("Erro ao remover poster:", e);
      }
    }
    
    // Remover do array e reordenar
    section.splice(index, 1);
    section.forEach((item, idx) => {
      item.order = idx;
    });
    
    await saveMediaSections(mediaSections);
    
    res.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/media
app.get("/api/media", async (req, res) => {
  try {
    const mediaSections = await readMediaSections();
    res.json(mediaSections);
  } catch (error) {
    console.error("Erro ao ler mídias:", error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/media/:sectionKey/:id/transform
app.patch("/api/media/:sectionKey/:id/transform", async (req, res) => {
  try {
    const { sectionKey, id } = req.params;
    const { zoom, positionX, positionY } = req.body;
    
    if (zoom === undefined || positionX === undefined || positionY === undefined) {
      return res.status(400).json({ error: "Campos zoom, positionX e positionY são obrigatórios" });
    }
    
    const mediaSections = await readMediaSections();
    const section = mediaSections[sectionKey];
    
    if (!section) {
      return res.status(404).json({ error: "Seção não encontrada" });
    }
    
    const itemIndex = section.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item não encontrado" });
    }
    
    // Atualizar configurações de transformação
    section[itemIndex].zoom = zoom;
    section[itemIndex].positionX = positionX;
    section[itemIndex].positionY = positionY;
    
    await saveMediaSections(mediaSections);
    
    res.json({ success: true, item: section[itemIndex] });
  } catch (error) {
    console.error("Erro ao salvar transformação:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/logo/upload
app.post("/api/logo/upload", upload.single("logo"), async (req, res) => {
  try {
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: "Arquivo não fornecido" });
    }
    
    const siteConfig = await getSiteConfig();
    const fileName = `logo-${siteConfig.cidade.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.webp`;
    const outputPath = path.join("public", "images", "logo", fileName);
    const outputDir = path.dirname(outputPath);
    
    // Criar diretório se não existir
    await fs.mkdir(outputDir, { recursive: true });
    
    // Processar e salvar logo
    await processImage(file.path, outputPath, 300); // Max width 300px para logo
    
    // Limpar arquivo temporário
    await fs.unlink(file.path);
    
    const logoUrl = `/images/logo/${fileName}`;
    
    res.json({ logoUrl });
  } catch (error) {
    console.error("Erro no upload da logo:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/config/save
app.post("/api/config/save", async (req, res) => {
  try {
    const config = req.body;
    
    if (!config) {
      return res.status(400).json({ error: "Configuração não fornecida" });
    }
    
    const configPath = path.join(__dirname, "src", "config", "siteConfig.ts");
    
    // Função para extrair URL do embed do Google Maps
    // Aceita tanto URL direta quanto HTML completo do iframe
    const extractGoogleMapsUrl = (input) => {
      if (!input || input.trim() === "") {
        return "";
      }

      const trimmed = String(input).trim();

      // Se já é uma URL direta (começa com https://www.google.com/maps/embed)
      if (trimmed.startsWith("https://www.google.com/maps/embed")) {
        // Remove parâmetros extras que não são parte da URL (width, height, style, etc)
        const urlMatch = trimmed.match(/https:\/\/www\.google\.com\/maps\/embed\?[^"'\s]+/);
        if (urlMatch) {
          return urlMatch[0];
        }
        return trimmed.split('"')[0] || trimmed.split("'")[0] || trimmed;
      }

      // Se é HTML completo do iframe, extrair o src
      const iframeMatch = trimmed.match(/src=["']([^"']+)["']/i);
      if (iframeMatch && iframeMatch[1]) {
        const src = iframeMatch[1];
        // Garantir que é uma URL do Google Maps
        if (src.includes("google.com/maps/embed")) {
          return src;
        }
      }

      // Tentar extrair URL de qualquer forma possível
      const urlPattern = /https:\/\/www\.google\.com\/maps\/embed\?[^\s"'>]+/;
      const urlMatch = trimmed.match(urlPattern);
      if (urlMatch) {
        return urlMatch[0];
      }

      // Se não conseguir extrair, retornar como está (pode ser uma URL válida)
      return trimmed;
    };

    // Função para escapar strings
    const escapeString = (str) => {
      if (!str) return "";
      return String(str)
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r");
    };
    
    // Função para escapar array de objetos (doctors)
    const escapeDoctorsArray = (doctors) => {
      if (!Array.isArray(doctors) || doctors.length === 0) {
        return `[
    {
      nomeCompleto: "[Nome Completo]",
      cro: "CRO/RJ [NÚMERO]",
      formacao: "Especialização em Implantodontia e Prótese Dentária",
      experiencia: "Mais de [X] anos com índice de sucesso superior a 95%",
      atendimento: "Centenas de pacientes satisfeitos",
    },
  ]`;
      }
      return `[\n${doctors.map((doc, idx) => `    {
      nomeCompleto: "${escapeString(doc.nomeCompleto || "[Nome Completo]")}",
      cro: "${escapeString(doc.cro || "CRO/RJ [NÚMERO]")}",
      formacao: "${escapeString(doc.formacao !== undefined ? doc.formacao : "Especialização em Implantodontia e Prótese Dentária")}",
      experiencia: "${escapeString(doc.experiencia !== undefined ? doc.experiencia : "Mais de [X] anos com índice de sucesso superior a 95%")}",
      atendimento: "${escapeString(doc.atendimento !== undefined ? doc.atendimento : "")}",
    }${idx < doctors.length - 1 ? "," : ""}`).join("\n")}\n  ]`;
    };

    // Gerar conteúdo do arquivo
    const fileContent = `export interface DoctorInfo {
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
  siteUrl: "${escapeString(config.siteUrl || "https://topimplantes.com")}",
  
  cidade: "${escapeString(config.cidade)}",
  uf: "${escapeString(config.uf)}",
  nomeClinica: "${escapeString(config.nomeClinica)}",
  enderecoLinha1: "${escapeString(config.enderecoLinha1)}",
  enderecoLinha2: "${escapeString(config.enderecoLinha2)}",
  cep: "${escapeString(config.cep)}",
  preposicao: "${escapeString(config.preposicao || "em")}", // Preposição para "em Barra da Tijuca" e "Estamos em..."

  // Logo da clínica (URL relativa ou absoluta)
  logoUrl: "${escapeString(config.logoUrl || "")}",

  // Estatísticas
  anosExperiencia: "${escapeString(config.anosExperiencia || "15")}",
  implantesRealizados: "${escapeString(config.implantesRealizados || "5000")}",
  avaliacaoGoogle: "${escapeString(config.avaliacaoGoogle || "4,9")}", // Avaliação no Google (ex: "4,9")

  // Horário de atendimento
  horarioAtendimento: {
    semana: "${escapeString(config.horarioAtendimento?.semana || "Segunda a Sexta: 8h às 18h")}",
    sabado: "${escapeString(config.horarioAtendimento?.sabado || "")}", // Deixe vazio para não exibir
  },

  // CNPJ da clínica
  cnpj: "${escapeString(config.cnpj || "")}", // CNPJ no formato 00.000.000/0000-00

  // Google Maps
  googleMapsUrl: ${config.googleMapsUrl ? `"${extractGoogleMapsUrl(config.googleMapsUrl).replace(/"/g, '\\"')}"` : '""'}, // URL do embed do Google Maps

  // Informações dos médicos (até 2)
  doctors: ${escapeDoctorsArray(config.doctors || [])} as DoctorInfo[],

  // Só dígitos, com DDI 55
  whatsappE164: "${escapeString(config.whatsappE164)}",

  // IDs do formulário/canal
  canalId: "${escapeString(config.canalId)}",
  formId: "${escapeString(config.formId)}",
  formName: "${escapeString(config.formName)}",

  // Webhook URL para envio de formulários
  webhookUrl: "${escapeString(config.webhookUrl || "")}",

  // Google Tag Manager ID
  gtmId: "${escapeString(config.gtmId || "")}",

  // Google Ads (sem GTM)
  googleAds: {
    conversionId: "${escapeString(config.googleAds?.conversionId || "")}",
    conversionLabel: "${escapeString(config.googleAds?.conversionLabel || "")}",
  } as GoogleAdsConfig,
};
`;
    
    // Salvar arquivo
    await fs.writeFile(configPath, fileContent, "utf-8");
    
    res.json({ success: true, message: "Configuração salva com sucesso no siteConfig.ts" });
  } catch (error) {
    console.error("Erro ao salvar configuração:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor dev rodando em http://localhost:${PORT}`);
  console.log(`📁 Apenas para desenvolvimento - não usar em produção!`);
});
