# Feature knowledge base — shared schema

Goal: catalogue features of strength-training apps so they can be compared feature-by-feature with our app ("Trening", an iOS Strong-like logger).

Output ONE JSON file per app at the path given in your task, format:

```json
{
  "app": "Hevy",
  "version_or_date_checked": "2026-10",
  "pricing": "free tier + Pro ~$X/mo (what's paywalled)",
  "platforms": "iOS, Android, Watch, web…",
  "positioning": "one sentence",
  "features": [
    {
      "area": "<one of the area ids below>",
      "feature_id": "<one of the feature ids below, or 'new:<snake_case_name>' if not on the list>",
      "has": "yes | no | partial | paid | unknown",
      "how": "1-3 sentences: HOW it works concretely (UI flow, rules, numbers). No marketing.",
      "user_feedback": "optional: praise/complaints with source",
      "sources": ["https://…"]
    }
  ]
}
```

Rules: every "yes/partial/paid" needs ≥1 source URL (help center, official site/blog, App Store text, credible review, forum). "no" only if you have reasonable evidence (say why in how); otherwise "unknown". Never invent. Prefer official help centers (many are Zendesk: you can try https://<helpcenter>/api/v2/help_center/en-us/articles/search.json?query=... ). Reddit is not reachable — don't waste time.
Cover ALL feature ids below (unknown is fine), and ADD notable features not on the list as `new:` entries (aim for completeness — this is a knowledge base).

## Areas and feature ids

log — Logging a workout
- log_set_fields (weight/reps/time/distance per set; which metric types)
- log_set_types (warm-up, drop, failure, etc.)
- log_rpe_rir
- log_previous_values (shows last time's values; from which session)
- log_autofill (pre-fills from previous/template)
- log_notes (workout / exercise / set notes)
- log_supersets (grouping, circuits)
- log_reorder (drag to reorder during workout)
- log_replace_exercise (swap during workout)
- log_plate_calculator
- log_warmup_calculator
- log_bodyweight_assisted (weighted/assisted bodyweight, bands)
- log_unilateral (per side)
- log_tempo
- log_empty_workout (ad-hoc without template)
- log_edit_past (edit finished workouts, backdate)
- log_one_hand_ux (big targets, keyboard behaviour)

timer — Rest & time
- timer_auto_rest (starts on set complete)
- timer_per_exercise (rest per exercise / per set type)
- timer_notifications (alert when backgrounded)
- timer_live_activity (Lock Screen / Dynamic Island)
- timer_set_stopwatch (timed sets like plank)
- timer_workout_duration
- timer_abandoned_workout (handling forgotten/unfinished sessions)

plan — Templates, programs
- plan_templates (routines)
- plan_folders
- plan_programs (multi-week programs, library of programs)
- plan_periodization (deloads, blocks, % of 1RM)
- plan_generator (AI/algorithmic workout generation)
- plan_schedule (calendar, weekly plan)
- plan_share_templates

lib — Exercise library
- lib_size (number of exercises)
- lib_media (videos/animations/instructions)
- lib_custom (custom exercises)
- lib_muscles (primary/secondary muscles)
- lib_equipment_filter
- lib_search
- lib_localization (languages)

prog — Progression & coaching logic
- prog_suggestions (next weight/reps suggestion; rules)
- prog_double_progression
- prog_deload / prog_fatigue (recovery/readiness model)
- prog_ai_coach

stats — Records, charts, analytics
- stats_prs (which record types)
- stats_e1rm (formula)
- stats_charts_exercise
- stats_volume (weekly volume, per muscle)
- stats_muscle_heatmap
- stats_calendar_streaks
- stats_workout_summary (post-workout summary)
- stats_strength_standards / percentile

body — Body
- body_weight
- body_measurements
- body_photos
- body_readiness (sleep, HRV, morning check-in)

int — Integrations & data
- int_apple_health
- int_watch_app (Apple Watch / Wear OS)
- int_garmin / other wearables
- int_import (Strong/Hevy/CSV import)
- int_export (CSV/JSON export)
- int_backup_sync (cloud sync, account, offline-first)
- int_widgets (home screen widgets)
- int_siri_shortcuts

equip — Equipment & locations
- equip_locations (gym profiles)
- equip_inventory (available weights)
- equip_filtering (exercise availability)

social — Social
- social_feed / social_share / social_leaderboards / social_challenges

coach — Trainer/coach
- coach_client_management / coach_assign_programs / coach_feedback / coach_chat / coach_marketplace

monet — Monetization
- monet_model (free/paid split, prices, trial)

ux — Settings & UX
- ux_units (kg/lb, per exercise?)
- ux_theme (dark/light)
- ux_languages
- ux_accessibility (VoiceOver, dynamic type)
- ux_onboarding
- ux_offline (works without internet/account)
- ux_privacy (account required? data location)
