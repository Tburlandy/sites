# 📦 Instruções para Upload no cPanel

## ✅ O que está pronto

A pasta `dist/` está pronta com todos os arquivos necessários:
- ✅ `.htaccess` configurado para `/pagina/`
- ✅ `index.html` com caminhos corretos
- ✅ Pasta `assets/` com todos os arquivos (13 arquivos)
- ✅ Pasta `images/` com imagens
- ✅ Pasta `videos/` com vídeos
- ✅ Arquivos: `favicon.ico`, `robots.txt`, `sitemap.xml`

## 📦 Passo 1: Criar o ZIP

1. No Finder (Mac), navegue até a pasta do projeto
2. Entre na pasta `dist/`
3. Selecione **TODOS** os arquivos e pastas dentro de `dist/`
4. Clique com botão direito → **"Comprimir X itens"**
5. Isso criará um arquivo `dist.zip` ou `Arquivo.zip`

**OU** use o terminal:
```bash
cd "/Users/theoburlandy/ProjetosAI/Sites/implante - usar/evo-smile-studio-75026-main/dist"
zip -r dist.zip .
```

## 🚀 Passo 2: No cPanel

### 2.1. Limpar a pasta `pagina`

1. Acesse File Manager
2. Navegue até `autoescolaavena.fun/pagina/`
3. **Selecione TODOS os arquivos e pastas**
4. Clique em **"Excluir"** ou **"Delete"**
5. Confirme a exclusão

### 2.2. Fazer upload do ZIP

1. Dentro da pasta `pagina/` (agora vazia)
2. Clique em **"Carregar"** ou **"Upload"**
3. Selecione o arquivo `dist.zip` que você criou
4. Aguarde o upload completar (100%)

### 2.3. Extrair o ZIP

1. Selecione o arquivo `dist.zip` que você acabou de fazer upload
2. Clique em **"Extrair"** ou **"Extract"**
3. Escolha extrair na pasta atual (`pagina/`)
4. Confirme a extração

### 2.4. Verificar estrutura

Após extrair, você deve ver dentro de `pagina/`:
```
pagina/
├── .htaccess          ← IMPORTANTE! (pode estar oculto)
├── index.html
├── assets/            ← Pasta com arquivos JS/CSS
├── images/            ← Pasta com imagens
├── videos/            ← Pasta com vídeos
├── favicon.ico
├── robots.txt
└── sitemap.xml
```

### 2.5. Deletar o ZIP

1. Selecione o arquivo `dist.zip`
2. Clique em **"Excluir"** ou **"Delete"**

### 2.6. Verificar permissões

**IMPORTANTE:** Corrija as permissões:

1. Selecione a pasta `assets/`
   - Clique em **"Permissões"**
   - Mude para: `755` ✅
   
2. Selecione a pasta `images/`
   - Clique em **"Permissões"**
   - Mude para: `755` ✅
   
3. Selecione a pasta `videos/`
   - Clique em **"Permissões"**
   - Mude para: `755` ✅

**Arquivos** devem ter `644` (geralmente já está correto)

### 2.7. Verificar arquivo .htaccess

1. No File Manager, ative **"Mostrar arquivos ocultos"** ou **"Show Hidden Files"**
2. Verifique se o arquivo `.htaccess` está presente dentro de `pagina/`
3. Se não estiver, você precisará criá-lo manualmente (veja conteúdo abaixo)

## ✅ Passo 3: Testar

Acesse no navegador:
```
https://autoescolaavena.fun/pagina/
```

O site deve carregar completamente!

## 🐛 Se ainda não funcionar

### Verificar se o .htaccess está presente

Se o arquivo `.htaccess` não aparecer após extrair:

1. No File Manager, dentro de `pagina/`
2. Clique em **"Novo arquivo"** ou **"Create File"**
3. Nomeie como: `.htaccess` (com o ponto no início)
4. Cole este conteúdo:

```apache
# Configuração para React Router (SPA)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /pagina/
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /pagina/index.html [L]
</IfModule>

# Compressão GZIP
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Cache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType video/mp4 "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

Options -Indexes
```

5. Salve o arquivo

---

**Pronto! O site deve funcionar agora! 🎉**

