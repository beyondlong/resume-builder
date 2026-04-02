const http = require('http');
const { URL } = require('url');
const { loadEnvFiles } = require('./utils/env');
const { handleAIImproveRequest } = require('./routes/ai');

loadEnvFiles();

const port = Number(process.env.AI_PROXY_PORT || 8787);
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    ...CORS_HEADERS,
  });
  res.end(JSON.stringify(payload));
};

const parseJsonBody = req =>
  new Promise((resolve, reject) => {
    let rawBody = '';

    req.on('data', chunk => {
      rawBody += chunk;
    });

    req.on('end', () => {
      if (!rawBody) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(rawBody));
      } catch (error) {
        reject(error);
      }
    });

    req.on('error', reject);
  });

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      ...CORS_HEADERS,
    });
    res.end();
    return;
  }

  if (req.method === 'GET' && requestUrl.pathname === '/health') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === 'POST' && requestUrl.pathname === '/api/ai/improve') {
    try {
      const body = await parseJsonBody(req);
      const result = await handleAIImproveRequest(body);
      sendJson(res, result.statusCode, result.payload);
    } catch (_error) {
      sendJson(res, 400, {
        error: {
          code: 'AI_BAD_REQUEST',
          message: 'Request body must be valid JSON',
        },
      });
    }
    return;
  }

  sendJson(res, 404, {
    error: {
      code: 'NOT_FOUND',
      message: 'Not found',
    },
  });
});

if (require.main === module) {
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`AI proxy server listening on http://localhost:${port}`);
  });
}

module.exports = {
  CORS_HEADERS,
  server,
};
