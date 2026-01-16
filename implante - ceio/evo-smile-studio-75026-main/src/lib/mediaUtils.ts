import { SITE_CONFIG } from "@/config/siteConfig";

/**
 * Converte string para slug (URL-friendly)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Formata bytes para KB/MB
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 KB";
  const k = 1024;
  const sizes = ["KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Calcula redução percentual
 */
export function calculateReduction(original: number, compressed: number): number {
  if (original === 0) return 0;
  return Math.round(((original - compressed) / original) * 100);
}

/**
 * Gera nome de arquivo sugerido para imagem
 */
export function generateImageFileName(
  tipoUso: string,
  categoria: string,
  descricao: string
): string {
  const cidadeSlug = slugify(SITE_CONFIG.cidade);
  const descSlug = descricao ? slugify(descricao) : slugify(categoria);
  return `implante-dentario-${cidadeSlug}-${descSlug}.webp`;
}

/**
 * Gera path sugerido para imagem baseado na categoria
 */
export function generateImagePath(categoria: string, fileName: string): string {
  const categoryMap: Record<string, string> = {
    Clínica: "clinic",
    Dentista: "dentist",
    "Antes/Depois": "before-after",
    Equipe: "team",
    Outros: "other",
  };
  const folder = categoryMap[categoria] || "other";
  return `/images/${folder}/${fileName}`;
}

/**
 * Gera texto alt sugerido para imagem
 */
export function generateImageAlt(
  categoria: string,
  descricao: string,
  tipoUso: string
): string {
  const cidade = SITE_CONFIG.cidade;
  
  if (categoria === "Antes/Depois") {
    return `Antes e depois de paciente tratado com implante dentário em ${cidade}`;
  }
  
  if (descricao) {
    return `${descricao} para implante dentário em ${cidade}`;
  }
  
  const categoriaMap: Record<string, string> = {
    Clínica: `Clínica de implante dentário em ${cidade}`,
    Dentista: `Dentista especialista em implante dentário em ${cidade}`,
    Equipe: `Equipe de profissionais de implante dentário em ${cidade}`,
    Outros: `Imagem relacionada a implante dentário em ${cidade}`,
  };
  
  return categoriaMap[categoria] || `Imagem de implante dentário em ${cidade}`;
}

/**
 * Gera snippet JSX para imagem Hero
 */
export function generateHeroImageSnippet(path: string, alt: string): string {
  return `<div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden aspect-[16/9]">
  <img
    src="${path}"
    alt="${alt}"
    loading="eager"
    className="w-full h-full object-cover"
  />
</div>`;
}

/**
 * Gera snippet JSX para imagem Seção/Galeria
 */
export function generateSectionImageSnippet(path: string, alt: string): string {
  return `<div className="aspect-[16/9] w-full overflow-hidden rounded-xl">
  <img
    src="${path}"
    alt="${alt}"
    loading="lazy"
    className="w-full h-full object-cover"
  />
</div>`;
}

/**
 * Gera nome de arquivo sugerido para vídeo
 */
export function generateVideoFileName(
  tipoUso: string,
  categoria: string,
  descricao: string
): string {
  const cidadeSlug = slugify(SITE_CONFIG.cidade);
  const descSlug = descricao ? slugify(descricao) : slugify(categoria);
  return `video-implante-dentario-${cidadeSlug}-${descSlug}.mp4`;
}

/**
 * Gera path sugerido para vídeo baseado no tipo de uso e categoria
 */
export function generateVideoPath(tipoUso: string, categoria: string, fileName: string): string {
  if (tipoUso === "Hero") {
    return `/videos/hero/${fileName}`;
  }
  
  if (categoria === "Depoimento") {
    return `/videos/depoimentos/${fileName}`;
  }
  
  if (categoria === "Tour da clínica") {
    return `/videos/clinic/${fileName}`;
  }
  
  return `/videos/other/${fileName}`;
}

/**
 * Gera snippet JSX para vídeo Hero
 */
export function generateHeroVideoSnippet(path: string, posterPath?: string): string {
  const posterAttr = posterPath ? `\n  poster="${posterPath}"` : "";
  return `<video
  className="w-full max-w-4xl mx-auto rounded-2xl aspect-[16/9] object-cover"
  autoPlay
  loop
  muted
  playsInline
  preload="metadata"${posterAttr}
>
  <source src="${path}" type="video/mp4" />
  Seu navegador não suporta vídeo HTML5.
</video>`;
}

/**
 * Gera snippet JSX para vídeo Seção/Depoimento
 */
export function generateSectionVideoSnippet(path: string, posterPath?: string): string {
  const posterAttr = posterPath ? `\n  poster="${posterPath}"` : "";
  return `<video
  className="w-full rounded-xl aspect-[16/9] object-cover"
  controls
  preload="metadata"${posterAttr}
>
  <source src="${path}" type="video/mp4" />
  Seu navegador não suporta vídeo HTML5.
</video>`;
}

/**
 * Obtém largura máxima baseada no tipo de uso
 */
export function getMaxWidthForImageType(tipoUso: string): number {
  const widthMap: Record<string, number> = {
    Hero: 1920,
    Seção: 1400,
    "Galeria / Card": 1000,
  };
  return widthMap[tipoUso] || 1400;
}

