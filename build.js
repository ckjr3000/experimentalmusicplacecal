#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { fetchPartner, fetchEvents } from './src/api.js';
import { generateHTML } from './src/html.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function build() {
  console.log('Loading configuration...');
  const configPath = join(__dirname, 'config.json');
  const config = JSON.parse(readFileSync(configPath, 'utf-8'));

  console.log(`Fetching partner ${config.api.partnerId}...`);
  const partner = await fetchPartner(config.api.endpoint, config.api.partnerId);
  console.log(`  Found: ${partner.name}`);

  console.log('Fetching events...');
  const events = await fetchEvents(
    config.api.endpoint,
    config.api.partnerId,
    config.events.futureDays
  );
  console.log(`  Found ${events.length} upcoming events`);

  console.log('Generating HTML...');
  const html = generateHTML(partner, events, config.site);

  const outputDir = join(__dirname, 'dist');
  const outputPath = join(outputDir, 'index.html');

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputPath, html);

  console.log(`Done! Output: ${outputPath}`);
}

build().catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
