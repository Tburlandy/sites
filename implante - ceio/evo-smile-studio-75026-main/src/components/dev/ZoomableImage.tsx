import { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, Move, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  itemId?: string;
  sectionKey?: string;
  initialZoom?: number;
  initialPositionX?: number;
  initialPositionY?: number;
  onSave?: (zoom: number, positionX: number, positionY: number) => void;
}

export function ZoomableImage({ 
  src, 
  alt, 
  className = "",
  itemId,
  sectionKey,
  initialZoom = 1,
  initialPositionX = 0,
  initialPositionY = 0,
  onSave
}: ZoomableImageProps) {
  const [scale, setScale] = useState(initialZoom);
  const [position, setPosition] = useState({ x: initialPositionX, y: initialPositionY });
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { toast } = useToast();

  const minScale = 0.5;
  const maxScale = 5;
  const scaleStep = 0.25;

  // Calcular limites de movimento baseado no tamanho da imagem escalada e container
  const getBounds = () => {
    if (!containerRef.current || !imageRef.current || !imageLoaded || scale <= 1) {
      return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    }

    const container = containerRef.current;
    const img = imageRef.current;
    
    // Obter dimensões reais do container
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    // Obter dimensões naturais da imagem
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    const aspectRatio = naturalWidth / naturalHeight;
    
    // Calcular dimensões renderizadas da imagem (antes do scale)
    // A imagem está com w-full h-auto, então ela se ajusta à largura do container
    const renderedWidth = containerWidth;
    const renderedHeight = containerWidth / aspectRatio;
    
    // Calcular dimensões escaladas
    const scaledWidth = renderedWidth * scale;
    const scaledHeight = renderedHeight * scale;
    
    // Calcular quanto a imagem pode se mover em cada direção
    // Quando a imagem escalada é maior que o container, podemos mover
    const extraWidth = Math.max(0, scaledWidth - containerWidth);
    const extraHeight = Math.max(0, scaledHeight - containerHeight);
    
    // Limites de movimento (metade do espaço extra em cada direção)
    const maxX = extraWidth > 0 ? extraWidth / 2 : 0;
    const maxY = extraHeight > 0 ? extraHeight / 2 : 0;

    return {
      minX: -maxX,
      maxX: maxX,
      minY: -maxY,
      maxY: maxY,
    };
  };

  const constrainPosition = (x: number, y: number) => {
    const bounds = getBounds();
    return {
      x: Math.max(bounds.minX, Math.min(bounds.maxX, x)),
      y: Math.max(bounds.minY, Math.min(bounds.maxY, y)),
    };
  };

  const handleZoomIn = () => {
    setScale((prev) => {
      const newScale = Math.min(prev + scaleStep, maxScale);
      if (newScale > 1) {
        setTimeout(() => {
          setPosition((pos) => constrainPosition(pos.x, pos.y));
        }, 10);
      }
      return newScale;
    });
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const newScale = Math.max(prev - scaleStep, minScale);
      if (newScale <= 1) {
        setPosition({ x: 0, y: 0 });
      } else {
        setTimeout(() => {
          setPosition((pos) => constrainPosition(pos.x, pos.y));
        }, 10);
      }
      return newScale;
    });
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleSave = async () => {
    if (!onSave || !itemId || !sectionKey) return;
    
    setIsSaving(true);
    try {
      await onSave(scale, position.x, position.y);
      toast({
        title: "Configurações salvas!",
        description: "Zoom e posição da imagem foram salvos",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      setDragStart({
        x: e.clientX,
        y: e.clientY,
      });
      setDragStartPosition({
        x: position.x,
        y: position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      e.preventDefault();
      e.stopPropagation();
      
      // Calcular movimento relativo ao ponto inicial do drag
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      // Nova posição baseada na posição inicial do drag + movimento
      const newX = dragStartPosition.x + deltaX;
      const newY = dragStartPosition.y + deltaY;
      
      const constrained = constrainPosition(newX, newY);
      setPosition(constrained);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (scale > 1 || e.deltaY < 0) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -scaleStep : scaleStep;
      setScale((prev) => {
        const newScale = Math.max(minScale, Math.min(prev + delta, maxScale));
        if (newScale <= 1) {
          setPosition({ x: 0, y: 0 });
        } else {
          setTimeout(() => {
            setPosition((pos) => constrainPosition(pos.x, pos.y));
          }, 10);
        }
        return newScale;
      });
    }
  };

  const handleImageLoad = () => {
    if (imageRef.current && containerRef.current) {
      setImageLoaded(true);
    }
  };

  // Atualizar posição quando zoom muda
  useEffect(() => {
    if (scale <= 1) {
      setPosition({ x: 0, y: 0 });
    } else if (imageLoaded) {
      setTimeout(() => {
        setPosition((pos) => constrainPosition(pos.x, pos.y));
      }, 50);
    }
  }, [scale, imageLoaded]);

  // Sincronizar com valores iniciais quando mudarem
  useEffect(() => {
    setScale(initialZoom);
    setPosition({ x: initialPositionX, y: initialPositionY });
  }, [initialZoom, initialPositionX, initialPositionY]);

  const hasChanges = scale !== initialZoom || position.x !== initialPositionX || position.y !== initialPositionY;

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
      <div
        ref={containerRef}
        className={`relative w-full overflow-hidden ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
        style={{ 
          touchAction: "none",
          position: 'relative',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className={`${className} w-full h-auto block`}
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transformOrigin: "center center",
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            willChange: isDragging ? 'transform' : 'auto',
          }}
          draggable={false}
          onLoad={handleImageLoad}
        />
      </div>
      
      <div className="absolute bottom-2 right-2 flex gap-2 bg-black/50 rounded-lg p-1 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          disabled={scale <= minScale}
          className="h-8 w-8 p-0 text-white hover:bg-white/20"
          title="Diminuir zoom"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-white text-xs flex items-center px-2">
          {Math.round(scale * 100)}%
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          disabled={scale >= maxScale}
          className="h-8 w-8 p-0 text-white hover:bg-white/20"
          title="Aumentar zoom"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={scale === 1 && position.x === 0 && position.y === 0}
          className="h-8 w-8 p-0 text-white hover:bg-white/20"
          title="Resetar zoom e posição"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        {onSave && itemId && sectionKey && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="h-8 w-8 p-0 text-white hover:bg-white/20"
            title="Salvar zoom e posição"
          >
            <Save className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {scale > 1 && (
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1 z-10">
          <Move className="h-3 w-3" />
          Arraste para mover
        </div>
      )}
    </div>
  );
}
