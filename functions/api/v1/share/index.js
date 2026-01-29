import { empty, errorResponse, json } from '../../../_lib/response.js';
import { putShare, SHARE_TTL_SECONDS } from '../../../_lib/shareStore.js';

function generateShareId() {
  const bytes = new Uint8Array(9);
  crypto.getRandomValues(bytes);
  const base64 = btoa(String.fromCharCode(...bytes));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function readJson(request) {
  try {
    return await request.json();
  } catch (error) {
    return null;
  }
}

export async function onRequestPost({ request, env }) {
  const body = await readJson(request);
  if (!body || !body.payload) {
    return errorResponse(400, 'payload is required');
  }

  try {
    const shareId = generateShareId();
    await putShare(env, shareId, body.payload);
    const expiresAt = new Date(Date.now() + SHARE_TTL_SECONDS * 1000).toISOString();
    return json(
      {
        share_id: shareId,
        expires_at: expiresAt,
      },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(500, 'failed to create share', 'server_error');
  }
}

export async function onRequestOptions() {
  return empty(204);
}
