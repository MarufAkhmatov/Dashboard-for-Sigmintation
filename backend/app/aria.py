"""ARIA — local Portfolio AI agent.

Grounds answers in the computed portfolio analytics (the active dataset).
Uses Ollama if available; otherwise a deterministic rule-based fallback so the
assistant always works offline. Provider is configurable (Ollama/Llama/Qwen/DeepSeek).
"""
import json
import urllib.request
from . import config


def _ollama(prompt: str) -> str | None:
    try:
        req = urllib.request.Request(
            f"{config.OLLAMA_URL}/api/generate",
            data=json.dumps({"model": config.ARIA_MODEL, "prompt": prompt, "stream": False}).encode(),
            headers={"Content-Type": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=5) as r:
            return json.loads(r.read()).get("response", "").strip()
    except Exception:
        return None


def _context(analytics: dict, kpis: dict) -> str:
    board = analytics["pm_leaderboard"]
    health = analytics["project_health"]
    blockers = analytics["blockers"]
    ttm = analytics["ttm"]["overall"]
    lines = [
        f"Total projects: {kpis['total_portfolio_projects']}, completed: {kpis['completed_projects']}, "
        f"open: {kpis['open_projects']}, declined: {kpis['declined_projects']} "
        f"(completion {kpis['completion_pct']}%).",
        f"Average total TTM: {ttm['avg']} days (median {ttm['median']}, p90 {ttm['p90']}).",
        f"Average lead time: {analytics['lead_time']['avg']} days.",
        f"Portfolio flow efficiency: {analytics['flow']['portfolio_average']}%.",
        f"Blocked items: {blockers['total_blocked']}.",
    ]
    if board:
        lines.append("Top PM: " + ", ".join(
            f"{b['pm']} (score {b['pm_score']}, {b['projects_completed']} done)" for b in board[:3]))
    if health:
        worst = sorted(health, key=lambda h: h["score"])[:3]
        lines.append("Highest-risk projects: " + ", ".join(
            f"{h['key']} ({h['category']} {h['score']})" for h in worst))
    return "\n".join(lines)


def _rule_based(q: str, analytics: dict, kpis: dict) -> str:
    ql = q.lower()
    board = analytics["pm_leaderboard"]
    health = analytics["project_health"]
    blockers = analytics["blockers"]
    noms = analytics["pm_nominations"]

    if "risk" in ql or "highest risk" in ql:
        worst = sorted(health, key=lambda h: h["score"])[:3]
        if worst:
            return "Highest-risk projects: " + "; ".join(
                f"{h['key']} — {h['summary'] or ''} ({h['category']}, score {h['score']}, "
                f"{h['blocked']} blockers, {h['overdue_children']} overdue)" for h in worst)
    if "best" in ql and ("pm" in ql or "manager" in ql or "perform" in ql):
        if board:
            b = board[0]
            return (f"Best performing PM: {b['pm']} (score {b['pm_score']}, "
                    f"{b['projects_completed']} projects completed, success {b['success_rate']}%, "
                    f"avg TTM {b['avg_ttm']}d).")
    if "ttm" in ql and ("increas" in ql or "why" in ql or "rising" in ql):
        tr = analytics["ttm"]["trend"]
        if len(tr) >= 2:
            return (f"TTM trend: {tr[-2]['period']}={tr[-2]['avg_ttm']}d -> "
                    f"{tr[-1]['period']}={tr[-1]['avg_ttm']}d. Main drivers are time spent in "
                    f"Discovery statuses and blocked dependencies "
                    f"({blockers['total_blocked']} blocked items).")
    if "block" in ql:
        bp = blockers["blocked_projects"][:5]
        if bp:
            return "Blocked projects: " + "; ".join(
                f"{p['key']} (blocked by {', '.join(p['blocked_by'])}, risk {p['risk']})" for p in bp)
        return "No blocked projects detected in the active dataset."
    if "focus" in ql or "management" in ql or "quarter" in ql:
        worst = sorted(health, key=lambda h: h["score"])[:3]
        return ("Management focus this quarter: clear blockers on "
                + ", ".join(h["key"] for h in worst)
                + f"; completion is {kpis['completion_pct']}% with {kpis['open_projects']} open projects.")
    if "fastest" in ql or "lead time" in ql:
        return f"Fastest delivery manager: {noms.get('fastest_delivery_manager', 'n/a')}. Portfolio avg lead time {analytics['lead_time']['avg']}d."
    # default summary
    return (f"Portfolio has {kpis['total_portfolio_projects']} projects, "
            f"{kpis['completion_pct']}% completed, avg TTM {analytics['ttm']['overall']['avg']}d, "
            f"flow efficiency {analytics['flow']['portfolio_average']}%, "
            f"{blockers['total_blocked']} blocked items.")


def ask(question: str, payload: dict) -> dict:
    analytics = payload["analytics"]
    kpis = payload["kpis"]
    ctx = _context(analytics, kpis)
    prompt = (
        "You are ARIA, an enterprise Portfolio Intelligence assistant. Answer the user's "
        "question using ONLY the portfolio facts below. Be concise and specific.\n\n"
        f"PORTFOLIO FACTS:\n{ctx}\n\nQUESTION: {question}\n\nANSWER:"
    )
    answer = _ollama(prompt)
    source = "ollama"
    if not answer:
        answer = _rule_based(question, analytics, kpis)
        source = "rule_based"
    return {"answer": answer, "source": source, "grounded_on": "active_dataset"}
