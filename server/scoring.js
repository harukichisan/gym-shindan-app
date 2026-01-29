const {
  bottleneckLabels,
  gymTypes,
  gymWeights,
  questions,
  traitReasons,
} = require('./config');

const questionMap = new Map(questions.map((q) => [q.id, q]));

function deriveTraits(answers) {
  const traits = new Set();

  Object.entries(answers).forEach(([questionId, answer]) => {
    const question = questionMap.get(questionId);
    if (!question) return;
    if (question.type === 'single') {
      const option = question.options?.find((opt) => opt.value === answer);
      option?.traits?.forEach((t) => traits.add(t));
    }
    if (question.type === 'multi' && Array.isArray(answer)) {
      answer.forEach((value) => {
        const option = question.options?.find((opt) => opt.value === value);
        option?.traits?.forEach((t) => traits.add(t));
      });
    }
    if (question.type === 'slider' && typeof answer === 'number') {
      if (questionId === 'Q-F3' && answer >= 6) traits.add('pain_present');
      if (questionId === 'Q-F3' && answer >= 8) traits.add('red_flag_maybe');
    }
  });

  if (answers['Q-F0'] === 'pain_yes') traits.add('pain_present');
  if (answers['Q-F0'] === 'pain_none') traits.delete('pain_present');

  const redFlagAnswer = answers['Q-F1'];
  if (Array.isArray(redFlagAnswer)) {
    const hasRedFlag = redFlagAnswer.some((v) => v !== 'redflag_none');
    if (hasRedFlag) traits.add('red_flag_maybe');
  }

  return traits;
}

function computeScores(traits) {
  const scores = {};
  const reasons = {};

  gymTypes.forEach((gym) => {
    scores[gym.id] = 0;
    reasons[gym.id] = [];
    const weights = gymWeights[gym.id] || {};
    traits.forEach((trait) => {
      const weight = weights[trait] || 0;
      scores[gym.id] += weight;
      if (weight > 0 && traitReasons[trait]) {
        reasons[gym.id].push(traitReasons[trait]);
      }
    });
  });

  const ranked = [...gymTypes]
    .map((gym) => ({ id: gym.id, score: scores[gym.id] }))
    .sort((a, b) => b.score - a.score);

  return {
    scores,
    reasons,
    ranked,
  };
}

function buildPlan(traits, answers) {
  let frequency = '週2';
  let duration = '45〜60分';

  if (answers['Q-B1'] === 'freq_1') frequency = '週1';
  if (answers['Q-B1'] === 'freq_3') frequency = '週3';
  if (answers['Q-B1'] === 'freq_unknown') frequency = '週1〜2';

  if (answers['Q-B2'] === 'time_30' || traits.has('time_short')) duration = '30分以内';
  if (answers['Q-B2'] === 'time_90') duration = '60〜90分';
  if (answers['Q-B2'] === 'time_long') duration = '90分以上';

  const focus = [];
  if (traits.has('needs_coaching_high')) focus.push('フォーム確認とメニュー相談');
  if (traits.has('pain_present')) focus.push('低負荷・可動域づくり');
  if (traits.has('prefers_group') || traits.has('wants_class')) focus.push('初心者向けクラスに参加');
  if (traits.has('goal_weight_loss')) focus.push('有酸素10〜15分を追加');
  if (traits.has('goal_muscle')) focus.push('全身マシンを軽めで');
  if (traits.has('goal_stress')) focus.push('汗をかいて気分転換');
  if (focus.length === 0) focus.push('まずは週2の習慣化');

  return { frequency, duration, focus: focus.slice(0, 3) };
}

function buildBottlenecks(traits) {
  const items = [];
  traits.forEach((trait) => {
    if (bottleneckLabels[trait]) items.push(bottleneckLabels[trait]);
  });
  return items.slice(0, 2);
}

module.exports = {
  deriveTraits,
  computeScores,
  buildPlan,
  buildBottlenecks,
};
