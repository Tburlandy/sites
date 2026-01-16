import { chromium } from 'playwright';

async function accessServer() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Acessar o servidor local
  const url = 'http://localhost:5173';
  console.log(`Acessando ${url}...`);
  
  await page.goto(url, { waitUntil: 'networkidle' });
  
  // Aguardar um pouco para garantir que a página carregou completamente
  await page.waitForTimeout(2000);
  
  // Tirar um screenshot
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  console.log('Screenshot salvo em screenshot.png');
  
  // Obter informações da página
  const title = await page.title();
  console.log(`Título da página: ${title}`);
  
  // Obter URL atual
  const currentUrl = page.url();
  console.log(`URL atual: ${currentUrl}`);
  
  // Manter o navegador aberto por 10 segundos para visualização
  console.log('Navegador ficará aberto por 10 segundos...');
  await page.waitForTimeout(10000);
  
  await browser.close();
  console.log('Navegador fechado.');
}

accessServer().catch(console.error);

