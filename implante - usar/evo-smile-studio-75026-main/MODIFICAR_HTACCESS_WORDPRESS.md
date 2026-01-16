# 🔧 Como Modificar o .htaccess do WordPress para Funcionar com /pagina/

## ⚠️ IMPORTANTE
Este guia mostra como modificar o `.htaccess` na **RAIZ** do WordPress (não dentro de `/pagina/`) para permitir que o React funcione em `/pagina/`.

## 📍 Localização do Arquivo

O arquivo `.htaccess` que você precisa modificar está em:
```
public_html/.htaccess
```
(NÃO é o `.htaccess` dentro de `/pagina/`)

## 🎯 O que fazer

Você precisa adicionar uma regra **ANTES** das regras do WordPress para excluir `/pagina/` do processamento.

### Passo 1: Fazer Backup

1. No cPanel File Manager, vá para `public_html/`
2. Encontre o arquivo `.htaccess` (pode estar oculto - ative "Mostrar arquivos ocultos")
3. Clique com botão direito → **"Baixar"** ou **"Download"** para fazer backup
4. OU clique em **"Editar"** e copie todo o conteúdo para um arquivo de texto local

### Passo 2: Editar o .htaccess

1. No File Manager, dentro de `public_html/`
2. Clique no arquivo `.htaccess`
3. Clique em **"Editar"**
4. Você verá algo assim (exemplo típico do WordPress):

```apache
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
```

### Passo 3: Adicionar a Regra de Exclusão

**MÉTODO RECOMENDADO (mais seguro e compatível com plugins de cache):**

Modifique o bloco do WordPress para incluir a condição que exclui `/pagina/`:

```apache
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.php$ - [L]
# NOVO: não reescrever o diretório /pagina
RewriteCond %{REQUEST_URI} !^/pagina(/|$)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
```

**O que mudou:**
- Adicionada a linha: `RewriteCond %{REQUEST_URI} !^/pagina(/|$)`
- Esta linha deve estar **ANTES** das condições `!-f` e `!-d`
- A expressão `!^/pagina(/|$)` ignora tanto `/pagina` quanto `/pagina/` e qualquer coisa dentro

**MÉTODO ALTERNATIVO (se o método acima não funcionar):**

Adicione ANTES da linha `# BEGIN WordPress`:

```apache
# Excluir /pagina/ do processamento do WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteCond %{REQUEST_URI} ^/pagina
RewriteRule ^pagina - [L]
</IfModule>

# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
```

### Passo 4: Exemplo Completo

**Exemplo usando o método recomendado:**

Seu `.htaccess` final deve ficar assim:

```apache
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.php$ - [L]
# Não reescrever o diretório /pagina (React SPA)
RewriteCond %{REQUEST_URI} !^/pagina(/|$)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
```

**Por que essa regra é importante?**

- A linha `RewriteCond %{REQUEST_URI} !^/pagina(/|$)` é **fundamental** para o WordPress não interceptar a rota `/pagina`
- Sem isso, o WordPress e plugins de cache (como WP Rocket, Endurance Cache) continuam respondendo 404 mesmo com o `.htaccess` correto dentro da pasta `/pagina`
- A expressão `(/|$)` garante que tanto `/pagina` quanto `/pagina/` e subrotas sejam ignoradas

### Passo 5: Salvar

1. Clique em **"Salvar"** ou **"Save Changes"**
2. Feche o editor

## ✅ Verificação

Após salvar, teste:
1. Acesse: `https://odontoalberticlinica.com.br/pagina/`
2. O site React deve carregar
3. O WordPress em `https://odontoalberticlinica.com.br/` deve continuar funcionando normalmente

## 🔍 O que essa regra faz?

```apache
RewriteCond %{REQUEST_URI} ^/pagina
RewriteRule ^pagina - [L]
```

- **`RewriteCond %{REQUEST_URI} ^/pagina`**: Verifica se a URL começa com `/pagina`
- **`RewriteRule ^pagina - [L]`**: Se sim, para o processamento (`[L]` = Last) e não aplica mais regras
- Isso faz com que o WordPress **ignore** completamente `/pagina/` e deixe o `.htaccess` dentro de `/pagina/` processar

## ⚠️ Se algo der errado

Se o WordPress parar de funcionar após a modificação:

1. **Restaure o backup** que você fez no Passo 1
2. OU remova as linhas que você adicionou
3. O WordPress voltará ao normal

## 📝 Notas Importantes

- ✅ Essa modificação **NÃO afeta** o funcionamento do WordPress
- ✅ O WordPress continua funcionando normalmente em todas as outras rotas
- ✅ Apenas `/pagina/` e tudo dentro dela será excluído do processamento do WordPress
- ✅ O `.htaccess` dentro de `/pagina/` poderá funcionar normalmente

## 🆘 Problemas Comuns

### Erro 500 após salvar
- Verifique se não há erros de sintaxe no `.htaccess`
- Verifique se todas as chaves `<>` estão fechadas corretamente
- Restaure o backup se necessário

### WordPress ainda intercepta /pagina/
- Verifique se a regra foi adicionada **ANTES** das regras do WordPress
- Verifique se não há outras regras conflitantes no `.htaccess`
- Limpe o cache do navegador (Ctrl+F5)

### WordPress parou de funcionar
- Restaure o backup imediatamente
- Verifique a sintaxe do `.htaccess`

---

**Pronto! Após fazer essa modificação, o React em `/pagina/` deve funcionar! 🎉**

