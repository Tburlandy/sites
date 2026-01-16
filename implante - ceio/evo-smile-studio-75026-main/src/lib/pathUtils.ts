/**
 * Adiciona o base path do Vite aos caminhos absolutos
 * Necessário para funcionar em subpastas como /pagina/
 */
export function getAssetPath(path: string): string {
  // Se o caminho já começa com http:// ou https://, retorna como está
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Pega o base path do Vite (ex: '/pagina/')
  const base = import.meta.env.BASE_URL;
  
  // Remove a barra inicial do caminho se existir, pois o base já tem
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Combina base + caminho
  return `${base}${cleanPath}`;
}

