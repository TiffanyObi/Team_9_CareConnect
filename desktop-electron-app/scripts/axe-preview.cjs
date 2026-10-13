'use strict';

const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const appRoot = path.resolve(__dirname, '..');
const port = Number.parseInt(process.env.AXE_PREVIEW_PORT || '4173', 10);
const routes = new Map([
  ['/', path.join(appRoot, 'index.html')],
  ['/index.html', path.join(appRoot, 'index.html')],
  ['/dist/renderer.js', path.join(appRoot, 'dist', 'renderer.js')],
  ['/src/renderer/styles.css', path.join(appRoot, 'src', 'renderer', 'styles.css')],
]);
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
};

const server = http.createServer(async (request, response) => {
  if (request.method !== 'GET' || !routes.has(request.url)) {
    response.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
    response.end('Not found');
    return;
  }

  try {
    const filePath = routes.get(request.url);
    const body = await fs.readFile(filePath);
    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream',
    });
    response.end(body);
  } catch {
    response.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
    response.end('Unable to load the axe preview');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`CareConnect axe preview: http://127.0.0.1:${port}`);
  console.log('Press Control+C after capturing the axe DevTools screenshot.');
});

server.on('error', error => {
  console.error(`Unable to start the axe preview: ${error.message}`);
  process.exitCode = 1;
});
