#!/usr/bin/env node

/**
 * Script para limpar e zipar a pasta dist/ para deploy
 * Remove arquivos lixo (.DS_Store, Arquivo.zip) e cria dist-pagina.zip
 */

import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const distPath = join(projectRoot, 'dist');
const zipPath = join(projectRoot, 'dist-pagina.zip');

console.log('🧹 Limpando arquivos lixo do dist/...');

// Remover arquivos lixo
const filesToRemove = [
  join(distPath, '.DS_Store'),
  join(distPath, 'Arquivo.zip'),
  join(distPath, 'dist.zip'),
];

filesToRemove.forEach(file => {
  if (existsSync(file)) {
    rmSync(file);
    console.log(`  ✅ Removido: ${file.split('/').pop()}`);
  }
});

// Remover todos os .DS_Store recursivamente
try {
  execSync(`find "${distPath}" -name ".DS_Store" -delete`, { stdio: 'inherit' });
  console.log('  ✅ Removidos todos os .DS_Store');
} catch (error) {
  // Ignorar erro se não encontrar arquivos
}

// Verificar se dist existe
if (!existsSync(distPath)) {
  console.error('❌ Erro: pasta dist/ não encontrada. Execute "npm run build" primeiro.');
  process.exit(1);
}

console.log('\n📦 Criando dist-pagina.zip...');

// Remover zip antigo se existir
if (existsSync(zipPath)) {
  rmSync(zipPath);
  console.log('  ✅ Removido zip antigo');
}

// Criar zip (usando cd para garantir que a estrutura seja correta)
try {
  // Mudar para dentro de dist/ e zipar o conteúdo diretamente (sem pasta dist/)
  // Isso garante que ao extrair no servidor, os arquivos fiquem em /pagina/ diretamente
  execSync(`cd "${distPath}" && zip -r "${zipPath}" . -x "*.DS_Store" ".DS_Store" "Arquivo.zip" "dist.zip"`, {
    stdio: 'inherit',
  });
  console.log('\n✅ dist-pagina.zip criado com sucesso!');
  console.log(`📁 Localização: ${zipPath}`);
  console.log('\n📋 Conteúdo do zip (primeiras 20 linhas):');
  execSync(`cd "${projectRoot}" && unzip -l dist-pagina.zip | head -25`, {
    stdio: 'inherit',
  });
  console.log('\n💡 IMPORTANTE: Ao extrair no servidor, extraia o conteúdo diretamente em /pagina/');
  console.log('   (não dentro de uma subpasta dist/)');
} catch (error) {
  console.error('❌ Erro ao criar zip:', error.message);
  process.exit(1);
}

