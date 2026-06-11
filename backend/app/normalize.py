"""Normalize raw Jira rows into a canonical issue model.

Canonical issue keys:
  key, project, type, is_epic, status, status_group, summary,
  pm (assignee), created, resolved, due, epic_key, story_points,
  links: [{type, target}], history: [{status, entered, exited, days}]
"""
import json
import datetime as dt
from . import config

# ---- flexible column lookup -------------------------------------------------
_ALIASES = {
    "key": ["issue key", "key", "issue id", "id"],
    "type": ["issue type", "type", "issuetype"],
    "status": ["status"],
    "summary": ["summary", "title"],
    "pm": ["assignee", "project manager", "pm", "lead"],
    "reporter": ["reporter", "creator"],
    "created": ["created", "created date", "creation date"],
    "resolved": ["resolved", "resolution date", "resolutiondate", "done date", "completed"],
    "due": ["due date", "duedate", "due"],
    "project": ["project", "project key", "project name"],
    "epic_key": ["epic link", "parent", "parent key", "epic", "parent link"],
    "story_points": ["story points", "story point estimate", "points"],
    "history": ["status history", "changelog", "status changes", "history"],
}


def _get(row: dict, field: str) -> str:
    low = {k.lower().strip(): v for k, v in row.items()}
    for a in _ALIASES.get(field, [field]):
        if a in low and str(low[a]).strip():
            return str(low[a]).strip()
    return ""


def _get_links(row: dict) -> list[dict]:
    out = []
    for k, v in row.items():
        kl = k.lower()
        if not v:
            continue
        if "blocks" in kl or "blocked" in kl or "depend" in kl or "link" in kl:
            ltype = "blocks" if "blocks" in kl and "blocked" not in kl else (
                "is blocked by" if "blocked" in kl else "depends on")
            for target in str(v).split("|"):
                target = target.strip()
                if target:
                    out.append({"type": ltype, "target": target})
    return out


# ---- date parsing -----------------------------------------------------------
_DATE_FORMATS = [
    "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d",
    "%d/%b/%y %I:%M %p", "%d/%b/%Y %I:%M %p", "%d/%b/%y", "%d/%b/%Y",
    "%m/%d/%Y %H:%M", "%m/%d/%Y", "%d.%m.%Y %H:%M", "%d.%m.%Y", "%d-%m-%Y",
    "%Y/%m/%d",
]


def parse_date(s: str):
    if not s:
        return None
    s = str(s).strip()
    s = s.replace("Z", "").split("+")[0].strip()
    for fmt in _DATE_FORMATS:
        try:
            return dt.datetime.strptime(s, fmt)
        except ValueError:
            continue
    try:
        return dt.datetime.fromisoformat(s)
    except Exception:
        return None


def _iso(d):
    return d.isoformat() if isinstance(d, dt.datetime) else None


# ---- status normalization ---------------------------------------------------
def canon_status(s: str) -> str:
    s = (s or "").strip().upper()
    s = config.STATUS_SYNONYMS.get(s, s)
    return s


def status_group(s: str) -> str:
    s = canon_status(s)
    if s in config.DISCOVERY_STATUSES:
        return "discovery"
    if s in config.DELIVERY_STATUSES:
        return "delivery"
    if s in config.DECLINED_STATUSES:
        return "declined"
    return "other"


# ---- status history ---------------------------------------------------------
def _parse_history(raw: str, created, resolved, current_status):
    """Return [{status, entered, exited, days}] sorted by entered.

    Accepts a JSON list in the 'Status History' column:
      [{"status": "...", "entered": "ISO", "exited": "ISO"}]
    Falls back to a minimal 2-point history from created/resolved.
    """
    events = []
    if raw:
        try:
            data = json.loads(raw)
            if isinstance(data, list):
                for e in data:
                    st = canon_status(e.get("status", ""))
                    ent = parse_date(e.get("entered") or e.get("from") or e.get("date"))
                    ext = parse_date(e.get("exited") or e.get("to"))
                    if st and ent:
                        events.append([st, ent, ext])
        except Exception:
            events = []

    if not events:
        # Minimal fallback: assume created in first discovery status, ended at resolution.
        if created:
            first = "BACKLOG"
            events.append([first, created, resolved])
        if resolved and current_status:
            events.append([canon_status(current_status), resolved, resolved])

    events.sort(key=lambda x: x[1])
    out = []
    for i, (st, ent, ext) in enumerate(events):
        end = ext
        if end is None:
            end = events[i + 1][1] if i + 1 < len(events) else (resolved or dt.datetime.now())
        days = max(0.0, (end - ent).total_seconds() / 86400.0)
        out.append({"status": st, "entered": _iso(ent), "exited": _iso(end), "days": round(days, 3)})
    return out


# ---- main -------------------------------------------------------------------
def normalize_rows(rows: list[dict], default_project: str = "") -> list[dict]:
    issues = []
    for row in rows:
        key = _get(row, "key")
        if not key:
            continue
        itype = _get(row, "type") or "Task"
        status = _get(row, "status") or "BACKLOG"
        created = parse_date(_get(row, "created"))
        resolved = parse_date(_get(row, "resolved"))
        due = parse_date(_get(row, "due"))
        sp = _get(row, "story_points")
        try:
            sp_val = float(sp) if sp else None
        except ValueError:
            sp_val = None
        is_epic = itype.strip().lower() in config.EPIC_TYPES
        project = _get(row, "project") or default_project or key.split("-")[0]
        history = _parse_history(_get(row, "history"), created, resolved, status)
        issues.append({
            "key": key,
            "project": project,
            "type": itype,
            "is_epic": is_epic,
            "status": canon_status(status),
            "status_group": status_group(status),
            "summary": _get(row, "summary"),
            "pm": _get(row, "pm") or "Unassigned",
            "reporter": _get(row, "reporter"),
            "created": _iso(created),
            "resolved": _iso(resolved),
            "due": _iso(due),
            "epic_key": _get(row, "epic_key"),
            "story_points": sp_val,
            "links": _get_links(row),
            "history": history,
        })
    return issues
