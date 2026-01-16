/**
 * Processa imagem: redimensiona e converte para WebP
 */
export async function processImage(
  file: File,
  maxWidth: number,
  quality: number = 0.8
): Promise<{
  webpBlob: Blob;
  webpUrl: string;
  originalSize: number;
  webpSize: number;
  originalWidth: number;
  originalHeight: number;
  webpWidth: number;
  webpHeight: number;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          reject(new Error("Não foi possível criar contexto do canvas"));
          return;
        }
        
        // Calcular dimensões mantendo aspect ratio
        let { width, height } = img;
        const originalWidth = width;
        const originalHeight = height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Desenhar imagem redimensionada
        ctx.drawImage(img, 0, 0, width, height);
        
        // Converter para WebP
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Falha ao converter para WebP"));
              return;
            }
            
            const webpUrl = URL.createObjectURL(blob);
            
            resolve({
              webpBlob: blob,
              webpUrl,
              originalSize: file.size,
              webpSize: blob.size,
              originalWidth,
              originalHeight,
              webpWidth: width,
              webpHeight: height,
            });
          },
          "image/webp",
          quality
        );
      };
      
      img.onerror = () => reject(new Error("Erro ao carregar imagem"));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
    reader.readAsDataURL(file);
  });
}

/**
 * Faz download de um blob como arquivo
 */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Copia texto para clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback para navegadores mais antigos
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    } catch (e) {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

