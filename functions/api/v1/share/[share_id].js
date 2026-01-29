import { empty, errorResponse, json } from '../../../_lib/response.js';
import { getShare } from '../../../_lib/shareStore.js';

export async function onRequestGet({ params, env }) {
  const shareId = params.share_id;
  if (!shareId) {
    return errorResponse(404, 'not found', 'not_found');
  }

  const payload = await getShare(env, shareId);
  if (!payload) {
    return errorResponse(404, 'not found', 'not_found');
  }

  return json({ payload });
}

export async function onRequestOptions() {
  return empty(204);
}
