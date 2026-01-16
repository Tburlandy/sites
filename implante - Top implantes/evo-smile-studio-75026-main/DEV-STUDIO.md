# Painel Dev Studio - Guia de Uso

## Visão Geral

O Painel Dev Studio é uma ferramenta de desenvolvimento que permite gerenciar mídias (imagens e vídeos) e editar configurações do site através de uma interface web.

## Como Usar

### 1. Instalar Dependências

```bash
npm install
```

### 2. Iniciar o Servidor Dev

Para rodar o painel com o servidor de upload:

```bash
npm run dev:studio
```

Isso iniciará:
- Servidor Express na porta 3001 (para uploads)
- Vite dev server na porta padrão (5173)

### 3. Acessar o Painel

Abra no navegador: `http://localhost:5173/dev/studio`

## Funcionalidades

### Aba "Mídias"

#### Upload de Mídias

1. **Selecione a seção do site:**
   - "Mais de 3.000 sorrisos transformados" → Galeria de imagens
   - "Quem vai cuidar de você?" → Imagem única do dentista
   - "Histórias reais..." → Vídeos de depoimentos

2. **Faça upload:**
   - Arraste e solte arquivos ou clique para selecionar
   - Suporta imagens (JPG, PNG, WebP) e vídeos (MP4, WebM)

3. **Configure:**
   - Adicione uma descrição (opcional)
   - Para vídeos, você pode adicionar um poster (imagem)

4. **Salve no site:**
   - Clique em "Salvar no Site"
   - A mídia será processada e salva em `public/images/` ou `public/videos/`
   - O arquivo `src/content/mediaSections.json` será atualizado automaticamente

#### Gerenciar Mídias Salvas

- Visualize todas as mídias salvas por seção
- Copie snippets JSX para usar no código
- Remova mídias que não são mais necessárias

**Nota:** A seção "Quem vai cuidar de você?" aceita apenas 1 imagem. Ao fazer upload de uma nova, a anterior será substituída.

### Aba "Config"

Edite as configurações do site:

- **Informações da Clínica:** Nome, cidade, UF, endereço, CEP
- **Contato:** WhatsApp (formato E.164), telefone fixo
- **IDs de Formulário:** Canal ID, Form ID, Form Name
- **Integrações:** Webhook URL, GTM ID, Google Meu Negócio, Google Analytics

As alterações são salvas automaticamente no `localStorage` e você pode gerar snippets de:
- `siteConfig.ts` - Código TypeScript completo
- `.env` - Variáveis de ambiente

## Estrutura de Arquivos

```
src/
  content/
    mediaSections.json    # Arquivo JSON com todas as mídias
  components/
    dev/
      MediaStudio.tsx     # Componente de upload de mídias
      ConfigEditor.tsx    # Editor de configurações
  types/
    media.ts              # Tipos TypeScript para mídias

public/
  images/
    smiles/               # Imagens da galeria de sorrisos
    doctor/               # Imagem do dentista
    stories/              # Posters de vídeos
  videos/
    stories/              # Vídeos de depoimentos

dev-server.cjs            # Servidor Express para uploads (só dev)
```

## Como Funciona

1. **Upload de Imagem:**
   - Imagem é redimensionada automaticamente (máx. 1000px ou 1400px para doctor)
   - Convertida para WebP com qualidade 80%
   - Salva em `public/images/[seção]/`
   - Entrada adicionada ao `mediaSections.json`

2. **Upload de Vídeo:**
   - Vídeo é copiado para `public/videos/stories/`
   - Se houver poster, é processado como imagem
   - Entrada adicionada ao `mediaSections.json`

3. **Atualização do Site:**
   - Os componentes `SmileGallery`, `Dentist` e `VideoTestimonials` leem o `mediaSections.json`
   - Qualquer mudança no JSON reflete imediatamente no site

## Segurança

⚠️ **IMPORTANTE:** O servidor dev (`dev-server.cjs`) é apenas para desenvolvimento local. **NÃO** deve ser usado em produção.

- O servidor escuta apenas em `localhost:3001`
- Não há autenticação (apenas para dev)
- Arquivos são salvos diretamente no sistema de arquivos

## Troubleshooting

### Erro ao fazer upload

- Verifique se o servidor dev está rodando (`npm run dev:server`)
- Verifique se a porta 3001 está livre
- Verifique os logs do console do servidor

### Mídias não aparecem no site

- Verifique se o arquivo foi salvo em `public/images/` ou `public/videos/`
- Verifique se o `mediaSections.json` foi atualizado
- Recarregue a página do site

### Erro ao processar imagem

- Verifique se o arquivo é uma imagem válida
- Verifique se há espaço em disco suficiente
- Verifique os logs do servidor

## Próximos Passos

Após fazer upload das mídias e editar as configurações:

1. Teste o site em `http://localhost:5173`
2. Verifique se todas as seções estão corretas
3. Faça o build: `npm run build`
4. Deploy para produção

