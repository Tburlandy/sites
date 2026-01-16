# Guia Completo: Configurar Google Tag Manager e Criar Conversão

## 📋 Passo a Passo

### 1️⃣ Criar/Obter Container do Google Tag Manager

1. Acesse: https://tagmanager.google.com
2. Se não tiver um container, clique em **"Criar Contêiner"**
3. Nomeie o container (ex: "Top Implantes Website")
4. Escolha **"Web"** como tipo
5. Copie o **GTM ID** que aparece (formato: `GTM-XXXXXXX`)

### 2️⃣ Configurar GTM ID no Dev Studio

1. Acesse: `http://localhost:8080/dev/studio`
2. Vá na aba **"Config"**
3. No campo **"Google Tag Manager ID"**, cole o GTM ID (ex: `GTM-XXXXXXX`)
4. Clique em **"Salvar Configuração"**
5. Recarregue a página do site

### 3️⃣ Criar Tag de Conversão no GTM

1. No Google Tag Manager, vá em **"Tags"** (menu lateral)
2. Clique em **"Nova"**
3. Configure a tag:
   - **Nome da Tag:** `Conversão - Formulário de Contato`
   - **Tipo de Tag:** Escolha **"Google Ads: Conversão Tracking"**
   
4. **Configuração da Tag:**
   - **ID de conversão:** Cole seu `AW-700923237` (ou o ID da sua conta Google Ads)
   - **Rótulo de conversão:** Cole seu `Qjg0CPHd6sAbEOX6nM4C` (ou o rótulo da conversão)
   - **Tipo de conversão:** Escolha **"Sem valor"** ou **"Valor fixo"** (se quiser atribuir valor)
   - **Moeda:** BRL (Real Brasileiro)

5. **Acionamento (Trigger):**
   - Clique em **"Escolher acionamento"**
   - Clique em **"+"** para criar novo acionamento
   - **Nome:** `Formulário Enviado`
   - **Tipo:** Escolha **"Evento personalizado"**
   - **Nome do evento:** Digite exatamente: `lead_submit` (sem aspas, sem espaços)
   - ⚠️ **IMPORTANTE:** 
     - O campo "Nome do evento" deve conter apenas `lead_submit`
     - O campo "Este acionador é disparado em" deve mostrar automaticamente algo como "Alguns eventos personalizados" ou o nome do evento específico
     - **NÃO** deixe como "Todos os eventos personalizados" - isso fará o trigger disparar para qualquer evento
     - Se aparecer "Todos os eventos personalizados", você precisa configurar um filtro adicional
   - **Se aparecer "Todos os eventos personalizados":**
     - Clique em "Alguns eventos personalizados"
     - No primeiro campo (dropdown), clique e escolha a variável **"Event"** (está na categoria "Utilitários")
     - No segundo campo, escolha **"é igual a"** (ou "equals")
     - No terceiro campo (texto), digite: `lead_submit`
     - ⚠️ **IMPORTANTE:** A variável "Event" deve estar ativada nas variáveis integradas do GTM (geralmente já vem ativada por padrão)
   - Salve o acionamento
   - Selecione este acionamento na tag

6. **Salvar a Tag:**
   - Clique em **"Salvar"**
   - Clique em **"Enviar"** (canto superior direito)
   - Adicione um nome de versão (ex: "Adicionar conversão formulário")
   - Clique em **"Publicar"**

### 4️⃣ Verificar se está Funcionando

1. No GTM, vá em **"Visualização"** (Preview)
2. Digite a URL do seu site: `http://localhost:8080`
3. Clique em **"Conectar"**
4. Uma nova aba abrirá com seu site
5. Preencha e envie o formulário
6. Volte para a aba do GTM Preview
7. Deve aparecer o evento `lead_submit` disparado
8. Verifique se a tag de conversão foi acionada

### 5️⃣ Testar Conversão no Google Ads

1. Aguarde alguns minutos após o teste
2. No Google Ads, vá em **"Metas"** (Conversões)
3. Clique na sua ação de conversão
4. Vá na aba **"Histórico"**
5. Deve aparecer a conversão testada

## 🔧 Eventos Disponíveis no DataLayer

O código já envia os seguintes eventos para o GTM:

- **`lead_submit`** - Disparado quando o formulário é enviado
  - `form_origin: "formulario"` - Formulário principal
  - `form_origin: "popup_whatsapp"` - Formulário do popup WhatsApp

Você pode criar triggers no GTM baseados nesses eventos.

## 🔧 Solução de Problemas

### Tag Falhando no GTM Preview

Se a tag "Google Ads Conversion Tracking" aparecer como "Falhou" no GTM Preview:

1. **Verifique se o script do Google Ads está carregado:**
   - Abra o Console do navegador (F12)
   - Digite `window.gtag` e pressione Enter
   - Se retornar `undefined`, o script não está carregado
   - Verifique se o `conversionId` está configurado no Dev Studio

2. **Verifique a configuração do Trigger:**
   - O trigger deve ser do tipo **"Evento personalizado"**
   - O nome do evento deve ser exatamente: `lead_submit` (sem aspas, sem espaços extras)
   - ⚠️ **CRÍTICO:** O campo "Este acionador é disparado em" deve estar como **"Alguns eventos personalizados"**
   - A condição deve ser configurada assim:
     - **Primeiro campo:** Escolha a variável **"Event"** (categoria "Utilitários")
     - **Segundo campo:** Escolha **"é igual a"** (ou "equals")
     - **Terceiro campo:** Digite `lead_submit`
   - ⚠️ **IMPORTANTE:** Certifique-se de que a variável integrada "Event" está ativada no GTM (vá em Variáveis > Variáveis integradas e verifique se "Event" está marcada)

3. **Verifique se o evento está sendo enviado:**
   - No GTM Preview, vá na aba **"Camada de dados"**
   - Procure por `event: "lead_submit"`
   - Se não aparecer, o evento não está sendo enviado corretamente

4. **Aguarde o script carregar:**
   - O código agora aguarda 100ms antes de enviar o evento para garantir que o `gtag` está carregado
   - Se ainda falhar, pode ser necessário aumentar o delay ou verificar a conexão com o Google Ads

### Tag não dispara

- Verifique se o GTM ID está correto no Dev Studio
- Verifique se a versão do GTM foi publicada (não apenas salva)
- Limpe o cache do navegador e teste novamente
- Use o modo Preview do GTM para debug em tempo real

## 📝 Notas Importantes

- O GTM ID deve estar no formato `GTM-XXXXXXX`
- Após configurar no Dev Studio, recarregue a página
- O GTM carrega automaticamente quando o ID está configurado
- Os eventos são enviados automaticamente quando os formulários são submetidos
- O código aguarda 100ms antes de enviar o evento para garantir que o `gtag` está carregado
- A função `trackLeadFormConversion()` tenta disparar a conversão diretamente via `gtag` e também envia o evento para o GTM

