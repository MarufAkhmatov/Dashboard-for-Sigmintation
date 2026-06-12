# ProjectNest — Session Handoff / Context

Paste this into a new session to continue instantly.

## What this is
**ProjectNest** = a **Portfolio Intelligence Platform** for a Jira **PMD/PMO** portfolio,
built ON TOP of an already-approved "healthcare" dashboard UI.
**RULE #1: the visual design/layout/positions/colors MUST NOT change — only the data does.**
Language: UI is localized **EN / RU / UZ**. Light + Dark theme.

- Repo: https://github.com/MarufAkhmatov/Dashboard-for-Sigmintation  (branch `main`)
- Local: `C:\Users\ASUS\Downloads\DashboardForJiraTasksAndCalendars-main (1)\DashboardForJiraTasksAndCalendars-main`

## Stack & how to run
- **Frontend**: Vite + React + TS (kept Vite even though spec said Next.js — design is approved).
  `npm run dev` → http://localhost:5173
- **Backend**: **Python 3.14 stdlib HTTP server** (`backend/server.py`) → http://localhost:8077
  Run: `python backend/server.py`. Zero pip installs for CSV/HTML; XLSX needs `openpyxl`.
  (FastAPI app in `backend/app/main.py` exists as the "production" reference, but stdlib
  `server.py` is what actually runs — pydantic/FastAPI don't build on Python 3.14.)
- Frontend talks to backend at `http://localhost:8077` (see `src/app/portfolio.tsx` API const).

## Data reality (IMPORTANT)
- User uploads a Jira **"Printable" HTML export** (Russian locale, per-issue cards). 1000-issue cap per JQL,
  so user will upload **PMD and PMO separately** → use **merge** (upload prompts replace vs merge).
- The real test file: `C:\Users\ASUS\Downloads\Ipak - Jira (1).html` (12 MB, 1000 issues, 93 epics).
- **NO status-change history (changelog) in this export** → so **TTM split (Discovery/Delivery),
  Lead Time, Flow Efficiency are APPROXIMATE** (history fallback). Resolution date is not a field →
  we use **Updated date as a resolution-date proxy** (so recent items often show duration = 0).
- User is bringing **changelog + all-fields** exports next → then build a changelog parser for EXACT
  TTM/Lead Time/Flow/duration.
- Field coverage of the real file (see the in-app Data Quality panel = gear icon): Status/Type/Project/
  Priority/Created = 100%; PM(custom) 29%; Assignee 76%; Resolved 74%; Epic link 44%; Quarterly status ~66;
  Comments ~608.

## Storage / cache
- File-based: `storage/current/dataset.json` (active = {issues, payload}), `storage/archive/`,
  `storage/uploads/`, `storage/temp/cache/` (parse cache keyed by file sha256).
- **WHEN YOU CHANGE parser/normalize logic → DELETE `storage/temp/cache/*.json` then re-upload**,
  otherwise stale cached issues are returned.
- Postgres schema was planned but **NOT written yet** (file-based is the live storage).

## Backend layout (`backend/app/`)
- `parser.py` — CSV/XLSX/HTML + the **Jira Printable HTML parser** (`_parse_jira_printable`): per-issue
  `[KEY]` cards, RU grid labels, captures full `/browse/` url, comments (comment-header/body pairs),
  Квартальный статус, Priority/Project type/Regulator/Division/Scoring.
- `normalize.py` — aliases (EN/RU/UZ), **Cyrillic-homoglyph status normalization** (Dоne→DONE etc.),
  RU status/type synonyms, completion via Resolution (Готово/Resolved=done, Declined=declined),
  **PM strictly from custom "PM" field** (never Assignee), updated-as-resolved proxy, comments parse.
- `metrics/engines.py` — KPIs, yearly/quarterly/monthly trends + YoY/QoQ, TTM, lead time, flow efficiency,
  project_health (+duration_days), blocker_engine, pm_leaderboard (+period), pm_nominations, top_projects,
  recent_closures, data_quality, filter_issues.
- `aggregate.py` — builds the `widgets` payload that maps 1:1 to the existing UI widgets.
- `aria.py` — **Temur** AI agent. Order: **Claude (if `ANTHROPIC_API_KEY` env) → Ollama → grounded/extractive**.
  `ask()` (chat over portfolio) and `summarize_issue()` (issue summary from quarterly status + comments).
- `storage.py`, `config.py`, `server.py` (endpoints).

## API endpoints (`:8077`)
`/api/health` · `/api/upload?filename=&mode=replace|merge` · `/api/dashboard` · `/api/analytics` ·
`/api/pm-leaderboard?period=all|year|quarter|month|week` · `/api/notifications` · `/api/data-quality` ·
`/api/issues?scope=epics|tasks&state=completed|open|declined&pm=&project=&status=&period=&value=` (drill-down list) ·
`/api/issue?key=KEY` (full detail + `ai_summary`) · `/api/aria` (POST {question}).

## Frontend layout (`src/app/`)
- `App.tsx` — header (logo/ProjectNest, centered nav, lang switcher, **theme toggle**, **upload**, **gear=Data Quality**,
  **bell=Notifications**, user avatar=Avatar Manager), 3 header KPIs (Total/Completed/**Open**), two card rows.
- `theme.tsx` — light/dark tokens as CSS vars (`--card/--text/--bg/--glass-*/--active-*`); active menu buttons
  glow **logo-green `#3ad94f`** in dark.
- `i18n.tsx` — EN/RU/UZ dictionaries. `portfolio.tsx` — data context (fetch/upload/ask/pmBoard/notifications/
  dataQuality/drill/issueDetail). `avatars.ts` (localStorage avatars), `jira.ts` (`jiraUrl`), `drill.ts`
  (`openDrill`), `issue.ts` (`openIssue`).
- Widget components (`components/`): WellnessChart=Portfolio progress, StressRecoveryChart=TTM trend,
  HRVChart=Throughput, GlucoseGauge=Flow efficiency, PatientFlowChart=Project Flow donut,
  BestProjects=Top Projects (key+summary+duration, Jira-linked), HealthcareProviders=**PM Leaderboard**
  (period filter, 🥇🥈🥉 medals, custom scrollbar, expand modal, avatars), AriaPanel=**Temur** chat.
- Hosts mounted in App: `AvatarManager` + `AvatarCropModal`, `NotificationsBell`, `Celebrations` (confetti),
  `DataQualityModal`, `DrillDownHost` (issue list), `IssueDetailHost` (issue detail + AI summary + comments).
- **Clickable numbers** (header KPIs, Project Flow, PM Leaderboard projects/tasks, Progress %) →
  DrillDownHost → click an issue → IssueDetailHost (all fields + **Temur AI summary** + quarterly status +
  comments + "Open in Jira"). Issue keys/names everywhere link to Jira (new tab).

## DONE (features)
Backend engines & parser; Temur AI (Claude/Ollama/fallback); merge PMD+PMO; clickable Jira keys; drill-down
popups; in-app issue detail; data-quality panel; medals; notifications bell; confetti celebrations; avatar
upload/crop; theme light/dark; i18n; Open KPI; AI issue summary from quarterly status + comments.

## TODO / NEXT (in priority order)
1. **Smarter Temur AI summary** — currently extractive (copy/trim) because no LLM key. Set `ANTHROPIC_API_KEY`
   (or run Ollama) AND improve the prompt in `aria.summarize_issue()` to give an *analytical* summary
   (progress / blockers / risks / next steps), not paste. (User asked for this.)
2. **"AI recommendation" button on the issue detail popup (open issues)** — NOT BUILT YET. For issues that are
   still OPEN, add a button "AI recommendation"; on click, Temur returns concrete recommendations on what to do
   to successfully close the issue (use status, age, blockers, comments, quarterly status). Add backend
   `aria.recommend_issue(issue)` + `/api/issue-recommend?key=` (or extend `/api/issue`), wire a button in
   `IssueDetailHost.tsx` that calls it on demand.
3. **Changelog + all-fields exports** (user bringing them): write a changelog parser → EXACT TTM
   (Discovery/Delivery), Lead Time, Cycle Time, Flow Efficiency, CFD, aging WIP, real duration.
4. Best-practice widgets (advised, not built): Priority breakdown, Strategic %, Regulator/compliance board,
   WIP + aging WIP, Cumulative Flow Diagram, Monte-Carlo forecast / SLE, on-time delivery %, per-PM flow.
5. Postgres schema (planned).

## Gotchas
- Python 3.14: avoid pandas/pydantic/FastAPI; stdlib only (+ openpyxl for XLSX).
- Clear `storage/temp/cache/*.json` after parser/normalize changes, then re-upload.
- The preview **screenshot tool times out** because of many external avatar (pravatar) images — the page is
  fine; verify via DOM/`eval` instead.
- Test data without the real file: `python backend/scripts/generate_sample.py` then `selftest.py`
  (server auto-seeds the sample if no dataset is loaded).
- Login-page HTML (11 KB) is NOT an export — needs a real logged-in export.
