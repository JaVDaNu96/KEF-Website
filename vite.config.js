import { defineConfig } from 'vite';
import htmlInject from 'vite-plugin-html-inject';
import { resolve } from 'path';
import fs from 'fs';

// Dynamically find all HTML files in the root directory
const htmlFiles = fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.html') && !['header.html', 'footer.html'].includes(file))
  .reduce((acc, file) => {
    acc[file.replace('.html', '')] = resolve(__dirname, file);
    return acc;
  }, {});

export default defineConfig({
  base: './',
  plugins: [htmlInject()],
  build: {
    rollupOptions: {
      input: htmlFiles,
    },
  },
});
