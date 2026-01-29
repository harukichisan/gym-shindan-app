# ジム診断ブラウザアプリ データモデリング（v0.1）

更新日: 2026-01-29  
対象: MVP（共有機能のみ）

## 1. 前提・スコープ
- 個人情報は扱わない（氏名/住所/電話/メール等は収集しない）
- MVPは「共有リンク」のみ実装対象（保存/履歴は将来拡張）
- スコアリングは回答から traits を生成し、ジムタイプごとに加点/減点

## 2. ドメインモデル（概念）
### 2.1 GymType（ジムタイプ）
- id
- name
- description
- price_range
- fit_reasons
- cautions
- pain_considerations
- checklist_items
- tags (例: prefers_group, needs_coaching_high)

### 2.2 Question（質問）
- id
- mode: simple | complex
- section (complexのみ)
- type: single | multi | slider | text
- prompt
- options (typeに応じて)
- example_hint
- branching_rules

### 2.3 Answer（回答）
- question_id
- value (単一/複数/数値/テキスト)
- answered_at

### 2.4 Trait（特徴タグ）
- id
- description

### 2.5 ScoringRule（スコア規則）
- gym_type_id
- trait_id
- weight (-3..+3)
- reason_template (根拠文生成の雛形)

### 2.6 DiagnosisSession（診断セッション）
- id
- mode
- answers[]
- derived_traits[]
- scores[{gym_type_id, score}]
- result_top3[]
- safety_flags (例: red_flag_maybe, pain_present)
- created_at

### 2.7 PainReport（痛み/不調）
- present (bool)
- red_flag_maybe (bool)
- pain_areas[]
- pain_level (0-10)
- pain_duration
- pain_triggers[]
- vague_symptoms[]
- impact_level
- medical_status

### 2.8 ShareLink（共有リンク）
- id (短いトークン)
- payload (結果再現用の最小データ)
- payload_hash (改ざん検知用、任意)
- created_at
- expires_at

## 3. 論理モデル（JSONイメージ）
### 3.1 DiagnosisSession（最小）
```json
{
  "id": "ds_01HXYZ...",
  "mode": "complex",
  "answers": [
    {"question_id": "Q-A1", "value": "goal_weight_loss"},
    {"question_id": "Q-F3", "value": 6}
  ],
  "derived_traits": ["needs_coaching_high", "pain_present"],
  "scores": [
    {"gym_type_id": "personal", "score": 18},
    {"gym_type_id": "conditioning", "score": 16}
  ],
  "result_top3": ["personal", "conditioning", "semipersonal"],
  "safety_flags": {"pain_present": true, "red_flag_maybe": false},
  "created_at": "2026-01-29T10:00:00Z"
}
```

### 3.2 SharePayload（結果再現用の最小構成）
```json
{
  "v": 1,
  "mode": "simple",
  "result_top3": ["24h", "public", "studio"],
  "reasons": {
    "24h": ["時間が不規則", "低コストで始めたい"],
    "public": ["都度払いが安心"]
  },
  "safety_flags": {"pain_present": false, "red_flag_maybe": false}
}
```

## 4. 物理モデル（DB案）
> MVPでサーバを持つ場合の最小構成。静的配信のみの場合は不要。

### 4.1 テーブル案
- gym_types
- questions
- scoring_rules
- share_links

### 4.2 share_links
- id (PK, varchar 12-16)
- payload_json (jsonb)
- payload_hash (varchar)
- created_at (timestamp)
- expires_at (timestamp, optional)

## 5. ID/運用方針
- ID: ULID/短トークン（共有URLが短くなる）
- 期限: 90日程度で自動失効（MVPの安全策）
- 破棄: 削除APIは将来対応（MVP外）

## 6. 保存方針
- MVP: サーバ保存は ShareLink のみ
- 将来: localStorage に「前回結果」保存を追加

## 7. 非機能（データ面）
- 個人情報なし
- 共有リンクは第三者に見える前提で設計
- 改ざん防止のため payload_hash を任意で付与
