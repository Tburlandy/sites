import type { Plugin } from 'vite';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Plugin do Vite para substituir o siteUrl nos arquivos estáticos durante o build
 * Substitui {{SITE_URL}} nos arquivos index.html, sitemap.xml e robots.txt
 */
export function injectSiteUrl(): Plugin {
  // Função auxiliar para ler as variáveis do siteConfig.ts
  const readConfigValues = () => {
    let siteUrl = '';
    let basePath = '';
    let cidade = '';
    let nomeClinica = '';
    let preposicao = '';
    
    try {
      const configPath = join(process.cwd(), 'src', 'config', 'siteConfig.ts');
      const configContent = readFileSync(configPath, 'utf-8');
      
      const siteUrlMatch = configContent.match(/siteUrl:\s*"([^"]+)"/);
      if (siteUrlMatch && siteUrlMatch[1]) {
        siteUrl = siteUrlMatch[1].trim();
        // Remover /pagina do final se estiver presente (legado)
        siteUrl = siteUrl.replace(/\/pagina\/?$/, '');
      }
      
      const basePathMatch = configContent.match(/basePath:\s*"([^"]+)"/);
      if (basePathMatch && basePathMatch[1]) {
        basePath = basePathMatch[1].trim();
      } else {
        // Fallback: tentar extrair do siteUrl se não encontrar basePath
        const urlMatch = configContent.match(/siteUrl:\s*"([^"]+)"/);
        if (urlMatch && urlMatch[1].includes('/pagina')) {
          basePath = '/pagina/';
        } else {
          basePath = '/';
        }
      }
      
      const cidadeMatch = configContent.match(/cidade:\s*"([^"]+)"/);
      if (cidadeMatch && cidadeMatch[1]) {
        cidade = cidadeMatch[1].trim();
      }
      
      const nomeClinicaMatch = configContent.match(/nomeClinica:\s*"([^"]+)"/);
      if (nomeClinicaMatch && nomeClinicaMatch[1]) {
        nomeClinica = nomeClinicaMatch[1].trim();
      }
      
      const preposicaoMatch = configContent.match(/preposicao:\s*"([^"]+)"/);
      if (preposicaoMatch && preposicaoMatch[1]) {
        preposicao = preposicaoMatch[1].trim();
      }
    } catch (error) {
      console.warn('⚠️ Não foi possível ler o siteConfig.ts:', error);
    }

    if (!siteUrl || siteUrl === '') {
      console.warn('⚠️ siteUrl não encontrado no siteConfig.ts, usando placeholder');
      siteUrl = 'https://seu-dominio.com';
    }
    if (!basePath || basePath === '') {
      basePath = '/';
    }
    if (!cidade || cidade === '') {
      cidade = 'Maricá';
    }
    if (!nomeClinica || nomeClinica === '') {
      nomeClinica = 'Evo Smile Studio';
    }
    if (!preposicao || preposicao === '') {
      preposicao = 'em';
    }

    return { siteUrl, basePath, cidade, nomeClinica, preposicao };
  };

  return {
    name: 'inject-site-url',
    buildStart() {
      const { siteUrl, basePath, cidade, nomeClinica, preposicao } = readConfigValues();
      
      // Armazenar variáveis para uso no closeBundle
      (this as any).__siteUrl = siteUrl;
      (this as any).__basePath = basePath;
      (this as any).__cidade = cidade;
      (this as any).__nomeClinica = nomeClinica;
      (this as any).__preposicao = preposicao;
    },
    transformIndexHtml(html: string) {
      // Substituir placeholders também em desenvolvimento
      const { siteUrl, basePath, cidade, nomeClinica, preposicao } = readConfigValues();
      const fullUrl = siteUrl + basePath.replace(/\/$/, '');
      
      return html
        .replace(/\{\{SITE_URL\}\}/g, siteUrl)
        .replace(/\{\{FULL_URL\}\}/g, fullUrl)
        .replace(/\{\{BASE_PATH\}\}/g, basePath)
        .replace(/\{\{CIDADE\}\}/g, cidade)
        .replace(/\{\{NOME_CLINICA\}\}/g, nomeClinica)
        .replace(/\{\{PREPOSICAO\}\}/g, preposicao);
    },
    closeBundle() {
      const siteUrl = (this as any).__siteUrl || 'https://seu-dominio.com';
      const basePath = (this as any).__basePath || '/';
      const cidade = (this as any).__cidade || 'Maricá';
      const nomeClinica = (this as any).__nomeClinica || 'Evo Smile Studio';
      const preposicao = (this as any).__preposicao || 'em';
      const fullUrl = siteUrl + basePath.replace(/\/$/, '');

      // Processar arquivos estáticos após o build
      const distPath = join(process.cwd(), 'dist');
      
      try {
        // Processar index.html
        const indexPath = join(distPath, 'index.html');
        if (existsSync(indexPath)) {
          let htmlContent = readFileSync(indexPath, 'utf-8');
          htmlContent = htmlContent
            .replace(/\{\{SITE_URL\}\}/g, siteUrl)
            .replace(/\{\{FULL_URL\}\}/g, fullUrl)
            .replace(/\{\{BASE_PATH\}\}/g, basePath)
            .replace(/\{\{CIDADE\}\}/g, cidade)
            .replace(/\{\{NOME_CLINICA\}\}/g, nomeClinica)
            .replace(/\{\{PREPOSICAO\}\}/g, preposicao);
          writeFileSync(indexPath, htmlContent, 'utf-8');
        }

        // Processar sitemap.xml
        const sitemapPath = join(distPath, 'sitemap.xml');
        if (existsSync(sitemapPath)) {
          let sitemapContent = readFileSync(sitemapPath, 'utf-8');
          sitemapContent = sitemapContent
            .replace(/\{\{SITE_URL\}\}/g, siteUrl)
            .replace(/\{\{FULL_URL\}\}/g, fullUrl);
          writeFileSync(sitemapPath, sitemapContent, 'utf-8');
        }

        // Processar robots.txt
        const robotsPath = join(distPath, 'robots.txt');
        if (existsSync(robotsPath)) {
          let robotsContent = readFileSync(robotsPath, 'utf-8');
          robotsContent = robotsContent
            .replace(/\{\{SITE_URL\}\}/g, siteUrl)
            .replace(/\{\{FULL_URL\}\}/g, fullUrl);
          writeFileSync(robotsPath, robotsContent, 'utf-8');
        }
      } catch (error) {
        console.warn('⚠️ Erro ao processar arquivos estáticos:', error);
      }
    },
  };
}

