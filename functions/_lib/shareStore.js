const memoryStore = new Map();

export const SHARE_TTL_SECONDS = 60 * 60 * 24 * 90;

export async function putShare(env, shareId, payload) {
  if (env?.SHARE_KV) {
    await env.SHARE_KV.put(shareId, JSON.stringify(payload), {
      expirationTtl: SHARE_TTL_SECONDS,
    });
    return;
  }
  const expiresAt = Date.now() + SHARE_TTL_SECONDS * 1000;
  memoryStore.set(shareId, { payload, expires_at: expiresAt });
}

export async function getShare(env, shareId) {
  if (env?.SHARE_KV) {
    const value = await env.SHARE_KV.get(shareId);
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch (error) {
      return null;
    }
  }
  const entry = memoryStore.get(shareId);
  if (!entry) return null;
  if (entry.expires_at && entry.expires_at <= Date.now()) {
    memoryStore.delete(shareId);
    return null;
  }
  return entry.payload;
}
