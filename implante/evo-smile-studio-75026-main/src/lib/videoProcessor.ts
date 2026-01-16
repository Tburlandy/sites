/**
 * Extrai metadados de um vídeo
 */
export async function extractVideoMetadata(file: File): Promise<{
  size: number;
  format: string;
  duration: number;
  width: number;
  height: number;
}> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    
    video.onloadedmetadata = () => {
      const metadata = {
        size: file.size,
        format: file.type || file.name.split(".").pop() || "unknown",
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
      };
      
      URL.revokeObjectURL(url);
      resolve(metadata);
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Erro ao carregar vídeo"));
    };
    
    video.src = url;
    video.load();
  });
}

/**
 * Formata duração em segundos para string legível
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

