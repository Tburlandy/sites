# 🚀 Guia de Deploy no cPanel

Este guia explica como fazer o deploy deste site estático React no cPanel.

## 📋 Pré-requisitos

1. ✅ Acesso ao cPanel da sua hospedagem
2. ✅ Credenciais FTP ou acesso ao File Manager do cPanel
3. ✅ Node.js instalado localmente (para fazer o build)

## 🔧 Passo a Passo

### 1. Preparar o Build Localmente

No seu computador, execute os seguintes comandos:

```bash
# Navegue até a pasta do projeto
cd "/Users/theoburlandy/ProjetosAI/Sites/implante - usar/evo-smile-studio-75026-main"

# Instale as dependências (se ainda não fez)
npm install

# Faça o build de produção
npm run build
```

Isso criará uma pasta `dist` com todos os arquivos estáticos prontos para deploy.

### 2. Verificar o Conteúdo da Pasta `dist`

Após o build, você deve ter uma estrutura similar a:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
├── images/
│   ├── doctor/
│   ├── logo/
│   ├── smiles/
│   └── ...
├── videos/
│   └── stories/
├── favicon.ico
├── robots.txt
├── sitemap.xml
└── .htaccess
```

### 3. Acessar o cPanel

1. Acesse o cPanel da sua hospedagem
2. Faça login com suas credenciais
3. Localize a seção **"Arquivos"** ou **"Files"**

### 4. Upload dos Arquivos

Você tem duas opções:

#### Opção A: File Manager do cPanel (Recomendado)

1. Abra o **File Manager**
2. Navegue até a pasta `public_html` (ou `www` dependendo da hospedagem)
3. **IMPORTANTE:** Se você já tem arquivos lá, faça backup primeiro!
4. Selecione todos os arquivos dentro de `public_html` e delete (ou mova para backup)
5. Clique em **"Upload"** no topo
6. Selecione todos os arquivos da pasta `dist` do seu projeto
7. Aguarde o upload completar

#### Opção B: FTP (FileZilla, WinSCP, etc.)

1. Use um cliente FTP (FileZilla, WinSCP, Cyberduck, etc.)
2. Conecte-se usando as credenciais FTP do cPanel:
   - **Host:** ftp.seudominio.com (ou IP do servidor)
   - **Usuário:** seu usuário do cPanel
   - **Senha:** sua senha do cPanel
   - **Porta:** 21 (ou 22 para SFTP)
3. Navegue até `public_html`
4. Faça upload de todos os arquivos da pasta `dist`

### 5. Verificar Permissões

No File Manager do cPanel:

1. Selecione a pasta `public_html`
2. Clique em **"Permissões"** ou **"Change Permissions"**
3. Certifique-se de que:
   - Pastas: `755` (drwxr-xr-x)
   - Arquivos: `644` (-rw-r--r--)

### 6. Verificar o Arquivo .htaccess

Certifique-se de que o arquivo `.htaccess` foi enviado corretamente. Ele é essencial para o React Router funcionar.

Se o arquivo não aparecer no File Manager:
- No File Manager, ative a opção **"Mostrar arquivos ocultos"** ou **"Show Hidden Files"**
- Ou crie manualmente o arquivo `.htaccess` no cPanel com o conteúdo do arquivo `public/.htaccess`

### 7. Testar o Site

1. Acesse seu domínio no navegador
2. Verifique se o site carrega corretamente
3. Teste as rotas:
   - `/` - Página inicial
   - `/obrigado` - Página de agradecimento
   - Qualquer rota deve redirecionar para a página inicial (React Router)

## ⚠️ Problemas Comuns e Soluções

### Problema: Página em branco

**Solução:**
- Verifique se o arquivo `.htaccess` está presente
- Verifique as permissões dos arquivos
- Verifique o console do navegador (F12) para erros

### Problema: 404 em rotas específicas

**Solução:**
- Certifique-se de que o `.htaccess` está configurado corretamente
- Verifique se o módulo `mod_rewrite` está habilitado no servidor (contate o suporte se necessário)

### Problema: Imagens não carregam

**Solução:**
- Verifique se a pasta `images` foi enviada completamente
- Verifique as permissões da pasta `images` (deve ser 755)
- Verifique os caminhos no código (devem começar com `/images/`)

### Problema: CSS/JS não carregam

**Solução:**
- Verifique se a pasta `assets` foi enviada
- Limpe o cache do navegador (Ctrl+F5 ou Cmd+Shift+R)
- Verifique se os arquivos têm permissão 644

## 🔄 Atualizações Futuras

Para atualizar o site:

1. Faça as alterações no código localmente
2. Execute `npm run build` novamente
3. Faça upload apenas dos arquivos alterados (ou todos para garantir)
4. Limpe o cache do navegador ao testar

## 📝 Notas Importantes

- ⚠️ **NÃO** faça upload da pasta `node_modules` - ela não é necessária em produção
- ⚠️ **NÃO** faça upload da pasta `src` - apenas o conteúdo de `dist`
- ⚠️ **NÃO** faça upload de arquivos `.env` - variáveis de ambiente devem ser configuradas no cPanel se necessário
- ✅ O arquivo `.htaccess` é essencial para o React Router funcionar
- ✅ Certifique-se de que todas as imagens e vídeos da pasta `public` foram incluídos no build

## 🎯 Checklist Final

Antes de considerar o deploy completo, verifique:

- [ ] Build executado com sucesso (`npm run build`)
- [ ] Pasta `dist` contém todos os arquivos necessários
- [ ] Arquivo `.htaccess` está presente
- [ ] Todos os arquivos foram enviados para `public_html`
- [ ] Permissões estão corretas (pastas: 755, arquivos: 644)
- [ ] Site carrega corretamente no navegador
- [ ] Rotas do React Router funcionam
- [ ] Imagens e vídeos carregam corretamente
- [ ] Formulários funcionam (se aplicável)

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs de erro do cPanel
2. Verifique o console do navegador (F12)
3. Entre em contato com o suporte da hospedagem se necessário

---

**Boa sorte com o deploy! 🚀**

