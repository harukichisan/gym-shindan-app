const http = require('node:http');
const { parse } = require('node:url');
const { randomBytes } = require('node:crypto');
const { gymTypes, questions, toScoringRules } = require('./config');
const {
  buildBottlenecks,
  buildPlan,
  computeScores,
  deriveTraits,
} = require('./scoring');

const PORT = process.env.PORT ? Number(process.env.PORT) : 4010;
const SHARE_TTL_MS = 1000 * 60 * 60 * 24 * 90;
const shareStore = new Map();

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(body);
}

function notFound(res) {
  json(res, 404, { error: { code: 'not_found', message: 'not found' } });
}

function badRequest(res, message, details) {
  json(res, 400, { error: { code: 'invalid_request', message, details } });
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error('payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!raw) return resolve(null);
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function generateShareId() {
  return randomBytes(6).toString('base64url');
}

function cleanupShares() {
  const now = Date.now();
  for (const [key, value] of shareStore.entries()) {
    if (value.expires_at && value.expires_at <= now) {
      shareStore.delete(key);
    }
  }
}

const server = http.createServer(async (req, res) => {
  const { pathname } = parse(req.url, true);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  if (req.method === 'GET' && pathname === '/api/v1/health') {
    return json(res, 200, { status: 'ok' });
  }

  if (req.method === 'GET' && pathname === '/api/v1/config') {
    return json(res, 200, {
      version: '2026-01-29',
      questions,
      gym_types: gymTypes,
      scoring_rules: toScoringRules(),
    });
  }

  if (req.method === 'POST' && pathname === '/api/v1/diagnoses/score') {
    try {
      const body = await parseJsonBody(req);
      if (!body || !body.mode || !Array.isArray(body.answers)) {
        return badRequest(res, 'mode and answers are required');
      }
      const answers = {};
      body.answers.forEach((item) => {
        if (item?.question_id) answers[item.question_id] = item.value;
      });
      const traits = deriveTraits(answers);
      const { ranked, reasons } = computeScores(traits);
      const top3 = ranked.slice(0, 3).map((r) => r.id);
      const safetyFlags = {
        pain_present: traits.has('pain_present'),
        red_flag_maybe: traits.has('red_flag_maybe'),
      };

      return json(res, 200, {
        result_top3: top3,
        reasons: Object.fromEntries(top3.map((id) => [id, (reasons[id] || []).slice(0, 3)])),
        safety_flags: safetyFlags,
        bottlenecks: buildBottlenecks(traits),
        first_4weeks: buildPlan(traits, answers),
      });
    } catch (error) {
      return json(res, 500, { error: { code: 'server_error', message: 'failed to score' } });
    }
  }

  if (req.method === 'POST' && pathname === '/api/v1/share') {
    try {
      const body = await parseJsonBody(req);
      if (!body || !body.payload) {
        return badRequest(res, 'payload is required');
      }
      cleanupShares();
      const shareId = generateShareId();
      const expiresAt = Date.now() + SHARE_TTL_MS;
      shareStore.set(shareId, { payload: body.payload, expires_at: expiresAt });
      return json(res, 201, { share_id: shareId, expires_at: new Date(expiresAt).toISOString() });
    } catch (error) {
      return json(res, 500, { error: { code: 'server_error', message: 'failed to create share' } });
    }
  }

  if (req.method === 'GET' && pathname && pathname.startsWith('/api/v1/share/')) {
    cleanupShares();
    const shareId = pathname.replace('/api/v1/share/', '');
    const data = shareStore.get(shareId);
    if (!data) return notFound(res);
    return json(res, 200, { payload: data.payload });
  }

  return notFound(res);
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${PORT}`);
});
