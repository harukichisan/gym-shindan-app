# ジム診断ブラウザアプリ API設計（v0.1）

更新日: 2026-01-29  
対象: MVP（共有機能のみ）

## 1. 共通仕様
### 1.1 Content-Type
- Request: `application/json`
- Response: `application/json`

### 1.2 エラー形式
```json
{
  "error": {
    "code": "invalid_request",
    "message": "payload is invalid",
    "details": [{"field": "answers", "reason": "required"}]
  }
}
```

## 2. GET /api/v1/config
### 2.1 概要
質問、ジムタイプ辞書、スコアリング設定を一括取得。

### 2.2 Response（例）
```json
{
  "version": "2026-01-29",
  "questions": [
    {
      "id": "Q-S1",
      "mode": "simple",
      "type": "single",
      "prompt": "目的は？",
      "options": [
        {"value": "goal_weight_loss", "label": "痩せたい"}
      ]
    }
  ],
  "gym_types": [
    {
      "id": "24h",
      "name": "24hジム",
      "price_range": "6000-12000",
      "fit_reasons": ["時間が不規則でも通える"]
    }
  ],
  "scoring_rules": [
    {"gym_type_id": "24h", "trait_id": "schedule_irregular", "weight": 2}
  ]
}
```

## 3. POST /api/v1/diagnoses/score
### 3.1 概要
回答から結果をサーバで算出する場合のAPI。

### 3.2 Request
```json
{
  "mode": "complex",
  "answers": [
    {"question_id": "Q-A1", "value": "goal_weight_loss"},
    {"question_id": "Q-F3", "value": 6}
  ]
}
```

### 3.3 Response（例）
```json
{
  "result_top3": ["personal", "conditioning", "semipersonal"],
  "reasons": {
    "personal": ["フォームが不安", "負荷調整が必要"],
    "conditioning": ["痛み/不調に配慮しやすい"]
  },
  "safety_flags": {"pain_present": true, "red_flag_maybe": false},
  "bottlenecks": ["人目が気になる"],
  "first_4weeks": {
    "frequency": "週2",
    "duration": "45-60分",
    "focus": ["フォーム確認", "低負荷で習慣化"]
  }
}
```

## 4. POST /api/v1/share
### 4.1 概要
結果の最小ペイロードから共有トークンを発行。

### 4.2 Request
```json
{
  "payload": {
    "v": 1,
    "mode": "simple",
    "result_top3": ["24h", "public", "studio"],
    "reasons": {
      "24h": ["時間が不規則", "低コストで始めたい"]
    },
    "safety_flags": {"pain_present": false, "red_flag_maybe": false}
  }
}
```

### 4.3 Response（例）
```json
{
  "share_id": "s8F3k2d9mX",
  "expires_at": "2026-04-29T00:00:00Z"
}
```

## 5. GET /api/v1/share/{share_id}
### 5.1 概要
共有トークンから結果を復元。

### 5.2 Response（例）
```json
{
  "payload": {
    "v": 1,
    "mode": "simple",
    "result_top3": ["24h", "public", "studio"],
    "reasons": {
      "24h": ["時間が不規則", "低コストで始めたい"]
    },
    "safety_flags": {"pain_present": false, "red_flag_maybe": false}
  }
}
```

## 6. GET /api/v1/health
### 6.1 Response
```json
{"status": "ok"}
```
