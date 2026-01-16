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
  
  return `Imagem relacionada a implante dentário em ${cidade}`;
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
      // Substituir array inteiro
      mediaSections.doctorHighlight = [mediaItem];
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

app.listen(PORT, () => {
  console.log(`🚀 Servidor dev rodando em http://localhost:${PORT}`);
  console.log(`📁 Apenas para desenvolvimento - não usar em produção!`);
});
