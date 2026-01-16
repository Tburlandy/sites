import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Move, RotateCcw, Save } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface ImageEditorProps {
  src: string;
  type: "image" | "video";
  poster?: string;
  initialTransform?: {
    scale: number;
    translateX: number;
    translateY: number;
  };
  onTransformChange: (transform: { scale: number; translateX: number; translateY: number }) => void;
  onSave?: (transform: { scale: number; translateX: number; translateY: number }) => Promise<void> | void;
  autoSave?: boolean;
}

export function ImageEditor({ 
  src, 
  type, 
  poster,
  initialTransform = { scale: 1, translateX: 0, translateY: 0 },
  onTransformChange,
  onSave,
  autoSave = false
}: ImageEditorProps) {
  const [transform, setTransform] = useState(initialTransform);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null);
  const updateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastInitialTransformRef = useRef(initialTransform);

  // Sincronizar transform quando initialTransform mudar externamente (após salvar)
  useEffect(() => {
    const hasChanged = 
      initialTransform.scale !== lastInitialTransformRef.current.scale ||
      initialTransform.translateX !== lastInitialTransformRef.current.translateX ||
      initialTransform.translateY !== lastInitialTransformRef.current.translateY;
    
    if (hasChanged && !hasUnsavedChanges) {
      setTransform(initialTransform);
      lastInitialTransformRef.current = initialTransform;
    }
  }, [initialTransform.scale, initialTransform.translateX, initialTransform.translateY, hasUnsavedChanges]);

  // Verificar se há mudanças não salvas
  useEffect(() => {
    const hasChanges = 
      transform.scale !== initialTransform.scale ||
      transform.translateX !== initialTransform.translateX ||
      transform.translateY !== initialTransform.translateY;
    setHasUnsavedChanges(hasChanges);
  }, [transform, initialTransform]);

  useEffect(() => {
    if (autoSave) {
      // Debounce para evitar muitas atualizações durante o drag
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      if (!isDragging) {
        // Atualizar imediatamente quando não está arrastando
        onTransformChange(transform);
      } else {
        // Durante o drag, aguardar um pouco antes de atualizar
        updateTimeoutRef.current = setTimeout(() => {
          onTransformChange(transform);
        }, 100);
      }

      return () => {
        if (updateTimeoutRef.current) {
          clearTimeout(updateTimeoutRef.current);
        }
      };
    }
  }, [transform, isDragging, onTransformChange, autoSave]);

  const handleZoomIn = () => {
    setTransform(prev => ({ ...prev, scale: Math.min(prev.scale + 0.1, 3) }));
  };

  const handleZoomOut = () => {
    setTransform(prev => ({ ...prev, scale: Math.max(prev.scale - 0.1, 0.5) }));
  };

  const handleReset = () => {
    setTransform(initialTransform);
  };

  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      // Passar a transformação atual para a função onSave
      await onSave(transform);
      setHasUnsavedChanges(false);
      lastInitialTransformRef.current = transform;
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Apenas botão esquerdo
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - transform.translateX,
      y: e.clientY - transform.translateY,
    });
  }, [transform.translateX, transform.translateY]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setTransform(prev => ({
      ...prev,
      translateX: e.clientX - dragStart.x,
      translateY: e.clientY - dragStart.y,
    }));
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    // Se autoSave estiver ativado, garantir que a última transformação seja salva
    if (autoSave && updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
      onTransformChange(transform);
    }
  }, [transform, onTransformChange, autoSave]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const transformStyle = {
    transform: `scale(${transform.scale}) translate(${transform.translateX / transform.scale}px, ${transform.translateY / transform.scale}px)`,
    transformOrigin: 'center center',
  };

  return (
    <div className="space-y-4">
      <div 
        ref={containerRef}
        className="relative w-full h-64 border rounded-lg overflow-hidden bg-muted"
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {type === "image" ? (
            <img
              ref={mediaRef as React.RefObject<HTMLImageElement>}
              src={src}
              alt="Preview"
              style={transformStyle}
              className="max-w-full max-h-full object-contain select-none"
              draggable={false}
            />
          ) : (
            <video
              ref={mediaRef as React.RefObject<HTMLVideoElement>}
              src={src}
              poster={poster}
              controls
              style={transformStyle}
              className="max-w-full max-h-full object-contain select-none"
              draggable={false}
            />
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ZoomOut className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={[transform.scale]}
            onValueChange={([value]) => setTransform(prev => ({ ...prev, scale: value }))}
            min={0.5}
            max={3}
            step={0.1}
            className="flex-1"
          />
          <ZoomIn className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground w-12 text-right">
            {Math.round(transform.scale * 100)}%
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            className="flex-1"
          >
            <ZoomIn className="h-4 w-4 mr-2" />
            Zoom In
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            className="flex-1"
          >
            <ZoomOut className="h-4 w-4 mr-2" />
            Zoom Out
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={!hasUnsavedChanges}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {onSave && (
          <Button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSaving}
            className="w-full"
            size="sm"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Salvando..." : hasUnsavedChanges ? "Salvar Transformações" : "Salvo ✓"}
          </Button>
        )}

        {!onSave && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Move className="h-3 w-3" />
            Arraste a imagem/vídeo para reposicionar
          </p>
        )}
        
        {onSave && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Move className="h-3 w-3" />
            Arraste para reposicionar • Ajuste o zoom • Clique em "Salvar Transformações" quando terminar
          </p>
        )}
      </div>
    </div>
  );
}

