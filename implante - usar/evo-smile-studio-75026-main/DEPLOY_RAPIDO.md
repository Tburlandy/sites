# ⚡ Deploy Rápido - Resumo

## 1️⃣ Build do Projeto

```bash
cd "/Users/theoburlandy/ProjetosAI/Sites/implante - usar/evo-smile-studio-75026-main"
npm run build
```

Isso cria a pasta `dist/` com todos os arquivos prontos.

## 2️⃣ Upload no cPanel

### Via File Manager:
1. Acesse cPanel → **File Manager**
2. Vá para `public_html`
3. **Delete** ou faça backup dos arquivos antigos
4. **Upload** todos os arquivos da pasta `dist/`

### Via FTP:
- Conecte no `public_html`
- Faça upload de todos os arquivos de `dist/`

## 3️⃣ Verificar

- ✅ Arquivo `.htaccess` está presente
- ✅ Permissões: pastas `755`, arquivos `644`
- ✅ Acesse seu domínio e teste

## 📁 O que enviar?

**Envie TUDO que está dentro da pasta `dist/`:**
- `index.html`
- `.htaccess` ⚠️ IMPORTANTE!
- Pasta `assets/`
- Pasta `images/`
- Pasta `videos/`
- `favicon.ico`
- `robots.txt`
- `sitemap.xml`
- Todos os outros arquivos

## ❌ O que NÃO enviar?

- `node_modules/`
- `src/`
- `.env`
- Arquivos de desenvolvimento

---

📖 **Guia completo:** Veja `GUIA_DEPLOY_CPANEL.md` para detalhes.

