import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Save, Upload, X, Plus } from "lucide-react";
import { SITE_CONFIG, type DoctorInfo } from "@/config/siteConfig";
import { copyToClipboard } from "@/lib/imageProcessor";
import { useToast } from "@/hooks/use-toast";

interface ConfigState {
  nomeClinica: string;
  cidade: string;
  uf: string;
  enderecoLinha1: string;
  enderecoLinha2: string;
  cep: string;
  preposicao: string;
  logoUrl: string;
  anosExperiencia: string;
  implantesRealizados: string;
  avaliacaoGoogle: string;
  horarioAtendimento: {
    semana: string;
    sabado: string;
  };
  cnpj: string;
  googleMapsUrl: string;
  doctors: DoctorInfo[];
  whatsappE164: string;
  telefoneFixo?: string;
  canalId: string;
  formId: string;
  formName: string;
  webhookUrl: string;
  gtmId: string;
  googleBusinessUrl: string;
  googleAnalyticsId?: string;
  googleAds: {
    conversionId: string;
    conversionLabel: string;
  };
}

const STORAGE_KEY = "config_editor_state";
const API_BASE = "http://localhost:3001";

export function ConfigEditor() {
  const { toast } = useToast();
  const [config, setConfig] = useState<ConfigState>({
    nomeClinica: SITE_CONFIG.nomeClinica,
    cidade: SITE_CONFIG.cidade,
    uf: SITE_CONFIG.uf,
    enderecoLinha1: SITE_CONFIG.enderecoLinha1,
    enderecoLinha2: SITE_CONFIG.enderecoLinha2,
    cep: SITE_CONFIG.cep,
    preposicao: SITE_CONFIG.preposicao || "em",
    logoUrl: SITE_CONFIG.logoUrl || "",
    anosExperiencia: SITE_CONFIG.anosExperiencia || "15",
    implantesRealizados: SITE_CONFIG.implantesRealizados || "5000",
    avaliacaoGoogle: SITE_CONFIG.avaliacaoGoogle || "4,9",
    horarioAtendimento: SITE_CONFIG.horarioAtendimento || {
      semana: "Segunda a Sexta: 8h às 18h",
      sabado: "Sábado: 8h às 12h",
    },
    cnpj: SITE_CONFIG.cnpj || "",
    googleMapsUrl: SITE_CONFIG.googleMapsUrl || "",
    doctors: SITE_CONFIG.doctors || [
      {
        nomeCompleto: "[Nome Completo]",
        cro: "CRO/RJ [NÚMERO]",
        formacao: "Especialização em Implantodontia e Prótese Dentária",
        experiencia: "Mais de [X] anos com índice de sucesso superior a 95%",
        atendimento: "Centenas de pacientes satisfeitos",
      },
    ],
    whatsappE164: SITE_CONFIG.whatsappE164,
    telefoneFixo: "",
    canalId: SITE_CONFIG.canalId,
    formId: SITE_CONFIG.formId,
    formName: SITE_CONFIG.formName,
    webhookUrl: SITE_CONFIG.webhookUrl || "",
    gtmId: SITE_CONFIG.gtmId || "",
    googleBusinessUrl: "",
    googleAnalyticsId: "",
    googleAds: SITE_CONFIG.googleAds || {
      conversionId: "",
      conversionLabel: "",
    },
  });

  // Carregar do localStorage na montagem
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Erro ao carregar configuração salva:", e);
      }
    }
  }, []);

  // Salvar no localStorage quando config mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const updateField = (field: keyof ConfigState, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const updateDoctorField = (index: number, field: keyof DoctorInfo, value: string) => {
    setConfig((prev) => {
      const newDoctors = [...prev.doctors];
      newDoctors[index] = { ...newDoctors[index], [field]: value };
      return { ...prev, doctors: newDoctors };
    });
  };

  const addDoctor = () => {
    if (config.doctors.length >= 2) {
      toast({
        title: "Limite atingido",
        description: "Máximo de 2 médicos permitido",
        variant: "destructive",
      });
      return;
    }
    setConfig((prev) => ({
      ...prev,
      doctors: [
        ...prev.doctors,
        {
          nomeCompleto: "[Nome Completo]",
          cro: "CRO/RJ [NÚMERO]",
          formacao: "Especialização em Implantodontia e Prótese Dentária",
          experiencia: "Mais de [X] anos com índice de sucesso superior a 95%",
          atendimento: "Centenas de pacientes satisfeitos",
        },
      ],
    }));
  };

  const removeDoctor = (index: number) => {
    if (config.doctors.length <= 1) {
      toast({
        title: "Não é possível remover",
        description: "Deve haver pelo menos 1 médico",
        variant: "destructive",
      });
      return;
    }
    setConfig((prev) => ({
      ...prev,
      doctors: prev.doctors.filter((_, i) => i !== index),
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma imagem",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("logo", file);

    try {
      const response = await fetch(`${API_BASE}/api/logo/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro no upload");
      }

      const data = await response.json();
      updateField("logoUrl", data.logoUrl);

      toast({
        title: "Logo enviada!",
        description: "A logo foi salva com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar logo",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const formatWhatsApp = (value: string) => {
    return value.replace(/\D/g, "");
  };

  const generateSiteConfigSnippet = (): string => {
    const doctorsArray = config.doctors.length > 0
      ? `[\n${config.doctors.map((doc, idx) => `    {
      nomeCompleto: "${doc.nomeCompleto}",
      cro: "${doc.cro}",
      formacao: "${doc.formacao}",
      experiencia: "${doc.experiencia}",
      atendimento: "${doc.atendimento}",
    }${idx < config.doctors.length - 1 ? "," : ""}`).join("\n")}\n  ]`
      : `[
    {
      nomeCompleto: "[Nome Completo]",
      cro: "CRO/RJ [NÚMERO]",
      formacao: "Especialização em Implantodontia e Prótese Dentária",
      experiencia: "Mais de [X] anos com índice de sucesso superior a 95%",
      atendimento: "Centenas de pacientes satisfeitos",
    },
  ]`;

    return `export interface DoctorInfo {
  nomeCompleto: string;
  cro: string;
  formacao: string;
  experiencia: string;
  atendimento: string;
}

export const SITE_CONFIG = {
  cidade: "${config.cidade}",
  uf: "${config.uf}",
  nomeClinica: "${config.nomeClinica}",
  enderecoLinha1: "${config.enderecoLinha1}",
  enderecoLinha2: "${config.enderecoLinha2}",
  cep: "${config.cep}",
  preposicao: "${config.preposicao}",

  logoUrl: "${config.logoUrl}",

  anosExperiencia: "${config.anosExperiencia}",
  implantesRealizados: "${config.implantesRealizados}",
  avaliacaoGoogle: "${config.avaliacaoGoogle}", // Avaliação no Google (ex: "4,9")

  horarioAtendimento: {
    semana: "${config.horarioAtendimento.semana}",
    sabado: "${config.horarioAtendimento.sabado}", // Deixe vazio para não exibir
  },

  // CNPJ da clínica
  cnpj: "${config.cnpj}", // CNPJ no formato 00.000.000/0000-00

  googleMapsUrl: ${config.googleMapsUrl ? `\`${config.googleMapsUrl.replace(/`/g, '\\`').replace(/\${/g, '\\${')}\`` : '""'},

  doctors: ${doctorsArray} as DoctorInfo[],

  whatsappE164: "${config.whatsappE164}",

  canalId: "${config.canalId}",
  formId: "${config.formId}",
  formName: "${config.formName}",

  webhookUrl: import.meta.env.VITE_WEBHOOK_URL || "",
  gtmId: import.meta.env.VITE_GTM_ID || "",

  googleAds: {
    conversionId: "${config.googleAds.conversionId}",
    conversionLabel: "${config.googleAds.conversionLabel}",
  },
};`;
  };

  const generateEnvSnippet = (): string => {
    const lines: string[] = [];
    
    if (config.webhookUrl) {
      lines.push(`VITE_WEBHOOK_URL=${config.webhookUrl}`);
    }
    
    if (config.gtmId) {
      lines.push(`VITE_GTM_ID=${config.gtmId}`);
    }
    
    if (config.googleAnalyticsId) {
      lines.push(`VITE_GOOGLE_ANALYTICS_ID=${config.googleAnalyticsId}`);
    }
    
    // Google Ads
    if (config.googleAds?.conversionId) {
      lines.push(`VITE_GOOGLE_ADS_CONVERSION_ID=${config.googleAds.conversionId}`);
    }
    
    if (config.googleAds?.conversionLabel) {
      lines.push(`VITE_GOOGLE_ADS_CONVERSION_LABEL=${config.googleAds.conversionLabel}`);
    }
    
    return lines.join("\n");
  };

  const handleCopySiteConfig = async () => {
    const snippet = generateSiteConfigSnippet();
    const success = await copyToClipboard(snippet);
    if (success) {
      toast({
        title: "Snippet copiado",
        description: "Código siteConfig.ts copiado para a área de transferência",
      });
    } else {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o snippet",
        variant: "destructive",
      });
    }
  };

  const handleCopyEnv = async () => {
    const snippet = generateEnvSnippet();
    const success = await copyToClipboard(snippet);
    if (success) {
      toast({
        title: "Snippet copiado",
        description: "Código .env copiado para a área de transferência",
      });
    } else {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o snippet",
        variant: "destructive",
      });
    }
  };

  const handleSaveConfig = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/config/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao salvar configuração");
      }

      const result = await response.json();
      
      toast({
        title: "Configuração salva!",
        description: result.message || "O arquivo siteConfig.ts e .env foram atualizados com sucesso",
      });
      
      // Recarregar a página após 1.5 segundos para aplicar as mudanças do .env
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações da Clínica</CardTitle>
          <CardDescription>Dados básicos da clínica</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Nome da Clínica</label>
              <Input
                value={config.nomeClinica}
                onChange={(e) => updateField("nomeClinica", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Cidade</label>
              <Input
                value={config.cidade}
                onChange={(e) => updateField("cidade", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">UF</label>
              <Input
                value={config.uf}
                onChange={(e) => updateField("uf", e.target.value.toUpperCase())}
                maxLength={2}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">CEP</label>
              <Input
                value={config.cep}
                onChange={(e) => updateField("cep", e.target.value)}
                placeholder="00000-000"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Endereço (Linha 1)</label>
            <Input
              value={config.enderecoLinha1}
              onChange={(e) => updateField("enderecoLinha1", e.target.value)}
              placeholder="Rua/Avenida, Número"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Endereço (Linha 2)</label>
            <Input
              value={config.enderecoLinha2}
              onChange={(e) => updateField("enderecoLinha2", e.target.value)}
              placeholder="Bairro - Cidade/UF"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Preposição (ex: "em", "na", "no")
            </label>
            <Input
              value={config.preposicao}
              onChange={(e) => updateField("preposicao", e.target.value)}
              placeholder="em"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Usado em "Especialistas em implantes dentários {config.preposicao} {config.cidade}" e "Estamos {config.preposicao} {config.cidade}"
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Logo da Clínica</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-md cursor-pointer hover:bg-accent transition-colors"
              >
                <Upload className="w-4 h-4" />
                Enviar Logo
              </label>
              {config.logoUrl && (
                <div className="flex items-center gap-2">
                  <img src={config.logoUrl} alt="Logo" className="h-8 w-auto" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateField("logoUrl", "")}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estatísticas e Informações</CardTitle>
          <CardDescription>Valores exibidos no site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Anos de Experiência</label>
              <Input
                value={config.anosExperiencia}
                onChange={(e) => updateField("anosExperiencia", e.target.value)}
                placeholder="15"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Exibido como "{config.anosExperiencia}+ Anos de Experiência"
              </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Implantes Realizados</label>
              <Input
                value={config.implantesRealizados}
                onChange={(e) => updateField("implantesRealizados", e.target.value)}
                placeholder="5000"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Exibido como "{config.implantesRealizados}+ Implantes Realizados" e "Mais de {config.implantesRealizados} sorrisos transformados"
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Avaliação no Google</label>
            <Input
              value={config.avaliacaoGoogle}
              onChange={(e) => updateField("avaliacaoGoogle", e.target.value)}
              placeholder="4,9"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Exibido como "{config.avaliacaoGoogle}/5 Avaliação no Google"
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Horário de Atendimento (Semana)</label>
            <Input
              value={config.horarioAtendimento.semana}
              onChange={(e) => updateField("horarioAtendimento", { ...config.horarioAtendimento, semana: e.target.value })}
              placeholder="Segunda a Sexta: 8h às 18h"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Horário de Atendimento (Sábado)</label>
            <Input
              value={config.horarioAtendimento.sabado}
              onChange={(e) => updateField("horarioAtendimento", { ...config.horarioAtendimento, sabado: e.target.value })}
              placeholder="Sábado: 8h às 12h"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Deixe vazio para não exibir o horário de sábado
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">CNPJ</label>
            <Input
              value={config.cnpj}
              onChange={(e) => updateField("cnpj", e.target.value)}
              placeholder="00.000.000/0000-00"
            />
            <p className="text-xs text-muted-foreground mt-1">
              CNPJ da clínica (formato: 00.000.000/0000-00). Exibido no footer do site.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Google Maps (URL ou HTML do iframe)</label>
            <Textarea
              value={config.googleMapsUrl}
              onChange={(e) => updateField("googleMapsUrl", e.target.value)}
              placeholder='Cole a URL do embed OU o código completo do iframe do Google Maps'
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Aceita tanto URL direta (https://www.google.com/maps/embed?...) quanto HTML completo do iframe. O sistema extrai automaticamente a URL correta.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações dos Médicos</CardTitle>
          <CardDescription>Edite as informações de cada médico (máximo 2)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {config.doctors.map((doctor, index) => (
            <div key={index} className="border border-border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Médico {index + 1}</h3>
                {config.doctors.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDoctor(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Nome Completo</label>
                <Input
                  value={doctor.nomeCompleto}
                  onChange={(e) => updateDoctorField(index, "nomeCompleto", e.target.value)}
                  placeholder="Dr(a). [Nome Completo]"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">CRO</label>
                <Input
                  value={doctor.cro}
                  onChange={(e) => updateDoctorField(index, "cro", e.target.value)}
                  placeholder="CRO/RJ [NÚMERO]"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Formação</label>
                <Textarea
                  value={doctor.formacao}
                  onChange={(e) => updateDoctorField(index, "formacao", e.target.value)}
                  placeholder="Especialização em Implantodontia e Prótese Dentária"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Experiência</label>
                <Textarea
                  value={doctor.experiencia}
                  onChange={(e) => updateDoctorField(index, "experiencia", e.target.value)}
                  placeholder="Mais de [X] anos com índice de sucesso superior a 95%"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Atendimento</label>
                <Textarea
                  value={doctor.atendimento}
                  onChange={(e) => updateDoctorField(index, "atendimento", e.target.value)}
                  placeholder="Centenas de pacientes satisfeitos"
                  rows={2}
                />
              </div>
            </div>
          ))}

          {config.doctors.length < 2 && (
            <Button variant="outline" onClick={addDoctor} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Segundo Médico
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contato</CardTitle>
          <CardDescription>Informações de contato</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              WhatsApp (E.164 - apenas dígitos com DDI 55)
            </label>
            <Input
              value={config.whatsappE164}
              onChange={(e) => updateField("whatsappE164", formatWhatsApp(e.target.value))}
              placeholder="5521999999999"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Formato: 55 + DDD + número (sem espaços ou caracteres especiais)
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Telefone Fixo (opcional)</label>
            <Input
              value={config.telefoneFixo || ""}
              onChange={(e) => updateField("telefoneFixo", e.target.value)}
              placeholder="(21) 1234-5678"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>IDs de Formulário / Umbler</CardTitle>
          <CardDescription>Configurações do sistema de formulários</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Canal ID</label>
              <Input
                value={config.canalId}
                onChange={(e) => updateField("canalId", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Form ID</label>
              <Input
                value={config.formId}
                onChange={(e) => updateField("formId", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Form Name</label>
              <Input
                value={config.formName}
                onChange={(e) => updateField("formName", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integrações</CardTitle>
          <CardDescription>Configurações de serviços externos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Webhook URL</label>
            <Input
              value={config.webhookUrl}
              onChange={(e) => updateField("webhookUrl", e.target.value)}
              placeholder="https://seu-webhook.com/..."
              type="url"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Google Tag Manager ID</label>
            <Input
              value={config.gtmId}
              onChange={(e) => updateField("gtmId", e.target.value)}
              placeholder="GTM-XXXXXXX"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Google Meu Negócio URL</label>
            <Input
              value={config.googleBusinessUrl}
              onChange={(e) => updateField("googleBusinessUrl", e.target.value)}
              placeholder="https://g.page/..."
              type="url"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Google Analytics ID (opcional)</label>
            <Input
              value={config.googleAnalyticsId || ""}
              onChange={(e) => updateField("googleAnalyticsId", e.target.value)}
              placeholder="G-XXXXXXX"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Google Ads (sem GTM)</CardTitle>
          <CardDescription>Configuração de conversão do Google Ads sem Google Tag Manager</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">ID de conversão (Conversion ID)</label>
            <Input
              value={config.googleAds.conversionId}
              onChange={(e) => updateField("googleAds", { ...config.googleAds, conversionId: e.target.value })}
              placeholder="AW-700923237"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Exemplo: AW-700923237
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Rótulo de conversão (Conversion Label)</label>
            <Input
              value={config.googleAds.conversionLabel}
              onChange={(e) => updateField("googleAds", { ...config.googleAds, conversionLabel: e.target.value })}
              placeholder="Qjg0CPHd6sAbEOX6nM4C"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Exemplo: Qjg0CPHd6sAbEOX6nM4C
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Salvar Configuração</CardTitle>
          <CardDescription>Salve as alterações diretamente no arquivo siteConfig.ts</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSaveConfig} className="w-full" size="lg">
            <Save className="h-4 w-4 mr-2" />
            Salvar no siteConfig.ts
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gerar Snippets</CardTitle>
          <CardDescription>Copie os snippets gerados para seus arquivos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">siteConfig.ts</label>
              <Button onClick={handleCopySiteConfig} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </Button>
            </div>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs max-h-96 overflow-y-auto">
              <code>{generateSiteConfigSnippet()}</code>
            </pre>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">.env</label>
              <Button onClick={handleCopyEnv} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </Button>
            </div>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
              <code>{generateEnvSnippet() || "# Nenhuma variável de ambiente configurada"}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
