import type { Plugin } from 'vite';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Plugin do Vite para injetar Google Tag Manager diretamente no HTML
 * Segue as melhores práticas do Google: código GTM no <head> e noscript no <body>
 */
export function injectGTM(): Plugin {
  return {
    name: 'inject-gtm',
    transformIndexHtml(html) {
      // Ler o siteConfig.ts para pegar o GTM ID
      let gtmId = '';
      try {
        const configPath = join(process.cwd(), 'src', 'config', 'siteConfig.ts');
        const configContent = readFileSync(configPath, 'utf-8');
        const gtmMatch = configContent.match(/gtmId:\s*"([^"]+)"/);
        if (gtmMatch && gtmMatch[1]) {
          gtmId = gtmMatch[1].trim();
        }
      } catch (error) {
        console.warn('⚠️ Não foi possível ler o GTM ID do siteConfig.ts:', error);
      }

      if (!gtmId || gtmId === '') {
        // Se não tiver GTM ID, remove os placeholders
        return html
          .replace(/<!-- GTM Script -->[\s\S]*?<!-- \/GTM Script -->/g, '')
          .replace(/<!-- GTM Noscript -->[\s\S]*?<!-- \/GTM Noscript -->/g, '');
      }

      // Código GTM para o <head>
      const gtmScript = `
    <!-- Google Tag Manager -->
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
    </script>
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');</script>
    <!-- End Google Tag Manager -->`;

      // Noscript para o <body>
      const gtmNoscript = `
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->`;

      // Injetar GTM no <head> (antes do fechamento do </head>)
      let modifiedHtml = html;
      if (html.includes('</head>')) {
        // Substituir o placeholder ou inserir antes do </head>
        if (html.includes('<!-- /GTM Script -->')) {
          modifiedHtml = html.replace(/<!-- GTM Script -->[\s\S]*?<!-- \/GTM Script -->/, gtmScript);
        } else {
          modifiedHtml = html.replace('</head>', `    ${gtmScript}\n  </head>`);
        }
      }

      // Injetar noscript no <body> (imediatamente após abertura do <body>)
      if (modifiedHtml.includes('<!-- /GTM Noscript -->')) {
        // Substituir o placeholder
        modifiedHtml = modifiedHtml.replace(/<!-- GTM Noscript -->[\s\S]*?<!-- \/GTM Noscript -->/, gtmNoscript);
      } else if (modifiedHtml.includes('<body>')) {
        modifiedHtml = modifiedHtml.replace('<body>', `<body>${gtmNoscript}`);
      } else if (modifiedHtml.includes('<body ')) {
        // Se o body tiver atributos
        modifiedHtml = modifiedHtml.replace(/<body[^>]*>/, (match) => `${match}${gtmNoscript}`);
      }

      return modifiedHtml;
    },
  };
}

