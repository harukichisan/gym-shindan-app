import { gymTypes, questions, toScoringRules } from '../../_lib/config.js';
import { json } from '../../_lib/response.js';

export async function onRequestGet() {
  return json({
    version: '2026-01-29',
    questions,
    gym_types: gymTypes,
    scoring_rules: toScoringRules(),
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
