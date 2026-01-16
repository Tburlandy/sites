/**
 * Utilitário para aplicar transformações CSS em imagens e vídeos
 */

export interface Transform {
  scale: number;
  translateX: number;
  translateY: number;
}

/**
 * Gera o estilo CSS para aplicar transformações
 */
export function getTransformStyle(transform?: Transform): React.CSSProperties {
  if (!transform) {
    return {};
  }

  // Aplicar scale e translate diretamente, sem dividir translate pelo scale
  // O translate já está em pixels absolutos
  // Usar object-contain para não cortar a imagem quando há zoom
  return {
    transform: `scale(${transform.scale}) translate(${transform.translateX}px, ${transform.translateY}px)`,
    transformOrigin: 'center center',
    objectFit: 'contain' as const,
  };
}

/**
 * Gera classes CSS para container que precisa de overflow hidden
 */
export function getTransformContainerClass(): string {
  return 'overflow-hidden';
}

