# Guia de Teste do Webhook

Este documento descreve como testar o envio de dados do formulário para o webhook, seguindo o padrão do Elementor.

## Formato do POST

O formulário envia um POST `application/x-www-form-urlencoded` com os seguintes campos:

- `Nome` - Nome completo do usuário
- `Telefone` - Telefone formatado (ex: "(21) 99999-9999")
- `Forma_de_Contato` - "Formulário" ou "Popup WhatsApp"
- `CampanhaID` - ID da campanha (vazio se não houver)
- `GrupoID` - ID do grupo (vazio se não houver)
- `Extensão` - Extensão (vazio se não houver)
- `CorrespondenciaPalavra` - Palavra correspondente (vazio se não houver)
- `Dispositivo` - Tipo de dispositivo (vazio se não houver)
- `Anuncio` - ID do anúncio (vazio se não houver)
- `PalavraChave` - Palavra-chave (vazio se não houver)
- `canal_id` - ID do canal (de `SITE_CONFIG.canalId`)
- `form_id` - ID do formulário (de `SITE_CONFIG.formId` = "54b01719")
- `form_name` - Nome do formulário (de `SITE_CONFIG.formName` = "Acompanhamento")
- `Data` - Data no formato DD/MM/YYYY
- `Horário` - Horário no formato HH:MM

## Teste com webhook.site

1. Acesse [webhook.site](https://webhook.site/) e copie a URL única gerada.

2. No arquivo `src/config/siteConfig.ts`, altere temporariamente o `webhookUrl`:

```typescript
webhookUrl: "https://webhook.site/SEU_UUID_AQUI",
```

3. Execute o projeto:

```bash
npm run dev
```

4. Preencha o formulário principal:
   - Nome: qualquer nome de teste
   - Telefone: qualquer telefone válido

5. Submeta o formulário e verifique no webhook.site:
   - **Request Method**: `POST`
   - **Content-Type**: `application/x-www-form-urlencoded`
   - **Body**: Deve conter todos os campos listados acima
   - **Forma_de_Contato**: Deve ser "Formulário" (com underscore, não espaço)

6. Teste também o popup de WhatsApp:
   - Clique no botão WhatsApp
   - Preencha o formulário
   - Verifique que `Forma_de_Contato` = "Popup WhatsApp"

## Teste com Google Apps Script

1. No arquivo `src/config/siteConfig.ts`, configure o `webhookUrl` com a URL do seu Apps Script:

```typescript
webhookUrl: "https://script.google.com/macros/s/SEU_SCRIPT_ID/exec",
```

2. Execute o projeto:

```bash
npm run dev
```

3. Envie um lead pelo formulário principal e outro pelo popup.

4. Abra a planilha do Google Sheets conectada ao Apps Script e verifique:
   - Uma nova linha foi criada para cada envio
   - `form_id` = "54b01719"
   - `form_name` = "Acompanhamento"
   - Campos `Nome`, `Telefone`, `Data`, `Horário` estão preenchidos
   - Campo `Forma de Contato` (na planilha pode ter espaço no cabeçalho) está correto

## Validações

✅ Todos os campos devem estar presentes no POST
✅ `Forma_de_Contato` deve usar underscore (não espaço)
✅ `form_id` e `form_name` devem corresponder aos valores da planilha
✅ Telefone deve estar formatado como "(XX) XXXXX-XXXX"
✅ Data deve estar no formato DD/MM/YYYY
✅ Horário deve estar no formato HH:MM

## Troubleshooting

### Webhook não está sendo chamado
- Verifique se `webhookUrl` está configurado em `siteConfig.ts`
- Verifique o console do navegador para erros
- Verifique se o modo `no-cors` está habilitado (necessário para Google Apps Script)

### Dados não aparecem na planilha
- Verifique se o Apps Script está publicado como "App da Web"
- Verifique se o Apps Script tem permissão para editar a planilha
- Verifique os logs de execução do Apps Script no Google Cloud Console

### Campos estão vazios na planilha
- Verifique se os nomes dos campos no POST correspondem aos esperados pelo Apps Script
- Verifique se o Apps Script está lendo os parâmetros corretamente

