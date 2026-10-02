#!/usr/bin/env python3
"""
Baza wiedzy funkcji (02.10.2026): jedno źródło prawdy = docs/research/kb/<app>.json (format: docs/research/kb/SCHEMA.md).
Ten skrypt generuje z niego wszystko inne — nic nie przepisujemy ręcznie (lekcja 1):
  docs/research/kb/matrix.csv        — macierz funkcja × aplikacja (do arkusza na Dysku)
  docs/research/kb/kb-data.json, baza-wiedzy.html — strona „Baza wiedzy” (artefakt; szablon scripts/kb/page.html)
  docs/research/equipment/catalog.csv — katalog wymagań sprzętowych ćwiczeń (do arkusza)
Uruchomienie: python3 scripts/kb/build.py
"""
import csv, glob, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
KB = os.path.join(ROOT, 'docs/research/kb')

# Różni badacze nazwali te same „nowe” funkcje inaczej — sprowadzamy do jednej nazwy.
ALIAS = {
    'keep_awake': 'keep_screen_awake', 'train_again': 'repeat_last_workout',
    'strava_full_sync': 'strava_sync',
    'web_planner': 'web_app', 'web_desktop_version': 'web_app', 'web_program_creator': 'web_app', 'web_program_editor': 'web_app',
    'multi_platform': 'platforms', 'platforms_requirements': 'platforms',
    'weekly_reports': 'periodic_reports', 'training_reports': 'periodic_reports', 'weekly_recap': 'periodic_reports', 'monthly_report_year_review': 'periodic_reports',
    'year_end_wrapped': 'year_review', 'year_in_review': 'year_review',
    'mcp_server_ai_connectors': 'ai_connectors', 'chatgpt_claude': 'ai_connectors', 'mcp_server_chatgpt_plugin': 'ai_connectors',
    'rest_api': 'public_api',
    'live_heart_rate': 'heart_rate', 'heart_rate_zones': 'heart_rate', 'heart_rate_display': 'heart_rate', 'earbuds_heart_rate': 'heart_rate',
    'injury_tracking': 'injuries', 'injuries_limitations': 'injuries', 'trainer_injury_management': 'injuries',
    'exclude_workout_from_strength_score': 'exclude_from_stats', 'exclude_exercises_from_stats': 'exclude_from_stats', 'start_history_from': 'exclude_from_stats',
    'custom_goals': 'goals', 'iron_points_badges': 'achievements', 'calories_burned_estimate': 'calorie_estimates',
    'update_exercise_across_routines': 'template_update_prompt',
    'audio_instructions': 'audio_guidance', 'audio_coach': 'audio_guidance', 'hiit_voice_guidance': 'audio_guidance',
    'transfer_exercise_data': 'merge_exercise_history', 'live_pr_notifications': 'live_pr',
}
# Nasze funkcje opisane w schemacie pod inną nazwą — żeby macierz nie pokazywała fałszywej luki.
OURS_EXTRA = {
    'live_pr': ('yes', 'Plakietka PR na żywo przy serii, która bije rekord (raz na ćwiczenie w treningu) — patrz stats_prs.'),
    'rep_ranges': ('yes', 'Zakres powtórzeń w pozycji szablonu (pow. od / do) — patrz plan_templates.'),
}

PL = {
 'log': 'Logowanie treningu', 'timer': 'Przerwy i czas', 'plan': 'Szablony i programy', 'lib': 'Biblioteka ćwiczeń', 'prog': 'Progresja',
 'stats': 'Rekordy i statystyki', 'body': 'Ciało', 'int': 'Integracje i dane', 'equip': 'Sprzęt i miejsca', 'social': 'Społeczność',
 'coach': 'Trener', 'monet': 'Płatności', 'ux': 'Ustawienia i wygoda', 'new': 'Inne (spoza listy)',
}
LABEL = {
 'log_set_fields': 'Pola serii (kg/powt./czas/dystans)', 'log_set_types': 'Typy serii (rozgrzewka, drop, do upadku)', 'log_rpe_rir': 'RPE/RIR',
 'log_previous_values': 'Wartości z poprzedniego razu', 'log_autofill': 'Automatyczne wypełnianie', 'log_notes': 'Notatki', 'log_supersets': 'Supersety/obwody',
 'log_reorder': 'Zmiana kolejności w treningu', 'log_replace_exercise': 'Zamiana ćwiczenia w trakcie', 'log_plate_calculator': 'Kalkulator talerzy',
 'log_warmup_calculator': 'Kalkulator rozgrzewki', 'log_bodyweight_assisted': 'Masa ciała z dociążeniem/asystą', 'log_unilateral': 'Strona lewa/prawa',
 'log_tempo': 'Tempo', 'log_empty_workout': 'Pusty trening', 'log_edit_past': 'Edycja/wsteczne dodanie treningu', 'log_one_hand_ux': 'Obsługa jedną ręką',
 'timer_auto_rest': 'Automatyczna przerwa', 'timer_per_exercise': 'Przerwa per ćwiczenie', 'timer_notifications': 'Powiadomienie o końcu przerwy',
 'timer_live_activity': 'Live Activity / Dynamic Island', 'timer_set_stopwatch': 'Stoper serii czasowych', 'timer_workout_duration': 'Czas treningu',
 'timer_abandoned_workout': 'Porzucony trening', 'plan_templates': 'Szablony', 'plan_folders': 'Foldery szablonów', 'plan_programs': 'Programy wielotygodniowe',
 'plan_periodization': 'Periodyzacja/% 1RM/deload', 'plan_generator': 'Generator treningów (AI/algorytm)', 'plan_schedule': 'Kalendarz/plan tygodnia',
 'plan_share_templates': 'Udostępnianie szablonów', 'lib_size': 'Liczba ćwiczeń', 'lib_media': 'Filmy/animacje', 'lib_custom': 'Własne ćwiczenia',
 'lib_muscles': 'Mięśnie główne/pomocnicze', 'lib_equipment_filter': 'Filtr sprzętu', 'lib_search': 'Wyszukiwanie', 'lib_localization': 'Języki biblioteki',
 'prog_suggestions': 'Podpowiedzi ciężaru/powtórzeń', 'prog_double_progression': 'Podwójna progresja', 'prog_deload': 'Deload', 'prog_fatigue': 'Zmęczenie/regeneracja',
 'prog_ai_coach': 'Trener AI', 'stats_prs': 'Rekordy', 'stats_e1rm': 'e1RM', 'stats_charts_exercise': 'Wykresy ćwiczenia', 'stats_volume': 'Objętość/serie na partię',
 'stats_muscle_heatmap': 'Mapa mięśni', 'stats_calendar_streaks': 'Kalendarz/serie dni', 'stats_workout_summary': 'Podsumowanie po treningu',
 'stats_strength_standards': 'Normy siły/percentyle', 'body_weight': 'Masa ciała', 'body_measurements': 'Obwody', 'body_photos': 'Zdjęcia sylwetki',
 'body_readiness': 'Gotowość (sen, HRV, poranny wpis)', 'int_apple_health': 'Apple Health', 'int_watch_app': 'Aplikacja na zegarek', 'int_garmin': 'Garmin/inne zegarki',
 'int_import': 'Import (Strong/Hevy/CSV)', 'int_export': 'Eksport', 'int_backup_sync': 'Kopia/synchronizacja/konto', 'int_widgets': 'Widżety', 'int_siri_shortcuts': 'Siri/Skróty',
 'equip_locations': 'Miejsca treningu', 'equip_inventory': 'Dostępne ciężary', 'equip_filtering': 'Ćwiczenia wg sprzętu',
 'social_feed': 'Feed', 'social_share': 'Udostępnianie treningu', 'social_leaderboards': 'Rankingi', 'social_challenges': 'Wyzwania',
 'coach_client_management': 'Trener: podopieczni', 'coach_assign_programs': 'Trener: przypisywanie planów', 'coach_feedback': 'Trener: komentarze',
 'coach_chat': 'Trener: czat', 'coach_marketplace': 'Rynek trenerów', 'monet_model': 'Model płatności',
 'ux_units': 'Jednostki', 'ux_theme': 'Motyw', 'ux_languages': 'Języki', 'ux_accessibility': 'Dostępność (VoiceOver, duża czcionka)', 'ux_onboarding': 'Wprowadzenie',
 'ux_offline': 'Działanie offline', 'ux_privacy': 'Prywatność/konto',
}
ORDER = ['Trening (nasza)', 'Strong', 'Hevy', 'Fitbod', 'Alpha Progression', 'Liftosaur', 'StrengthLog', 'JEFIT', 'Boostcamp', 'SmartGym', 'Caliber']
SYM = {'yes': '✓', 'paid': '$', 'partial': '◐', 'no': '✗', 'unknown': '?'}


def canon(fid):
    if fid.startswith('new:'):
        k = fid[4:]
        return 'new:' + ALIAS.get(k, k)
    return fid


def load():
    apps = {}
    for f in glob.glob(os.path.join(KB, '*.json')):
        if f.endswith('kb-data.json'):
            continue
        d = json.load(open(f))
        feats = {}
        for x in d['features']:
            c = canon(x['feature_id'])
            if c in feats:  # dwie nazwy u jednej aplikacji → łączymy opis
                feats[c]['how'] += ' | ' + x['how']; feats[c]['how_pl'] = (feats[c].get('how_pl') or feats[c]['how']) + ' | ' + (x.get('how_pl') or x['how']); feats[c]['sources'] += x.get('sources', [])
                if feats[c]['has'] not in ('yes', 'paid') and x['has'] in ('yes', 'paid', 'partial'): feats[c]['has'] = x['has']
            else:
                feats[c] = dict(x, feature_id=c)
        apps[d['app']] = dict(d, feats=feats)
    for k, (has, how) in OURS_EXTRA.items():
        apps['Trening (nasza)']['feats'].setdefault('new:' + k, {'area': 'new', 'feature_id': 'new:' + k, 'has': has, 'how': how, 'sources': []})
    return apps


def main():
    apps = load()
    names = [a for a in ORDER if a in apps] + sorted(set(apps) - set(ORDER))
    schema_ids = list(LABEL)
    new_ids = sorted({f for a in apps.values() for f in a['feats'] if f.startswith('new:')})
    rows = []
    for fid in schema_ids + new_ids:
        area = fid.split('_')[0] if not fid.startswith('new:') else 'new'
        if area == 'prog' and fid in ('prog_deload', 'prog_fatigue'): area = 'prog'
        cells = [apps[a]['feats'].get(fid) for a in names]
        n_others = sum({'yes': 1, 'paid': 1, 'partial': .5}.get((c or {}).get('has'), 0) for c in cells[1:])
        rows.append({'id': fid, 'area': area, 'areaPL': PL.get(area, area), 'label': LABEL.get(fid, fid[4:].replace('_', ' ')), 'others': n_others,
                     'cells': [None if c is None else {'has': c['has'], 'how': c.get('how_pl') or c.get('how', ''), 'fb': c.get('user_feedback_pl') or c.get('user_feedback', ''), 'src': c.get('sources', [])} for c in cells]})
    with open(os.path.join(KB, 'matrix.csv'), 'w', newline='') as fh:
        w = csv.writer(fh)
        w.writerow(['Obszar', 'Funkcja', 'id', 'Ile innych ma (z 10)'] + names)
        for r in rows:
            w.writerow([r['areaPL'], r['label'], r['id'], r['others']] + [SYM.get(c['has'], c['has']) if c else '' for c in r['cells']])
    meta = [{'app': a, 'pricing': apps[a].get('pricing_pl') or apps[a].get('pricing', ''), 'platforms': apps[a].get('platforms_pl') or apps[a].get('platforms', ''), 'positioning': apps[a].get('positioning_pl') or apps[a].get('positioning', ''), 'checked': apps[a].get('version_or_date_checked', '')} for a in names]
    data = {'apps': names, 'meta': meta, 'rows': rows}
    json.dump(data, open(os.path.join(KB, 'kb-data.json'), 'w'), ensure_ascii=False)
    page = open(os.path.join(ROOT, 'scripts/kb/page.html')).read()
    blob = json.dumps(data, ensure_ascii=False).replace('</', '<\\/')
    open(os.path.join(KB, 'baza-wiedzy.html'), 'w').write(page.replace('/*DATA*/null', blob))
    # katalog sprzętu
    cat = json.load(open(os.path.join(ROOT, 'docs/research/equipment/catalog.json')))
    with open(os.path.join(ROOT, 'docs/research/equipment/catalog.csv'), 'w', newline='') as fh:
        w = csv.writer(fh)
        w.writerow(['Ćwiczenie', 'Wymaga (każda grupa; w grupie: którekolwiek)', 'Zalecane', 'Źródło obciążenia', 'Wzorzec ruchu', 'Zamienniki', 'Pewność', 'Uwagi'])
        for c in cat:
            req = ' + '.join('(' + ' lub '.join(g) + ')' if len(g) > 1 else g[0] for g in c['requires']) or '— (nic)'
            w.writerow([c['name'], req, ', '.join(c.get('recommended', [])), c['loadSource'], c['pattern'], c.get('alternativesNote', ''), c.get('confidence', ''), c.get('note', '')])
    print(f'{len(rows)} funkcji × {len(names)} aplikacji; katalog: {len(cat)} ćwiczeń')


if __name__ == '__main__':
    main()
