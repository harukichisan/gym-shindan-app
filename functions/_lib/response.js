const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export function json(payload, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set('Content-Type', 'application/json; charset=utf-8');
  Object.entries(corsHeaders).forEach(([key, value]) => headers.set(key, value));
  return new Response(JSON.stringify(payload), {
    ...init,
    headers,
  });
}

export function empty(status = 204) {
  return new Response(null, {
    status,
    headers: corsHeaders,
  });
}

export function errorResponse(status, message, code = 'invalid_request', details) {
  return json(
    {
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  );
}
