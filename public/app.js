const state = {
  mode: null,
  acceptedDisclaimer: false,
  answers: {},
  otherText: {},
  currentQuestionId: null,
  results: null,
  useApi: false,
  shareId: null,
};

const gymTypes = [
  {
    id: '24h',
    name: '24hジム（マシン中心）',
    price_range: '月額 6,000〜12,000円',
    fit_reasons: ['時間が不規則でも通いやすい', '低コストで始めやすい'],
    cautions: ['メニュー設計が不安だと迷いやすい', '混雑時間帯は待ちが発生'],
    pain_considerations: ['初心者ガイダンスの有無を確認', '痛みが出たら中断'],
    checklist_items: [
      'スタッフ滞在時間/初心者案内',
      '混雑ピークの様子',
      'マシンの使い方表示',
      'フリーウエイトエリアの雰囲気',
      '退会/休会条件',
    ],
  },
  {
    id: 'fitness',
    name: '総合フィットネスクラブ',
    price_range: '月額 8,000〜18,000円',
    fit_reasons: ['クラスで楽しく続けたい', 'プール/サウナなども活用したい'],
    cautions: ['利用時間が限られることがある', '使わない設備が多いと割高'],
    pain_considerations: ['低負荷クラスの有無を確認'],
    checklist_items: [
      '通える時間帯のプログラム',
      '初心者向け枠の有無',
      '館内導線（混雑/待ち）',
      'インストラクターの声かけ',
      'オプション費用',
    ],
  },
  {
    id: 'public',
    name: '公営ジム（都度利用）',
    price_range: '1回 200〜700円',
    fit_reasons: ['固定費が不安な人に合う', 'まずはお試しで始めたい'],
    cautions: ['指導/サポートが少ないことが多い', '設備が最新でない場合あり'],
    pain_considerations: ['軽い有酸素や可動域づくり中心に'],
    checklist_items: [
      '初回講習の有無',
      'マシンの種類',
      '混雑/利用制限',
      '更衣室・ロッカーの使い勝手',
    ],
  },
  {
    id: 'personal',
    name: 'パーソナルジム（マンツーマン）',
    price_range: '1回 7,000〜15,000円',
    fit_reasons: ['何をすれば良いか分からない', '最短で成果を出したい'],
    cautions: ['料金が高め', 'トレーナーの質に差がある'],
    pain_considerations: ['痛みが出ない範囲での調整方針を確認'],
    checklist_items: [
      'カウンセリングで痛みを聞いてくれるか',
      'フォーム指導が具体的か',
      '無理な食事制限を強要しないか',
      '予約の取りやすさ/キャンセル規定',
      '卒業後の自走支援',
    ],
  },
  {
    id: 'semipersonal',
    name: 'セミパーソナル（少人数）',
    price_range: '月額 15,000〜40,000円',
    fit_reasons: ['指導がほしいが費用は抑えたい', '大人数は苦手'],
    cautions: ['参加者次第でフォロー量が変わる', '予約枠が埋まると通えない'],
    pain_considerations: ['痛みがある前提で代替案が出せるか'],
    checklist_items: [
      '定員とトレーナー比率',
      '個別対応の範囲',
      '予約の取りやすさ',
      '初心者が置いていかれない雰囲気',
    ],
  },
  {
    id: 'studio',
    name: 'スタジオ系（ヨガ等）',
    price_range: '月額 8,000〜16,000円',
    fit_reasons: ['クラスで習慣化したい', '低〜中負荷から始めたい'],
    cautions: ['筋力アップ中心だと物足りない', '人気枠は予約が取りづらい'],
    pain_considerations: ['やさしいクラスや代替ポーズ案内の有無'],
    checklist_items: [
      '難易度表記の分かりやすさ',
      '代替案を出す文化',
      '予約/キャンセルのしやすさ',
      '更衣/シャワーの要否',
    ],
  },
  {
    id: 'combat',
    name: '格闘技フィットネス',
    price_range: '月額 9,000〜16,000円',
    fit_reasons: ['楽しく続けたい', 'ストレス解消を重視したい'],
    cautions: ['フォームが雑だと痛みにつながることがある', '混雑時は指導が薄くなる'],
    pain_considerations: ['痛みのある部位に配慮できるか確認'],
    checklist_items: [
      '初心者向け導入があるか',
      '強度調整の仕組み',
      'クラスの雰囲気',
      'フォーム指導の密度',
    ],
  },
  {
    id: 'conditioning',
    name: 'コンディショニングジム',
    price_range: '月額 10,000〜40,000円',
    fit_reasons: ['痛み/不調に配慮しながら習慣化したい', '身体の使い方を学びたい'],
    cautions: ['提供内容の幅が広く相性差がある', '短期減量目的だと遠回りに感じる場合'],
    pain_considerations: ['痛みを我慢させない運用があるか確認'],
    checklist_items: [
      '動作評価→説明→再現の流れがあるか',
      '専門用語を噛み砕いて説明してくれるか',
      '目的と手段の合意が取れるか',
      '自宅でできる代替案があるか',
    ],
  },
];

const simpleQuestions = [
  {
    id: 'Q-S1',
    mode: 'simple',
    type: 'single',
    prompt: '目的は？',
    options: [
      { value: 'goal_weight_loss', label: '痩せたい', traits: ['goal_weight_loss'] },
      { value: 'goal_muscle', label: '筋肉をつけたい', traits: ['goal_muscle'] },
      { value: 'goal_health', label: '健康維持', traits: ['goal_health'] },
      { value: 'goal_stress', label: 'ストレス解消', traits: ['goal_stress', 'wants_fun'] },
    ],
  },
  {
    id: 'Q-S2',
    mode: 'simple',
    type: 'single',
    prompt: '予算は？',
    options: [
      { value: 'budget_low', label: '〜7,000円/月', traits: ['budget_low'] },
      { value: 'budget_mid', label: '〜12,000円/月', traits: ['budget_mid'] },
      { value: 'budget_high', label: '〜20,000円/月', traits: ['budget_high'] },
      { value: 'budget_any', label: 'それ以上でもOK', traits: ['budget_high'] },
    ],
  },
  {
    id: 'Q-S3',
    mode: 'simple',
    type: 'single',
    prompt: '行ける時間は？',
    options: [
      { value: 'time_morning', label: '朝〜昼が多い' },
      { value: 'time_evening', label: '夕方〜夜が多い' },
      { value: 'time_late', label: '深夜/早朝が多い', traits: ['schedule_irregular'] },
      { value: 'time_irregular', label: '不規則', traits: ['schedule_irregular'] },
    ],
  },
  {
    id: 'Q-S4',
    mode: 'simple',
    type: 'single',
    prompt: '人目は気になる？',
    options: [
      { value: 'self_conscious_high', label: 'かなり気になる', traits: ['self_conscious_high'] },
      { value: 'self_conscious_mid', label: '少し気になる', traits: ['self_conscious_mid'] },
      { value: 'self_conscious_low', label: 'あまり気にならない' },
    ],
  },
  {
    id: 'Q-S5',
    mode: 'simple',
    type: 'single',
    prompt: '指導の必要度は？',
    options: [
      { value: 'needs_coaching_high', label: '教えてほしい', traits: ['needs_coaching_high'] },
      { value: 'needs_coaching_mid', label: '時々見てほしい', traits: ['needs_coaching_mid'] },
      { value: 'self_directed', label: '自分で進められる', traits: ['self_directed'] },
    ],
  },
  {
    id: 'Q-S6',
    mode: 'simple',
    type: 'single',
    prompt: '好みは？',
    options: [
      { value: 'prefers_solo', label: '黙々とやりたい', traits: ['prefers_solo'] },
      { value: 'prefers_group', label: 'クラス/みんなでやる方が続く', traits: ['prefers_group'] },
    ],
  },
];

const complexQuestions = [
  { id: 'Q-A1', mode: 'complex', section: '基本', type: 'single', prompt: 'いちばんの目的は？', options: [
      { value: 'goal_weight_loss', label: '体脂肪を落としたい', traits: ['goal_weight_loss'] },
      { value: 'goal_health', label: '体力をつけたい', traits: ['goal_health'] },
      { value: 'goal_muscle', label: '筋肉をつけたい', traits: ['goal_muscle'] },
      { value: 'goal_pain_reduce', label: '肩こり/腰の違和感を減らしたい', traits: ['goal_health', 'wants_low_intensity'] },
      { value: 'goal_stress', label: 'ストレスを減らしたい', traits: ['goal_stress', 'wants_fun'] },
    ] },
  { id: 'Q-A2', mode: 'complex', section: '基本', type: 'single', prompt: '運動経験は？', options: [
      { value: 'exp_none', label: 'ほぼない', traits: ['needs_coaching_high'] },
      { value: 'exp_some', label: 'たまに', traits: ['needs_coaching_mid'] },
      { value: 'exp_past_gym', label: '過去にジム経験あり', traits: ['needs_coaching_mid'] },
      { value: 'exp_current', label: 'いま何か続けている', traits: ['self_directed'] },
    ] },
  { id: 'Q-A3', mode: 'complex', section: '基本', type: 'multi', prompt: 'ジムでの不安（複数選択）', options: [
      { value: 'anx_menu', label: '何をすればいいか分からない', traits: ['needs_coaching_high'] },
      { value: 'anx_form', label: 'フォームが不安/ケガしそう', traits: ['needs_coaching_mid', 'pain_present'] },
      { value: 'anx_eyes', label: '人目が気になる', traits: ['self_conscious_high'] },
      { value: 'anx_continue', label: '続けられる自信がない', traits: ['needs_support'] },
      { value: 'anx_rules', label: '予約やルールが面倒そう', traits: ['reservation_hard'] },
      { value: 'anx_other', label: 'その他（任意入力）' },
    ] },
  { id: 'Q-B1', mode: 'complex', section: '生活制約', type: 'single', prompt: '週に通えそうな回数', options: [
      { value: 'freq_1', label: '週1' },
      { value: 'freq_2', label: '週2' },
      { value: 'freq_3', label: '週3以上' },
      { value: 'freq_unknown', label: 'まだ分からない' },
    ] },
  { id: 'Q-B2', mode: 'complex', section: '生活制約', type: 'single', prompt: '1回あたりの滞在時間', options: [
      { value: 'time_30', label: '30分以内', traits: ['time_short'] },
      { value: 'time_60', label: '45〜60分' },
      { value: 'time_90', label: '60〜90分' },
      { value: 'time_long', label: '90分以上' },
    ] },
  { id: 'Q-B3', mode: 'complex', section: '生活制約', type: 'multi', prompt: '通える時間帯（複数選択）', options: [
      { value: 'time_morning', label: '朝' },
      { value: 'time_noon', label: '昼' },
      { value: 'time_evening', label: '夕方' },
      { value: 'time_night', label: '夜' },
      { value: 'time_late', label: '深夜/早朝', traits: ['schedule_irregular'] },
      { value: 'time_irregular', label: '不定', traits: ['schedule_irregular'] },
    ] },
  { id: 'Q-B4', mode: 'complex', section: '生活制約', type: 'single', prompt: '通いやすさ', options: [
      { value: 'commute_must', label: '近い場所が必須' },
      { value: 'commute_prefer', label: '近い方が良い' },
      { value: 'commute_content', label: '場所より内容重視' },
    ] },
  { id: 'Q-B5', mode: 'complex', section: '生活制約', type: 'single', prompt: '支払いスタイルの好み', options: [
      { value: 'payg', label: '都度払い/回数券が安心', traits: ['prefers_payg'] },
      { value: 'monthly', label: '月額で通い放題がいい', traits: ['prefers_membership'] },
      { value: 'either', label: 'どちらでも' },
    ] },
  { id: 'Q-C1', mode: 'complex', section: '環境・心理', type: 'single', prompt: '人目は気になる？', options: [
      { value: 'self_conscious_high', label: 'かなり気になる', traits: ['self_conscious_high'] },
      { value: 'self_conscious_mid', label: '少し気になる', traits: ['self_conscious_mid'] },
      { value: 'self_conscious_low', label: '気にならない' },
    ] },
  { id: 'Q-C2', mode: 'complex', section: '環境・心理', type: 'single', prompt: '雰囲気の好み', options: [
      { value: 'vibe_quiet', label: '静かに黙々', traits: ['prefers_solo'] },
      { value: 'vibe_active', label: '程よく活気', traits: ['prefers_group'] },
      { value: 'vibe_lively', label: 'ワイワイ', traits: ['prefers_group'] },
    ] },
  { id: 'Q-C3', mode: 'complex', section: '環境・心理', type: 'single', prompt: '混雑への耐性', options: [
      { value: 'crowd_low', label: '混んでると行かなくなる' },
      { value: 'crowd_mid', label: '少しならOK' },
      { value: 'crowd_high', label: '混雑してても大丈夫' },
    ] },
  { id: 'Q-C4', mode: 'complex', section: '環境・心理', type: 'single', prompt: '予約の手間', options: [
      { value: 'reserve_hard', label: '予約が面倒だと続かない', traits: ['reservation_hard'] },
      { value: 'reserve_ok', label: '予約はできるが、取りづらいのは嫌', traits: ['reservation_ok'] },
      { value: 'reserve_want', label: '予約がある方が続く', traits: ['reservation_wants'] },
    ] },
  { id: 'Q-C5', mode: 'complex', section: '環境・心理', type: 'single', prompt: 'グループ/個人', options: [
      { value: 'prefers_solo', label: '一人でやりたい', traits: ['prefers_solo'] },
      { value: 'prefers_small_group', label: '少人数ならOK', traits: ['prefers_group', 'prefers_small_group'] },
      { value: 'prefers_group', label: 'グループが楽しい', traits: ['prefers_group'] },
    ] },
  { id: 'Q-D1', mode: 'complex', section: '指導・サポート', type: 'single', prompt: '指導の必要度', options: [
      { value: 'needs_coaching_high', label: 'かなり必要', traits: ['needs_coaching_high'] },
      { value: 'needs_coaching_mid', label: 'ある程度必要', traits: ['needs_coaching_mid'] },
      { value: 'self_directed', label: '基本は自分でできる', traits: ['self_directed'] },
    ] },
  { id: 'Q-D2', mode: 'complex', section: '指導・サポート', type: 'single', prompt: '食事サポート', options: [
      { value: 'food_yes', label: '食事も相談したい', traits: ['needs_coaching_high'] },
      { value: 'food_no', label: '運動だけでOK' },
      { value: 'food_unknown', label: '分からない' },
    ] },
  { id: 'Q-D3', mode: 'complex', section: '指導・サポート', type: 'single', prompt: 'モチベ維持のタイプ', options: [
      { value: 'motivation_reserved', label: '予定が決まっていると続く', traits: ['reservation_wants'] },
      { value: 'motivation_free', label: '気分で行きたい', traits: ['self_directed'] },
      { value: 'motivation_both', label: 'どちらも' },
    ] },
  { id: 'Q-E1', mode: 'complex', section: '設備・内容', type: 'multi', prompt: '何を中心にやりたい？', options: [
      { value: 'equip_machines', label: 'マシン（筋トレ）', traits: ['wants_machines'] },
      { value: 'equip_free', label: 'フリーウエイト', traits: ['wants_freeweights'] },
      { value: 'equip_cardio', label: '有酸素', traits: ['wants_cardio'] },
      { value: 'equip_class', label: 'クラス（スタジオ）', traits: ['wants_class', 'prefers_group'] },
      { value: 'equip_stretch', label: 'ストレッチ/体の使い方', traits: ['wants_low_intensity', 'wants_stretch'] },
      { value: 'equip_boxing', label: 'ボクササイズ等', traits: ['wants_fun'] },
    ] },
  { id: 'Q-E2', mode: 'complex', section: '設備・内容', type: 'multi', prompt: '絶対に欲しい設備', options: [
      { value: 'facility_shower', label: 'シャワー' },
      { value: 'facility_locker', label: '更衣室/ロッカーがしっかり' },
      { value: 'facility_pool', label: 'プール', traits: ['wants_pool_sauna', 'wants_variety'] },
      { value: 'facility_sauna', label: 'サウナ/スパ', traits: ['wants_pool_sauna', 'wants_variety'] },
      { value: 'facility_studio', label: 'スタジオ', traits: ['wants_class', 'wants_variety'] },
      { value: 'facility_none', label: '特になし' },
    ] },
  { id: 'Q-F0', mode: 'complex', section: '痛み/不調', type: 'single', prompt: '今、気になる痛み/不調はありますか？', options: [
      { value: 'pain_none', label: 'ない' },
      { value: 'pain_yes', label: 'ある', traits: ['pain_present'] },
    ], branching: { ifValue: 'pain_none', skipTo: 'Q-G1' } },
  { id: 'Q-F1', mode: 'complex', section: '痛み/不調', type: 'multi', prompt: '当てはまる状態は？', options: [
      { value: 'redflag_pain', label: '安静でも強い痛み/急に悪化' },
      { value: 'redflag_numb', label: 'しびれ・力が入りにくい' },
      { value: 'redflag_chest', label: '胸の痛み/強い息切れ/めまい' },
      { value: 'redflag_accident', label: '事故/転倒直後で不安' },
      { value: 'redflag_none', label: '当てはまるものはない' },
    ] },
  { id: 'Q-F2', mode: 'complex', section: '痛み/不調', type: 'multi', prompt: '痛む/気になる部位', options: [
      { value: 'pain_neck', label: '首' },
      { value: 'pain_shoulder', label: '肩' },
      { value: 'pain_elbow', label: '肘' },
      { value: 'pain_wrist', label: '手首' },
      { value: 'pain_back', label: '背中' },
      { value: 'pain_waist', label: '腰' },
      { value: 'pain_hip', label: '股関節' },
      { value: 'pain_knee', label: '膝' },
      { value: 'pain_ankle', label: '足首/足' },
      { value: 'pain_other', label: 'その他' },
    ] },
  { id: 'Q-F3', mode: 'complex', section: '痛み/不調', type: 'slider', prompt: '痛み/違和感の強さ', min: 0, max: 10, step: 1 },
  { id: 'Q-F4', mode: 'complex', section: '痛み/不調', type: 'single', prompt: '期間', options: [
      { value: 'pain_short', label: '2週間未満' },
      { value: 'pain_mid', label: '2〜6週間' },
      { value: 'pain_long', label: '6週間以上' },
    ] },
  { id: 'Q-F5', mode: 'complex', section: '痛み/不調', type: 'multi', prompt: '悪化しやすい動き', options: [
      { value: 'trigger_squat', label: 'しゃがむ/立ち上がる' },
      { value: 'trigger_run', label: '走る/ジャンプ' },
      { value: 'trigger_raise', label: '腕を上げる' },
      { value: 'trigger_twist', label: 'ひねる/振り向く' },
      { value: 'trigger_lift', label: '重い物を持つ' },
      { value: 'trigger_sit', label: '長く座る/立つ' },
      { value: 'trigger_unknown', label: '分からない' },
    ] },
  { id: 'Q-F6', mode: 'complex', section: '痛み/不調', type: 'multi', prompt: '不定愁訴', options: [
      { value: 'symptom_fatigue', label: '疲れやすい', traits: ['wants_low_intensity'] },
      { value: 'symptom_sleep', label: '眠りが浅い', traits: ['goal_stress'] },
      { value: 'symptom_headache', label: '頭痛が起きやすい', traits: ['wants_low_intensity'] },
      { value: 'symptom_shoulder', label: '肩こりがつらい', traits: ['wants_stretch'] },
      { value: 'symptom_stress', label: 'ストレスが強い', traits: ['goal_stress'] },
      { value: 'symptom_cold', label: '冷え/むくみ', traits: ['goal_health'] },
      { value: 'symptom_none', label: '特になし' },
    ] },
  { id: 'Q-F7', mode: 'complex', section: '痛み/不調', type: 'single', prompt: '生活への影響', options: [
      { value: 'impact_none', label: 'ほぼない' },
      { value: 'impact_some', label: '少しある' },
      { value: 'impact_high', label: 'かなりある' },
    ] },
  { id: 'Q-F8', mode: 'complex', section: '痛み/不調', type: 'single', prompt: '受診/治療状況', options: [
      { value: 'medical_current', label: '通院中/治療中' },
      { value: 'medical_past', label: '以前受診したが今はしていない' },
      { value: 'medical_none', label: '受診はしていない' },
      { value: 'medical_unknown', label: '分からない/迷っている' },
    ] },
  { id: 'Q-G1', mode: 'complex', section: 'まとめ', type: 'single', prompt: 'いちばん大事にしたいこと', options: [
      { value: 'priority_continue', label: 'とにかく続けやすさ', traits: ['needs_support'] },
      { value: 'priority_result', label: 'なるべく早く成果', traits: ['goal_weight_loss'] },
      { value: 'priority_privacy', label: '人目が気にならない環境', traits: ['self_conscious_high'] },
      { value: 'priority_cost', label: 'できるだけ安く', traits: ['budget_low'] },
    ] },
];

const defaultQuestions = [...simpleQuestions, ...complexQuestions];

function normalizeQuestions(source = []) {
  return source.map((question, index) => {
    const normalized = {
      ...question,
      _index: index,
    };
    if (typeof normalized.required !== 'boolean') {
      normalized.required = normalized.type === 'text' ? false : true;
    }
    if (Array.isArray(normalized.options)) {
      normalized.options = normalized.options.map((option, optIndex) => ({
        ...option,
        _index: optIndex,
      }));
    }
    return normalized;
  });
}

const dataStore = {
  questions: normalizeQuestions(defaultQuestions),
  gymTypes,
  scoringRules: [],
};

const API_BASE = window.API_BASE || '';

function apiUrl(path) {
  return `${API_BASE}${path}`;
}

const traitReasons = {
  goal_weight_loss: '減量・引き締め目的に合う',
  goal_muscle: '筋力アップに向きやすい',
  goal_health: '健康維持・体力づくり向き',
  goal_stress: 'ストレス発散しやすい',
  schedule_irregular: '時間が不規則でも通いやすい',
  budget_low: 'コストを抑えやすい',
  budget_mid: '費用と内容のバランスが良い',
  budget_high: 'サポート重視の選択肢に向く',
  prefers_solo: '黙々と自分のペースで進められる',
  prefers_group: 'クラスや仲間と続けやすい',
  self_conscious_high: '人目が気になりにくい環境を選べる',
  needs_coaching_high: 'メニューやフォームのサポートが受けやすい',
  needs_coaching_mid: 'ポイントで指導を受けやすい',
  self_directed: '自由度が高い',
  wants_class: 'クラス中心の体験がある',
  wants_fun: '楽しさ重視で続けやすい',
  wants_low_intensity: '低負荷から始めやすい',
  wants_pool_sauna: '設備の幅が広い',
  prefers_payg: '都度払いで負担が小さい',
  pain_present: '負荷調整や安全配慮を取り入れやすい',
  red_flag_maybe: '安全配慮が特に必要',
};

const gymWeights = {
  '24h': {
    schedule_irregular: 3,
    budget_low: 2,
    prefers_solo: 2,
    self_directed: 2,
    time_short: 1,
    needs_coaching_high: -2,
    prefers_group: -1,
    pain_present: -1,
    red_flag_maybe: -2,
    prefers_payg: -1,
    wants_machines: 1,
  },
  fitness: {
    prefers_group: 2,
    wants_class: 2,
    wants_variety: 2,
    wants_pool_sauna: 2,
    goal_health: 1,
    goal_stress: 1,
    schedule_irregular: -1,
    budget_low: -1,
  },
  public: {
    budget_low: 3,
    prefers_payg: 3,
    time_short: 1,
    needs_coaching_high: -2,
    prefers_group: 0,
  },
  personal: {
    needs_coaching_high: 3,
    needs_coaching_mid: 1,
    self_conscious_high: 2,
    pain_present: 2,
    red_flag_maybe: 2,
    goal_weight_loss: 1,
    budget_low: -2,
    prefers_group: -1,
  },
  semipersonal: {
    needs_coaching_high: 1,
    needs_coaching_mid: 2,
    prefers_group: 1,
    prefers_small_group: 2,
    budget_mid: 1,
    self_conscious_high: 1,
    pain_present: 1,
    budget_low: -1,
  },
  studio: {
    prefers_group: 2,
    wants_class: 2,
    wants_low_intensity: 2,
    goal_stress: 2,
    goal_health: 1,
    wants_variety: 1,
    budget_low: -1,
  },
  combat: {
    wants_fun: 3,
    goal_stress: 2,
    goal_weight_loss: 1,
    prefers_group: 1,
    pain_present: -2,
    red_flag_maybe: -2,
  },
  conditioning: {
    pain_present: 3,
    red_flag_maybe: 3,
    wants_low_intensity: 2,
    wants_stretch: 2,
    goal_health: 2,
    self_conscious_high: 1,
    needs_coaching_high: 1,
  },
};

const bottleneckLabels = {
  self_conscious_high: '人目が気になる',
  reservation_hard: '予約が面倒だと続かない',
  schedule_irregular: '時間が不規則',
  time_short: '時間が短くなりがち',
  needs_support: '続けられるか不安',
};

const elements = {
  startView: document.getElementById('view-start'),
  questionView: document.getElementById('view-question'),
  resultView: document.getElementById('view-result'),
  modeGrid: document.getElementById('mode-grid'),
  agreeDisclaimer: document.getElementById('agree-disclaimer'),
  startBtn: document.getElementById('start-btn'),
  backBtn: document.getElementById('back-btn'),
  nextBtn: document.getElementById('next-btn'),
  questionTitle: document.getElementById('question-title'),
  questionOptions: document.getElementById('question-options'),
  questionHint: document.getElementById('question-hint'),
  questionSection: document.getElementById('question-section'),
  questionCount: document.getElementById('question-count'),
  progressBar: document.getElementById('progress-bar'),
  resultCards: document.getElementById('result-cards'),
  safetyBanner: document.getElementById('safety-banner'),
  bottlenecks: document.getElementById('bottlenecks'),
  plan: document.getElementById('plan'),
  facilityTemplate: document.getElementById('facility-template'),
  shareLink: document.getElementById('share-link'),
  copyBtn: document.getElementById('copy-btn'),
  restartBtn: document.getElementById('restart-btn'),
};

const API_TIMEOUT_MS = 2000;

async function fetchWithTimeout(url, options = {}, timeout = API_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

async function loadConfig() {
  try {
    const response = await fetchWithTimeout(apiUrl('/api/v1/config'));
    if (!response.ok) throw new Error('config request failed');
    const data = await response.json();
    if (Array.isArray(data.questions) && Array.isArray(data.gym_types)) {
      dataStore.questions = normalizeQuestions(data.questions);
      dataStore.gymTypes = data.gym_types;
      dataStore.scoringRules = data.scoring_rules || [];
      state.useApi = true;
      return;
    }
    state.useApi = false;
  } catch (error) {
    state.useApi = false;
  }
}

function getQuestions() {
  if (!state.mode) return [];
  return dataStore.questions
    .filter((q) => q.mode === state.mode)
    .sort((a, b) => {
      const aOrder = Number.isFinite(Number(a.order)) ? Number(a.order) : null;
      const bOrder = Number.isFinite(Number(b.order)) ? Number(b.order) : null;
      if (aOrder === null && bOrder === null) return a._index - b._index;
      if (aOrder === null) return 1;
      if (bOrder === null) return -1;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a._index - b._index;
    });
}

function getSkipTarget(question, answer) {
  if (!answer) return null;
  if (question.branching) {
    const { ifValue, skipTo } = question.branching;
    if (ifValue === answer && skipTo) return skipTo;
  }
  if (Array.isArray(question.branching_rules)) {
    for (const rule of question.branching_rules) {
      const { if: cond, then } = rule;
      if (!cond || !then) continue;
      const values = Array.isArray(cond.value) ? cond.value : [cond.value];
      const matches = cond.operator === 'eq'
        ? values.includes(answer)
        : cond.operator === 'neq'
          ? !values.includes(answer)
          : cond.operator === 'in'
            ? values.includes(answer)
            : cond.operator === 'not_in'
              ? !values.includes(answer)
              : false;
      if (matches && then.action === 'skip_to' && then.target) return then.target;
    }
  }
  return null;
}

function buildFlow() {
  const questions = getQuestions();
  const idToIndex = Object.fromEntries(questions.map((q, idx) => [q.id, idx]));
  const flow = [];
  let i = 0;
  while (i < questions.length) {
    const q = questions[i];
    flow.push(q.id);
    const answer = state.answers[q.id];
    const skipTarget = getSkipTarget(q, answer);
    if (skipTarget && idToIndex[skipTarget] !== undefined) {
      i = idToIndex[skipTarget];
      continue;
    }
    i += 1;
  }
  return flow;
}

function setView(view) {
  elements.startView.classList.add('hidden');
  elements.questionView.classList.add('hidden');
  elements.resultView.classList.add('hidden');
  view.classList.remove('hidden');
}

function renderStart() {
  setView(elements.startView);
  const modeButtons = elements.modeGrid.querySelectorAll('.mode-card');
  modeButtons.forEach((btn) => {
    btn.dataset.selected = state.mode === btn.dataset.mode ? 'true' : 'false';
    const mode = btn.dataset.mode;
    const meta = btn.querySelector('.mode-meta');
    if (meta) {
      const count = dataStore.questions.filter((q) => q.mode === mode).length;
      if (count) {
        const timeText = mode === 'simple' ? '1〜2分' : '4〜6分';
        meta.textContent = `所要: ${timeText} / ${count}問前後`;
      }
    }
  });
  elements.startBtn.disabled = !(state.mode && state.acceptedDisclaimer);
}

function renderQuestion() {
  const questions = getQuestions();
  const flow = buildFlow();
  const currentId = state.currentQuestionId || flow[0];
  state.currentQuestionId = currentId;
  const currentIndex = flow.indexOf(currentId);
  const currentQuestion = questions.find((q) => q.id === currentId);
  if (!currentQuestion) {
    void showResults();
    return;
  }

  const optionalLabel = currentQuestion.required === false ? '（任意）' : '';
  elements.questionTitle.textContent = `${currentQuestion.prompt}${optionalLabel}`;
  elements.questionSection.textContent = currentQuestion.section || (state.mode === 'simple' ? '簡単診断' : '複雑診断');
  elements.questionCount.textContent = `${currentIndex + 1} / ${flow.length}`;
  elements.progressBar.style.width = `${((currentIndex + 1) / flow.length) * 100}%`;
  elements.questionOptions.innerHTML = '';
  elements.questionHint.textContent = '';
  const hintLines = [];
  if (currentQuestion.helper_text) hintLines.push(currentQuestion.helper_text);
  if (currentQuestion.description) hintLines.push(currentQuestion.description);
  if (currentQuestion.example_hint) hintLines.push(currentQuestion.example_hint);
  if (currentQuestion.type === 'multi') hintLines.push('複数選択可');
  if (currentQuestion.max_selections || currentQuestion.maxSelections) {
    const max = currentQuestion.max_selections ?? currentQuestion.maxSelections;
    hintLines.push(`最大${max}つまで選択できます`);
  }
  if (currentQuestion.required === false) hintLines.push('任意回答です');

  if (currentQuestion.type === 'single' || currentQuestion.type === 'multi') {
    const sortedOptions = [...(currentQuestion.options || [])].sort((a, b) => {
      const aOrder = Number.isFinite(Number(a.order)) ? Number(a.order) : null;
      const bOrder = Number.isFinite(Number(b.order)) ? Number(b.order) : null;
      if (aOrder === null && bOrder === null) return (a._index ?? 0) - (b._index ?? 0);
      if (aOrder === null) return 1;
      if (bOrder === null) return -1;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return (a._index ?? 0) - (b._index ?? 0);
    });

    sortedOptions.forEach((option) => {
      const optionEl = document.createElement('label');
      optionEl.className = 'option-card';

      const input = document.createElement('input');
      input.type = currentQuestion.type === 'single' ? 'radio' : 'checkbox';
      input.name = currentQuestion.id;
      input.value = option.value;

      const currentValue = state.answers[currentQuestion.id];
      if (currentQuestion.type === 'single') {
        input.checked = currentValue === option.value;
      } else if (Array.isArray(currentValue)) {
        input.checked = currentValue.includes(option.value);
      }

      input.addEventListener('change', () => {
        if (currentQuestion.type === 'single') {
          state.answers[currentQuestion.id] = option.value;
        } else {
          const prev = Array.isArray(state.answers[currentQuestion.id]) ? state.answers[currentQuestion.id] : [];
          const next = new Set(prev);
          const maxSelections = currentQuestion.max_selections ?? currentQuestion.maxSelections;
          if (input.checked) {
            if (maxSelections && next.size > maxSelections) {
              input.checked = false;
              elements.questionHint.textContent = `最大${maxSelections}つまで選択できます。`;
              return;
            }
            next.add(option.value);
          } else {
            next.delete(option.value);
          }
          state.answers[currentQuestion.id] = Array.from(next);
        }
        renderQuestion();
      });

      const body = document.createElement('div');
      body.className = 'option-body';

      const label = document.createElement('div');
      label.className = 'option-label';
      label.textContent = option.label;

      body.appendChild(label);
      const exampleSource = option.example ?? option.examples ?? option.description;
      const exampleText = Array.isArray(exampleSource)
        ? exampleSource.join(' / ')
        : exampleSource;
      if (exampleText) {
        const example = document.createElement('div');
        example.className = 'option-example';
        example.textContent = exampleText;
        body.appendChild(example);
      }

      optionEl.appendChild(input);
      optionEl.appendChild(body);
      elements.questionOptions.appendChild(optionEl);

      const isOtherOption = option.value?.endsWith('_other') || option.label?.includes('その他');
      const isSelected = currentQuestion.type === 'single'
        ? state.answers[currentQuestion.id] === option.value
        : Array.isArray(state.answers[currentQuestion.id]) && state.answers[currentQuestion.id].includes(option.value);
      if (isOtherOption && isSelected) {
        const otherInput = document.createElement('input');
        otherInput.type = 'text';
        otherInput.className = 'input';
        otherInput.placeholder = currentQuestion.other_placeholder || '任意入力';
        otherInput.value = state.otherText[currentQuestion.id] || '';
        otherInput.addEventListener('input', () => {
          state.otherText[currentQuestion.id] = otherInput.value;
        });
        elements.questionOptions.appendChild(otherInput);
      }
    });
  }

  if (currentQuestion.type === 'slider') {
    const wrapper = document.createElement('div');
    wrapper.className = 'option-card';

    const input = document.createElement('input');
    input.type = 'range';
    input.min = currentQuestion.min ?? 0;
    input.max = currentQuestion.max ?? 10;
    input.step = currentQuestion.step ?? 1;
    const defaultValue = state.answers[currentQuestion.id] ?? Math.round((input.max - input.min) / 2);
    input.value = defaultValue;
    if (state.answers[currentQuestion.id] === undefined) {
      state.answers[currentQuestion.id] = Number(defaultValue);
    }

    const output = document.createElement('div');
    output.className = 'option-label';
    output.textContent = `現在: ${input.value}`;

    input.addEventListener('input', () => {
      output.textContent = `現在: ${input.value}`;
      state.answers[currentQuestion.id] = Number(input.value);
    });

    wrapper.appendChild(output);
    wrapper.appendChild(input);
    elements.questionOptions.appendChild(wrapper);
  }

  if (currentQuestion.type === 'text') {
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.className = 'input';
    textInput.placeholder = currentQuestion.placeholder || currentQuestion.example_hint || '任意入力';
    textInput.value = state.answers[currentQuestion.id] || '';
    textInput.addEventListener('input', () => {
      state.answers[currentQuestion.id] = textInput.value;
    });
    elements.questionOptions.appendChild(textInput);
  }

  if (currentQuestion.id === 'Q-F0') {
    hintLines.push('痛み/不調がある場合でも上位3の提案は継続します。');
  }
  if (hintLines.length) {
    elements.questionHint.textContent = hintLines.join(' ');
  }

  setView(elements.questionView);
}

function deriveTraits() {
  const traits = new Set();
  const questions = getQuestions();
  questions.forEach((q) => {
    const answer = state.answers[q.id];
    if (!answer) return;
    if (q.type === 'single') {
      const opt = q.options?.find((o) => o.value === answer);
      opt?.traits?.forEach((t) => traits.add(t));
    }
    if (q.type === 'multi' && Array.isArray(answer)) {
      answer.forEach((val) => {
        const opt = q.options?.find((o) => o.value === val);
        opt?.traits?.forEach((t) => traits.add(t));
      });
    }
    if (q.type === 'slider' && typeof answer === 'number') {
      if (q.id === 'Q-F3' && answer >= 6) traits.add('pain_present');
      if (q.id === 'Q-F3' && answer >= 8) traits.add('red_flag_maybe');
    }
  });

  const painAnswer = state.answers['Q-F0'];
  if (painAnswer === 'pain_yes') traits.add('pain_present');
  if (painAnswer === 'pain_none') traits.delete('pain_present');

  const redFlagAnswer = state.answers['Q-F1'];
  if (Array.isArray(redFlagAnswer)) {
    const hasRedFlag = redFlagAnswer.some((v) => v !== 'redflag_none');
    if (hasRedFlag) traits.add('red_flag_maybe');
  }

  return traits;
}

function computeResultsLocal() {
  const traits = deriveTraits();
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

  const top3 = ranked.slice(0, 3).map((r) => r.id);

  const safetyFlags = {
    pain_present: traits.has('pain_present'),
    red_flag_maybe: traits.has('red_flag_maybe'),
  };

  const bottlenecks = [];
  traits.forEach((trait) => {
    if (bottleneckLabels[trait]) bottlenecks.push(bottleneckLabels[trait]);
  });

  const plan = buildPlan(traits);

  return {
    top3,
    reasons,
    safetyFlags,
    bottlenecks: bottlenecks.slice(0, 2),
    plan,
  };
}

async function scoreViaApi() {
  const answers = Object.entries(state.answers).map(([question_id, value]) => ({
    question_id,
    value,
  }));
  const response = await fetchWithTimeout(apiUrl('/api/v1/diagnoses/score'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: state.mode, answers }),
  }, 4000);
  if (!response.ok) {
    throw new Error('score request failed');
  }
  const data = await response.json();
  return {
    top3: data.result_top3 || [],
    reasons: data.reasons || {},
    safetyFlags: data.safety_flags || { pain_present: false, red_flag_maybe: false },
    bottlenecks: data.bottlenecks || [],
    plan: data.first_4weeks || buildPlan(new Set()),
  };
}

async function computeResults() {
  if (state.useApi) {
    try {
      return await scoreViaApi();
    } catch (error) {
      state.useApi = false;
    }
  }
  return computeResultsLocal();
}

function buildPlan(traits) {
  const answers = state.answers;
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

function buildSharePayload(results) {
  return {
    v: 1,
    mode: state.mode,
    result_top3: results.top3,
    reasons: Object.fromEntries(
      results.top3.map((id) => [id, (results.reasons[id] || []).slice(0, 2)])
    ),
    safety_flags: results.safetyFlags,
  };
}

function encodeSharePayload(payload) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}

async function prepareShareLink(results) {
  if (state.shareId) {
    elements.shareLink.value = `${location.origin}${location.pathname}?share=${state.shareId}`;
    return;
  }

  const payload = buildSharePayload(results);
  elements.shareLink.value = 'リンクを生成中...';

  if (state.useApi) {
    try {
      const response = await fetchWithTimeout(apiUrl('/api/v1/share'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload }),
      }, 4000);
      if (response.ok) {
        const data = await response.json();
        const shareId = data.share_id;
        if (shareId) {
          state.shareId = shareId;
          elements.shareLink.value = `${location.origin}${location.pathname}?share=${shareId}`;
          return;
        }
      }
      state.useApi = false;
    } catch (error) {
      state.useApi = false;
    }
  }

  const encoded = encodeSharePayload(payload);
  elements.shareLink.value = `${location.origin}${location.pathname}#share=${encoded}`;
}

async function showResults() {
  state.results = await computeResults();
  renderResults();
}

function renderResults() {
  const { top3, reasons, safetyFlags, bottlenecks, plan } = state.results;
  elements.resultCards.innerHTML = '';

  if (safetyFlags.pain_present) {
    elements.safetyBanner.classList.remove('hidden');
    elements.safetyBanner.textContent = '痛みや不調がある場合は、運動前に医療機関へ相談することを検討してください。無理はしないでください。';
  } else {
    elements.safetyBanner.classList.add('hidden');
  }

  top3.forEach((gymId, index) => {
    const gym = dataStore.gymTypes.find((g) => g.id === gymId) || gymTypes.find((g) => g.id === gymId);
    if (!gym) return;
    const card = document.createElement('div');
    card.className = 'result-card';
    const reasonList = reasons[gymId]?.slice(0, 3) || [];

    card.innerHTML = `
      <div class="rank">${index + 1}位</div>
      <div class="option-label">${gym.name}</div>
      <div class="muted">料金目安: ${gym.price_range}</div>
      <div>
        <strong>合う理由</strong>
        <ul class="list">${reasonList.map((r) => `<li>${r}</li>`).join('') || '<li>回答の傾向に合いやすい</li>'}</ul>
      </div>
      <div>
        <strong>注意点</strong>
        <ul class="list">${(gym.cautions || []).map((c) => `<li>${c}</li>`).join('') || '<li>無理のない範囲で進めましょう</li>'}</ul>
      </div>
      <div class="checklist">
        <strong>体験時チェック</strong>
        <ul class="list">${(gym.checklist_items || []).map((c) => `<li>${c}</li>`).join('') || '<li>スタッフのサポート有無</li>'}</ul>
      </div>
    `;
    elements.resultCards.appendChild(card);
  });

  elements.bottlenecks.innerHTML = '';
  const bottleneckItems = bottlenecks.length ? bottlenecks : ['今の生活リズムに合わせられるか'];
  bottleneckItems.forEach((b) => {
    const li = document.createElement('li');
    li.textContent = b;
    elements.bottlenecks.appendChild(li);
  });

  elements.plan.innerHTML = `
    <div><strong>頻度</strong>: ${plan.frequency}</div>
    <div><strong>滞在時間</strong>: ${plan.duration}</div>
    <div><strong>やること</strong>: ${plan.focus.join(' / ')}</div>
  `;

  elements.facilityTemplate.textContent = '「初心者で、気になる部位に痛み/違和感があります。痛みが出ない範囲で運動を始めたいので、フォームと負荷の調整を相談できますか？」';

  void prepareShareLink(state.results);

  setView(elements.resultView);
}

function validateCurrent() {
  const currentId = state.currentQuestionId;
  const answer = state.answers[currentId];
  const currentQuestion = getQuestions().find((q) => q.id === currentId);
  if (!currentQuestion) return true;
  const required = currentQuestion.required !== false;
  if (currentQuestion.type === 'single') return required ? Boolean(answer) : true;
  if (currentQuestion.type === 'multi') {
    if (!required && (!Array.isArray(answer) || answer.length === 0)) return true;
    const minSelections = currentQuestion.min_selections ?? currentQuestion.minSelections ?? (required ? 1 : 0);
    return Array.isArray(answer) && answer.length >= minSelections;
  }
  if (currentQuestion.type === 'slider') {
    return required ? typeof answer === 'number' : true;
  }
  if (currentQuestion.type === 'text') return required ? Boolean(answer) : true;
  return true;
}

async function goNext() {
  if (!validateCurrent()) {
    elements.questionHint.textContent = 'いずれかを選択してください。';
    return;
  }
  const flow = buildFlow();
  const currentIndex = flow.indexOf(state.currentQuestionId);
  if (currentIndex === flow.length - 1) {
    await showResults();
  } else {
    state.currentQuestionId = flow[currentIndex + 1];
    renderQuestion();
  }
}

function goBack() {
  const flow = buildFlow();
  const currentIndex = flow.indexOf(state.currentQuestionId);
  if (currentIndex <= 0) {
    renderStart();
  } else {
    state.currentQuestionId = flow[currentIndex - 1];
    renderQuestion();
  }
}

function reset() {
  state.mode = null;
  state.acceptedDisclaimer = false;
  state.answers = {};
  state.currentQuestionId = null;
  state.results = null;
  state.shareId = null;
  elements.agreeDisclaimer.checked = false;
  renderStart();
}

function getShareInfo() {
  const url = new URL(window.location.href);
  const shareId = url.searchParams.get('share') || url.searchParams.get('share_id');
  if (shareId) return { type: 'id', value: shareId };

  if (url.hash.startsWith('#share=')) {
    return { type: 'payload', value: url.hash.replace('#share=', '') };
  }
  if (url.hash.startsWith('#share_id=')) {
    return { type: 'id', value: url.hash.replace('#share_id=', '') };
  }
  return null;
}

async function initFromShare() {
  const info = getShareInfo();
  if (!info) return false;

  if (info.type === 'payload') {
    try {
      const payload = JSON.parse(decodeURIComponent(escape(atob(info.value))));
      state.mode = payload.mode || 'simple';
      state.shareId = null;
      state.results = {
        top3: payload.result_top3,
        reasons: payload.reasons || {},
        safetyFlags: payload.safety_flags || { pain_present: false, red_flag_maybe: false },
        bottlenecks: [],
        plan: buildPlan(new Set()),
      };
      renderResults();
      return true;
    } catch (e) {
      return false;
    }
  }

  if (info.type === 'id') {
    try {
      const response = await fetchWithTimeout(apiUrl(`/api/v1/share/${info.value}`), {}, 4000);
      if (!response.ok) throw new Error('share not found');
      const data = await response.json();
      const payload = data.payload;
      if (!payload) return false;
      state.mode = payload.mode || 'simple';
      state.shareId = info.value;
      state.results = {
        top3: payload.result_top3 || [],
        reasons: payload.reasons || {},
        safetyFlags: payload.safety_flags || { pain_present: false, red_flag_maybe: false },
        bottlenecks: [],
        plan: buildPlan(new Set()),
      };
      renderResults();
      return true;
    } catch (e) {
      return false;
    }
  }

  return false;
}

async function init() {
  await loadConfig();
  if (await initFromShare()) return;
  renderStart();
}

// Event bindings

elements.modeGrid.addEventListener('click', (event) => {
  const target = event.target.closest('.mode-card');
  if (!target) return;
  state.mode = target.dataset.mode;
  renderStart();
});

elements.agreeDisclaimer.addEventListener('change', (event) => {
  state.acceptedDisclaimer = event.target.checked;
  renderStart();
});

elements.startBtn.addEventListener('click', () => {
  state.answers = {};
  state.shareId = null;
  const flow = buildFlow();
  state.currentQuestionId = flow[0];
  renderQuestion();
});

elements.nextBtn.addEventListener('click', () => {
  void goNext();
});

elements.backBtn.addEventListener('click', goBack);

elements.copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(elements.shareLink.value);
    elements.copyBtn.textContent = 'コピーしました';
    setTimeout(() => (elements.copyBtn.textContent = 'リンクをコピー'), 1500);
  } catch (e) {
    elements.copyBtn.textContent = 'コピー失敗';
    setTimeout(() => (elements.copyBtn.textContent = 'リンクをコピー'), 1500);
  }
});

elements.restartBtn.addEventListener('click', () => {
  location.hash = '';
  reset();
});

void init();
