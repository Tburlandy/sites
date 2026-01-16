# 📁 Guia: Instalar Site em Subpasta `/pagina` no cPanel

Este guia explica como instalar o site em uma subpasta sem afetar o site principal do domínio.

## ✅ O que foi configurado

O site já está configurado para funcionar em `/pagina/`:
- ✅ `vite.config.ts` configurado com `base: '/pagina/'`
- ✅ `.htaccess` configurado para a subpasta
- ✅ Build feito com os caminhos corretos

## 🚀 Passo a Passo no cPanel

### 1. Acessar o File Manager

1. Faça login no cPanel
2. Abra o **File Manager**
3. Navegue até `public_html`

### 2. Criar a Pasta `/pagina`

1. No File Manager, clique em **"Nova Pasta"** ou **"Create Folder"**
2. Nomeie como: `pagina`
3. Clique em **"Criar"** ou **"Create"**

### 3. Fazer Upload dos Arquivos

1. Entre na pasta `pagina` que você acabou de criar
2. Clique em **"Upload"** no topo
3. Selecione **TODOS os arquivos** da pasta `dist` do seu projeto:
   - `index.html`
   - `.htaccess` ⚠️ IMPORTANTE!
   - Pasta `assets/` (com todo o conteúdo)
   - Pasta `images/` (com todo o conteúdo)
   - Pasta `videos/` (com todo o conteúdo)
   - `favicon.ico`
   - `robots.txt`
   - `sitemap.xml`
   - Todos os outros arquivos

### 4. Verificar Permissões

1. Selecione a pasta `pagina`
2. Clique em **"Permissões"** ou **"Change Permissions"**
3. Configure:
   - **Pastas:** `755` (drwxr-xr-x)
   - **Arquivos:** `644` (-rw-r--r--)

### 5. Verificar Arquivo .htaccess

⚠️ **IMPORTANTE:** Certifique-se de que o arquivo `.htaccess` foi enviado!

- No File Manager, ative **"Mostrar arquivos ocultos"** ou **"Show Hidden Files"**
- O arquivo `.htaccess` deve estar dentro da pasta `pagina/`

### 6. Testar

Acesse no navegador:
```
https://seudominio.com.br/pagina/
```

O site deve carregar normalmente!

## 📂 Estrutura Final no cPanel

Após a instalação, você terá:

```
public_html/
├── [arquivos do site principal]  ← Site principal (não alterado)
└── pagina/                        ← Seu novo site aqui
    ├── index.html
    ├── .htaccess
    ├── assets/
    ├── images/
    ├── videos/
    ├── favicon.ico
    ├── robots.txt
    └── sitemap.xml
```

## ✅ Checklist

Antes de considerar concluído:

- [ ] Pasta `pagina` criada em `public_html`
- [ ] Todos os arquivos da pasta `dist` foram enviados para `pagina/`
- [ ] Arquivo `.htaccess` está presente em `pagina/`
- [ ] Permissões corretas (pastas: 755, arquivos: 644)
- [ ] Site acessível em `https://seudominio.com.br/pagina/`
- [ ] Imagens carregam corretamente
- [ ] Rotas do React Router funcionam (ex: `/pagina/obrigado`)

## 🔄 Atualizações Futuras

Para atualizar o site na subpasta:

1. Faça as alterações no código localmente
2. Execute `npm run build` novamente
3. Faça upload apenas dos arquivos alterados na pasta `public_html/pagina/`
4. Ou substitua todos os arquivos para garantir

## ⚠️ Importante

- ✅ O site principal em `public_html/` **NÃO será afetado**
- ✅ Os dois sites funcionam independentemente
- ✅ O novo site estará disponível em `seudominio.com.br/pagina/`
- ✅ O site principal continua em `seudominio.com.br/`

## 🐛 Problemas Comuns

### Site não carrega em `/pagina/`

- Verifique se o arquivo `.htaccess` está na pasta `pagina/`
- Verifique as permissões da pasta `pagina` (deve ser 755)
- Verifique se o `index.html` está dentro de `pagina/`

### Imagens não aparecem

- Verifique se a pasta `images/` foi enviada completamente
- Verifique os caminhos no console do navegador (F12)
- Os caminhos devem começar com `/pagina/images/...`

### CSS/JS não carregam

- Verifique se a pasta `assets/` foi enviada
- Limpe o cache do navegador (Ctrl+F5)
- Verifique o console do navegador para erros 404

---

**Pronto! Seu site está instalado em `/pagina` sem afetar o site principal! 🎉**

