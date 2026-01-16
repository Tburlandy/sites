# 🔧 Guia: Configurar DNS do Subdomínio no cPanel

## ❌ Problema Atual
O erro `DNS_PROBE_FINISHED_NXDOMAIN` significa que o DNS do subdomínio `implante.odontoalberticlinica.com.br` não está resolvendo corretamente.

## ✅ Solução: Verificar/Criar Registro DNS

### Passo 1: Acessar a Zona DNS no cPanel

1. **Faça login no cPanel**
2. Procure por **"Zona DNS"** ou **"DNS Zone Editor"** ou **"Advanced DNS Zone Editor"**
3. Selecione o domínio principal: `odontoalberticlinica.com.br`

### Passo 2: Verificar se o Registro Existe

Procure por um registro do tipo **A** ou **CNAME** com o nome:
- `implante` ou `implante.odontoalberticlinica.com.br`

**O que você deve encontrar:**

#### Opção A: Registro Tipo A (recomendado)
```
Nome: implante
Tipo: A
Valor: [IP do servidor] (mesmo IP do domínio principal)
TTL: 14400 (ou outro valor)
```

#### Opção B: Registro Tipo CNAME
```
Nome: implante
Tipo: CNAME
Valor: odontoalberticlinica.com.br
TTL: 14400 (ou outro valor)
```

### Passo 3: Se o Registro NÃO Existe - Criar

1. Clique em **"Adicionar Registro"** ou **"Add Record"**
2. Preencha:
   - **Nome:** `implante` (sem o domínio completo)
   - **Tipo:** `A` (recomendado) ou `CNAME`
   - **Valor:** 
     - Se tipo **A**: Cole o IP do servidor (mesmo IP do domínio principal)
     - Se tipo **CNAME**: Digite `odontoalberticlinica.com.br`
   - **TTL:** `14400` (ou deixe o padrão)
3. Clique em **"Adicionar Registro"** ou **"Add Record"**

### Passo 4: Verificar o IP do Servidor

Se você não souber o IP do servidor:

1. No cPanel, vá em **"Informações do Servidor"** ou **"Server Information"**
2. Procure por **"IP Compartilhado"** ou **"Shared IP Address"**
3. Use esse IP no registro DNS tipo A

**OU**

1. No cPanel, vá em **"Zona DNS"**
2. Procure pelo registro **A** do domínio principal `odontoalberticlinica.com.br`
3. Use o mesmo IP desse registro

### Passo 5: Aguardar Propagação DNS

Após criar/verificar o registro DNS:

1. **Aguarde 5-30 minutos** para a propagação inicial
2. **Pode levar até 48 horas** para propagação completa (mas geralmente é mais rápido)

### Passo 6: Testar o DNS

Você pode testar se o DNS está funcionando usando:

#### Opção 1: Comando no Terminal (Mac/Linux)
```bash
dig implante.odontoalberticlinica.com.br
# ou
nslookup implante.odontoalberticlinica.com.br
```

#### Opção 2: Site Online
Acesse: https://www.whatsmydns.net/
- Digite: `implante.odontoalberticlinica.com.br`
- Veja se o DNS está propagando em diferentes servidores

#### Opção 3: Teste Direto no Navegador
Tente acessar:
- `http://implante.odontoalberticlinica.com.br` (sem HTTPS primeiro)

## 🔍 Verificação Adicional: Document Root

Certifique-se de que o **Document Root** do subdomínio está correto:

1. No cPanel, vá em **"Subdomínios"** ou **"Subdomains"**
2. Encontre `implante.odontoalberticlinica.com.br`
3. Verifique se o **Document Root** está apontando para:
   - `/implante.odontoalberticlinica.com.br` ✅ (correto)
   - OU `/pagina` (se você preferir usar essa pasta)

**Importante:** Se você mudar o Document Root para `/pagina`, certifique-se de que os arquivos estão nessa pasta!

## 📋 Checklist

Antes de considerar resolvido:

- [ ] Registro DNS tipo A ou CNAME criado para `implante`
- [ ] Valor do registro DNS está correto (IP ou CNAME)
- [ ] Document Root do subdomínio está correto
- [ ] Arquivos do site estão na pasta correta (conforme Document Root)
- [ ] Aguardou pelo menos 5-10 minutos após criar o registro DNS
- [ ] Testou o acesso com `http://` (sem HTTPS primeiro)
- [ ] Verificou o DNS em https://www.whatsmydns.net/

## ⚠️ Problemas Comuns

### DNS ainda não resolve após 1 hora

**Soluções:**
1. Verifique se o registro DNS foi criado corretamente
2. Limpe o cache DNS do seu computador:
   - **Mac:** `sudo dscacheutil -flushcache`
   - **Windows:** `ipconfig /flushdns`
3. Tente acessar de outro dispositivo/rede
4. Aguarde mais tempo (DNS pode levar até 48h)

### DNS resolve, mas o site não carrega

**Soluções:**
1. Verifique se os arquivos estão na pasta correta (conforme Document Root)
2. Verifique se o arquivo `.htaccess` está presente
3. Verifique as permissões das pastas (755) e arquivos (644)
4. Tente acessar `http://` primeiro (sem HTTPS)

### SSL não funciona

**Soluções:**
1. No cPanel, vá em **"SSL/TLS Status"**
2. Clique em **"Run AutoSSL"** para o subdomínio
3. Aguarde alguns minutos para o certificado ser gerado
4. Depois, ative o **"Force HTTPS Redirect"**

---

**Após configurar o DNS corretamente, o subdomínio deve funcionar! 🎉**

