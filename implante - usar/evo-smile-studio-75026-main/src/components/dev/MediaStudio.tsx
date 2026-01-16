import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Copy, X, AlertCircle, Save, Trash2 } from "lucide-react";
import { copyToClipboard } from "@/lib/imageProcessor";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { MediaItem, MediaSectionKey, MediaSections } from "@/types/media";
import { generateHeroImageSnippet, generateSectionImageSnippet, generateHeroVideoSnippet, generateSectionVideoSnippet } from "@/lib/mediaUtils";
import { getAssetPath } from "@/lib/pathUtils";
import { ImageEditor } from "./ImageEditor";

const API_BASE = "http://localhost:3001";

const SECTION_OPTIONS = [
  { value: "smilesTransformed", label: "Mais de 3.000 sorrisos transformados" },
  { value: "doctorHighlight", label: "Quem vai cuidar de você?" },
  { value: "realStories", label: "Histórias reais de quem voltou a sorrir com confiança" },
  { value: "clinicStructure", label: "Nossa estrutura" },
] as const;

interface PendingUpload {
  id: string;
  file: File;
  sectionKey: MediaSectionKey;
  description: string;
  posterFile?: File;
  type: "image" | "video";
  processing: boolean;
  transform?: {
    scale: number;
    translateX: number;
    translateY: number;
  };
}

export function MediaStudio() {
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [savedMedia, setSavedMedia] = useState<MediaSections>({
    smilesTransformed: [],
    doctorHighlight: [],
    realStories: [],
    clinicStructure: [],
  });
  const [selectedSection, setSelectedSection] = useState<MediaSectionKey>("smilesTransformed");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Carregar mídias salvas
  useEffect(() => {
    loadSavedMedia();
  }, []);

  const loadSavedMedia = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/media`);
      if (response.ok) {
        const data = await response.json();
        setSavedMedia(data);
      }
    } catch (error) {
      console.error("Erro ao carregar mídias:", error);
      toast({
        title: "Erro ao carregar mídias",
        description: "Verifique se o servidor dev está rodando",
        variant: "destructive",
      });
    }
  };

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const newUploads: PendingUpload[] = [];

      for (const file of fileArray) {
        const id = `${Date.now()}-${Math.random()}`;
        const type = file.type.startsWith("image/") ? "image" : "video";

        newUploads.push({
          id,
          file,
          sectionKey: selectedSection,
          description: "",
          type,
          processing: false,
          transform: { scale: 1, translateX: 0, translateY: 0 },
        });
      }

      setPendingUploads((prev) => [...prev, ...newUploads]);
    },
    [selectedSection]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles]
  );

  const handlePosterSelect = useCallback((uploadId: string, file: File | null) => {
    setPendingUploads((prev) =>
      prev.map((item) => (item.id === uploadId ? { ...item, posterFile: file || undefined } : item))
    );
  }, []);

  const handleSaveToSite = async (upload: PendingUpload) => {
    setPendingUploads((prev) =>
      prev.map((item) => (item.id === upload.id ? { ...item, processing: true } : item))
    );

    try {
      const formData = new FormData();
      formData.append("file", upload.file);
      formData.append("sectionKey", upload.sectionKey);
      formData.append("mediaType", upload.type);
      formData.append("description", upload.description);

      if (upload.posterFile) {
        formData.append("poster", upload.posterFile);
      }

      if (upload.transform) {
        formData.append("transform", JSON.stringify(upload.transform));
      }

      const response = await fetch(`${API_BASE}/api/media/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao fazer upload");
      }

      const savedItem: MediaItem = await response.json();

      // Remover do pending e recarregar mídias salvas
      setPendingUploads((prev) => prev.filter((item) => item.id !== upload.id));
      await loadSavedMedia();

      toast({
        title: "Mídia salva com sucesso!",
        description: "A seção do site foi atualizada",
      });

      // Aviso especial para doctorHighlight
      if (upload.sectionKey === "doctorHighlight") {
        const currentDoctors = savedMedia.doctorHighlight.filter((item) => item.type === "image");
        if (currentDoctors.length >= 2) {
          toast({
            title: "Atenção",
            description: "Já existem 2 médicos. O segundo médico foi substituído.",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
      setPendingUploads((prev) =>
        prev.map((item) => (item.id === upload.id ? { ...item, processing: false } : item))
      );
    }
  };

  const handleDelete = async (sectionKey: MediaSectionKey, id: string) => {
    if (!confirm("Tem certeza que deseja remover esta mídia?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/media/${sectionKey}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao remover");
      }

      await loadSavedMedia();
      toast({
        title: "Mídia removida",
        description: "A mídia foi removida do site",
      });
    } catch (error) {
      toast({
        title: "Erro ao remover",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleCopySnippet = async (item: MediaItem, sectionKey: MediaSectionKey) => {
    let snippet = "";
    
    if (item.type === "image") {
      if (sectionKey === "doctorHighlight") {
        snippet = generateSectionImageSnippet(item.src, item.alt);
      } else {
        snippet = generateSectionImageSnippet(item.src, item.alt);
      }
    } else {
      if (sectionKey === "realStories") {
        snippet = generateSectionVideoSnippet(item.src, item.poster);
      } else {
        snippet = generateHeroVideoSnippet(item.src, item.poster);
      }
    }

    const success = await copyToClipboard(snippet);
    if (success) {
      toast({
        title: "Snippet copiado",
        description: "Código JSX copiado para a área de transferência",
      });
    }
  };

  const removePending = (id: string) => {
    setPendingUploads((prev) => prev.filter((item) => item.id !== id));
  };

  const updatePending = (id: string, updates: Partial<PendingUpload>) => {
    setPendingUploads((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const currentSectionItems = savedMedia[selectedSection] || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload de Mídias</CardTitle>
          <CardDescription>
            Escolha a seção do site e faça upload de imagens ou vídeos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Seção do Site *</label>
            <Select value={selectedSection} onValueChange={(value) => setSelectedSection(value as MediaSectionKey)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SECTION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedSection === "doctorHighlight" && (
              <Alert className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Esta seção aceita até 2 médicos. Ao fazer upload de uma terceira imagem, a segunda será substituída.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            }`}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              Arraste arquivos aqui ou clique para selecionar
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Imagens: JPG, PNG, WebP | Vídeos: MP4, WebM
            </p>
            <Button onClick={() => fileInputRef.current?.click()} variant="outline">
              Selecionar Arquivos
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Uploads pendentes */}
      {pendingUploads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploads Pendentes</CardTitle>
            <CardDescription>Configure e salve as mídias no site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingUploads.map((upload) => (
              <Card key={upload.id}>
                <CardContent className="pt-6 space-y-4">
                  <ImageEditor
                    src={URL.createObjectURL(upload.file)}
                    type={upload.type}
                    poster={upload.posterFile ? URL.createObjectURL(upload.posterFile) : undefined}
                    initialTransform={upload.transform || { scale: 1, translateX: 0, translateY: 0 }}
                    onTransformChange={(transform) => updatePending(upload.id, { transform })}
                    autoSave={true}
                  />

                  <div>
                    <label className="text-sm font-medium mb-2 block">Descrição (opcional)</label>
                    <Textarea
                      value={upload.description}
                      onChange={(e) => updatePending(upload.id, { description: e.target.value })}
                      placeholder="Ex: Sala cirúrgica, Depoimento do paciente João..."
                      rows={2}
                    />
                  </div>

                  {upload.type === "video" && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Poster (imagem, opcional)</label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          handlePosterSelect(upload.id, file);
                        }}
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSaveToSite(upload)}
                      disabled={upload.processing}
                      className="flex-1"
                    >
                      {upload.processing ? (
                        "Salvando..."
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar no Site
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => removePending(upload.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Mídias salvas */}
      <Card>
        <CardHeader>
          <CardTitle>
            Mídias Salvas - {SECTION_OPTIONS.find((o) => o.value === selectedSection)?.label}
          </CardTitle>
          <CardDescription>
            {currentSectionItems.length === 0
              ? "Nenhuma mídia salva nesta seção"
              : `${currentSectionItems.length} mídia(s) salva(s)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentSectionItems.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Faça upload de mídias para esta seção usando o formulário acima
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentSectionItems
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <Card key={item.id}>
                    <CardContent className="pt-6 space-y-4">
                      <ImageEditor
                        src={getAssetPath(item.src)}
                        type={item.type}
                        poster={item.poster ? getAssetPath(item.poster) : undefined}
                        initialTransform={item.transform || { scale: 1, translateX: 0, translateY: 0 }}
                        onTransformChange={(transform) => {
                          // Apenas atualizar estado local, não salvar ainda
                          setSavedMedia(prev => ({
                            ...prev,
                            [selectedSection]: prev[selectedSection].map(mediaItem =>
                              mediaItem.id === item.id ? { ...mediaItem, transform } : mediaItem
                            ),
                          }));
                        }}
                        onSave={async (transformToSave) => {
                          // Usar a transformação passada pelo ImageEditor
                          const currentTransform = transformToSave || { scale: 1, translateX: 0, translateY: 0 };
                          
                          console.log(`Salvando transformação para ${selectedSection}/${item.id}:`, currentTransform);
                          
                          try {
                            // Tentar PATCH primeiro, se falhar tentar PUT
                            let response = await fetch(`${API_BASE}/api/media/${selectedSection}/${item.id}`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ transform: currentTransform }),
                            });
                            
                            // Se PATCH falhar, tentar PUT
                            if (!response.ok && response.status === 404) {
                              console.log("PATCH falhou, tentando PUT...");
                              response = await fetch(`${API_BASE}/api/media/${selectedSection}/${item.id}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ transform: currentTransform }),
                              });
                            }
                            
                            if (!response.ok) {
                              const errorData = await response.json().catch(() => ({ error: "Erro desconhecido" }));
                              throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
                            }
                            
                            const savedItem = await response.json();
                            
                            // Atualizar o estado para marcar como salvo
                            setSavedMedia(prev => ({
                              ...prev,
                              [selectedSection]: prev[selectedSection].map(mediaItem =>
                                mediaItem.id === item.id ? { ...mediaItem, transform: savedItem.transform || currentTransform } : mediaItem
                              ),
                            }));
                            
                            toast({
                              title: "Transformações salvas!",
                              description: "As alterações foram salvas com sucesso",
                            });
                          } catch (error) {
                            console.error("Erro ao salvar transformação:", error);
                            const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
                            toast({
                              title: "Erro ao salvar transformação",
                              description: errorMessage,
                              variant: "destructive",
                            });
                            throw error;
                          }
                        }}
                      />

                      <div className="space-y-2">
                        <p className="text-sm font-medium">{item.alt}</p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground">Path: {item.src}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopySnippet(item, selectedSection)}
                          className="flex-1"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copiar JSX
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(selectedSection, item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
