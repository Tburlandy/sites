# Guia de Teste - Webhook e Integração com Apps Script

Este documento descreve o fluxo de teste para validar o envio de dados do formulário para o webhook/Apps Script.

## 📋 Pré-requisitos

1. Ter o projeto rodando localmente (`npm run dev`)
2. Ter acesso ao [webhook.site](https://webhook.site/) para testes de debug
3. Ter a URL do Google Apps Script configurada no `siteConfig.ts`

## 🔧 Configuração do Ambiente

### Arquivo `src/config/siteConfig.ts`

A URL do webhook é configurada diretamente no arquivo de configuração do site:

```typescript
// URL do webhook para envio de formulários
// Para testes com webhook.site: https://webhook.site/SEU_UUID_AQUI
// Para produção (Apps Script): https://script.google.com/macros/s/SEU_SCRIPT_ID/exec
webhookUrl: "",
```

**⚠️ Importante:** Configure a URL diretamente no arquivo `src/config/siteConfig.ts` na propriedade `webhookUrl`.

## 🧪 Teste 1: Validação do Payload com webhook.site

### Passo 1: Criar endpoint de teste

1. Acesse [webhook.site](https://webhook.site/)
2. Copie a URL única gerada (ex: `https://webhook.site/abc123-def456-...`)

### Passo 2: Configurar `siteConfig.ts`

Abra o arquivo `src/config/siteConfig.ts` e configure a URL do webhook:

```typescript
webhookUrl: "https://webhook.site/SEU_UUID_AQUI",
```

### Passo 3: Iniciar o projeto

```bash
npm run dev
```

### Passo 4: Testar formulário principal

1. Abra o site em `http://localhost:5173` (ou a porta indicada)
2. Preencha o formulário principal:
   - **Nome**: Teste Webhook
   - **Telefone**: (21) 99999-9999
3. Clique em "Agendar minha avaliação"

### Passo 5: Validar no webhook.site

No painel do webhook.site, verifique:

✅ **Request Method**: `POST`

✅ **Content-Type**: `application/x-www-form-urlencoded`

✅ **Body contém todas as chaves esperadas**:
- `Nome`
- `Telefone`
- `Forma_de_Contato` (deve ser `"Formulário"`)
- `CampanhaID`
- `GrupoID`
- `Extensão`
- `CorrespondenciaPalavra`
- `Dispositivo`
- `Anuncio`
- `PalavraChave`
- `canal_id`
- `form_id` (deve ser `"54b01719"`)
- `form_name` (deve ser `"Acompanhamento"`)
- `Data` (formato: `DD/MM/YYYY`)
- `Horário` (formato: `HH:mm`)

❌ **NÃO deve conter**: `"Forma de Contato"` (com espaço)

### Passo 6: Testar popup de WhatsApp

1. Abra o popup de WhatsApp no site
2. Preencha:
   - **Nome**: Teste Popup
   - **Telefone**: (21) 88888-8888
3. Clique em "Iniciar conversa no WhatsApp"

### Passo 7: Validar popup no webhook.site

Verifique que:
- `Forma_de_Contato` = `"WhatsApp"`
- Todos os outros campos estão presentes

## 🎯 Teste 2: Integração com Apps Script / Planilha

### Passo 1: Configurar `siteConfig.ts` para produção

Abra o arquivo `src/config/siteConfig.ts` e configure a URL do Apps Script:

```typescript
webhookUrl: "https://script.google.com/macros/s/SEU_SCRIPT_ID/exec",
```

### Passo 2: Reiniciar o servidor

```bash
# Parar o servidor (Ctrl+C) e iniciar novamente
npm run dev
```

### Passo 3: Enviar leads de teste

1. **Formulário principal**:
   - Preencha com dados reais
   - Envie o formulário

2. **Popup WhatsApp**:
   - Abra o popup
   - Preencha com dados reais
   - Envie

### Passo 4: Validar na planilha

Abra a planilha conectada ao Apps Script e verifique:

✅ Uma nova linha foi criada para cada envio

✅ Campos preenchidos corretamente:
- `Nome`
- `Telefone`
- `Data`
- `Horário`
- `Forma de Contato` (na planilha pode ter espaço, mesmo que o POST use underscore)
- `form_id` = `54b01719`
- `form_name` = `Acompanhamento`

✅ Campos de tracking (se presentes na URL):
- `CampanhaID`
- `GrupoID`
- `Extensão`
- etc.

## 🔍 Checklist de Validação

### Payload do POST

- [ ] Content-Type é `application/x-www-form-urlencoded`
- [ ] Campo `Forma_de_Contato` usa underscore (não espaço)
- [ ] `form_id` = `"54b01719"`
- [ ] `form_name` = `"Acompanhamento"`
- [ ] Data no formato `DD/MM/YYYY`
- [ ] Horário no formato `HH:mm`
- [ ] Todos os campos de tracking estão presentes (mesmo que vazios)

### Integração com Apps Script

- [ ] Cada envio cria uma nova linha na planilha
- [ ] Dados são salvos corretamente nas colunas correspondentes
- [ ] `form_id` e `form_name` batem com os valores esperados
- [ ] Formulário principal e popup funcionam corretamente

## 🐛 Troubleshooting

### Problema: Payload não aparece no webhook.site

- Verifique se a URL no `siteConfig.ts` está correta
- Verifique se o servidor foi reiniciado após alterar `siteConfig.ts`
- Verifique o console do navegador para erros

### Problema: Dados não aparecem na planilha

- Verifique se a URL do Apps Script está correta no `siteConfig.ts`
- Verifique se o Apps Script tem permissões para editar a planilha
- Verifique os logs de execução do Apps Script (se disponível)

### Problema: Campo `Forma_de_Contato` aparece como `Forma de Contato`

- Verifique se as alterações foram aplicadas nos arquivos:
  - `src/components/MainContactForm.tsx`
  - `src/components/ContactPopup.tsx`
- Limpe o cache do navegador e reinicie o servidor

## 📝 Notas Importantes

1. O formato do POST é **idêntico** ao que o Elementor enviava
2. O campo `Forma_de_Contato` usa underscore no POST, mas na planilha pode aparecer como `Forma de Contato` (isso é normal)
3. O `Content-Type` deve ser exatamente `application/x-www-form-urlencoded`
4. Todos os campos de tracking são opcionais e podem estar vazios

