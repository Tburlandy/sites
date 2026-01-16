# Instruções para fazer funcionar com WordPress

## Problema
O WordPress está interceptando a rota `/pagina/` antes do `.htaccess` do React poder funcionar. Isso acontece porque o `.htaccess` do WordPress na raiz processa todas as requisições primeiro, redirecionando rotas desconhecidas para `index.php`, causando conflito com o aplicativo React.

## Solução

Você precisa adicionar uma regra no `.htaccess` da **raiz** do WordPress (não dentro de `/pagina/`) para excluir `/pagina/` do processamento do WordPress.

### Passo a passo:

1. **Acesse o cPanel** e vá para o Gerenciador de Arquivos
2. **Navegue até a raiz** do domínio `odontoalberticlinica.com.br` (geralmente `public_html/`)
3. **Abra o arquivo `.htaccess`** da raiz (onde está o WordPress)
   - Se não conseguir ver o arquivo, ative "Mostrar arquivos ocultos" no File Manager
4. **Faça um backup** do arquivo antes de editar (clique com botão direito → Download)
5. **Procure pela seção** `# BEGIN WordPress` ou `RewriteEngine On`
6. **Adicione ANTES da seção WordPress** a seguinte regra:

```apache
# Excluir /pagina/ do processamento do WordPress
# Esta regra deve estar ANTES das regras do WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteCond %{REQUEST_URI} ^/pagina
RewriteRule ^pagina - [L]
</IfModule>
```

### Exemplo de como deve ficar:

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

### Método Recomendado (mais seguro e compatível com plugins de cache):

**Este é o método mais recomendado**, especialmente se você usa plugins de cache como WP Rocket ou Endurance Cache:

```apache
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.php$ - [L]
# NOVO: não reescrever o diretório /pagina (React SPA)
RewriteCond %{REQUEST_URI} !^/pagina(/|$)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
```

**Por que esse método é melhor?**

- Funciona mesmo com plugins de cache ativos (WP Rocket, Endurance Cache)
- A expressão `!^/pagina(/|$)` ignora `/pagina`, `/pagina/` e todas as subrotas
- Não requer regras adicionais antes do bloco WordPress

## O que essa regra faz?

- **`RewriteCond %{REQUEST_URI} ^/pagina`**: Verifica se a URL começa com `/pagina`
- **`RewriteRule ^pagina - [L]`**: Se sim, para o processamento (`[L]` = Last) e não aplica mais regras
- Isso faz com que o WordPress **ignore completamente** `/pagina/` e deixe o `.htaccess` dentro de `/pagina/` processar as requisições

## Verificação

Após salvar, teste:
1. Acesse: `https://odontoalberticlinica.com.br/pagina/`
2. O site React deve carregar corretamente
3. Navegue para subrotas como `/pagina/obrigado`
4. O WordPress em `https://odontoalberticlinica.com.br/` deve continuar funcionando normalmente
5. Verifique no console do navegador (F12) se não há erros 404 para arquivos estáticos (JS/CSS)

## ⚠️ Se algo der errado

Se o WordPress parar de funcionar após a modificação:
1. **Restaure o backup** que você fez antes de editar
2. OU remova as linhas que você adicionou
3. O WordPress voltará ao normal

## 📝 Notas Importantes

- ✅ Essa modificação **NÃO afeta** o funcionamento do WordPress
- ✅ O WordPress continua funcionando normalmente em todas as outras rotas
- ✅ Apenas `/pagina/` e tudo dentro dela será excluído do processamento do WordPress
- ✅ O `.htaccess` dentro de `/pagina/` poderá funcionar normalmente
- ✅ Certifique-se de que o Apache tem `AllowOverride On` para o diretório do app no cPanel

