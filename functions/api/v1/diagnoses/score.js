import { buildBottlenecks, buildPlan, computeScores, deriveTraits } from '../../../_lib/scoring.js';
import { empty, errorResponse, json } from '../../../_lib/response.js';

async function readJson(request) {
  try {
    return await request.json();
  } catch (error) {
    return null;
  }
}

export async function onRequestPost({ request }) {
  const body = await readJson(request);
  if (!body || !body.mode || !Array.isArray(body.answers)) {
    return errorResponse(400, 'mode and answers are required');
  }

  const answers = {};
  body.answers.forEach((item) => {
    if (item?.question_id) answers[item.question_id] = item.value;
  });

  try {
    const traits = deriveTraits(answers);
    const { ranked, reasons } = computeScores(traits);
    const top3 = ranked.slice(0, 3).map((r) => r.id);
    const safetyFlags = {
      pain_present: traits.has('pain_present'),
      red_flag_maybe: traits.has('red_flag_maybe'),
    };

    return json({
      result_top3: top3,
      reasons: Object.fromEntries(top3.map((id) => [id, (reasons[id] || []).slice(0, 3)])),
      safety_flags: safetyFlags,
      bottlenecks: buildBottlenecks(traits),
      first_4weeks: buildPlan(traits, answers),
    });
  } catch (error) {
    return errorResponse(500, 'failed to score', 'server_error');
  }
}

export async function onRequestOptions() {
  return empty(204);
}
