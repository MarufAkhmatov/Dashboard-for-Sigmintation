"""Central configuration for the Portfolio Intelligence Platform backend."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
STORAGE = ROOT / "storage"
UPLOADS = STORAGE / "uploads"
CURRENT = STORAGE / "current"
ARCHIVE = STORAGE / "archive"
TEMP = STORAGE / "temp"
EXPORTS = STORAGE / "exports"
LOGS = ROOT / "logs"

for d in (UPLOADS, CURRENT, ARCHIVE, TEMP, EXPORTS, LOGS):
    d.mkdir(parents=True, exist_ok=True)

# Portfolio = Epic; work items = Task / New Feature
EPIC_TYPES = {"epic"}
WORK_TYPES = {"task", "new feature", "story", "bug", "sub-task"}

# Status taxonomy (normalized, upper-cased)
DISCOVERY_STATUSES = {"VALIDATION", "BACKLOG", "ANALYSIS", "ARCHITECTURE REVIEW", "INITIATION"}
DELIVERY_STATUSES = {"IN PROGRESS", "TESTING", "PILOT IO", "DONE"}
DONE_STATUSES = {"DONE", "CLOSED", "RESOLVED", "COMPLETED"}
DECLINED_STATUSES = {"DECLINED", "REJECTED", "CANCELLED", "CANCELED", "WONT DO", "WON'T DO"}

# Synonym map -> canonical status
STATUS_SYNONYMS = {
    "TO DO": "BACKLOG", "TODO": "BACKLOG", "OPEN": "BACKLOG", "NEW": "BACKLOG",
    "IN ANALYSIS": "ANALYSIS", "WAITING FOR ANALYSIS": "ANALYSIS",
    "WAITING FOR VALIDATION": "VALIDATION", "IN VALIDATION": "VALIDATION",
    "ARCH REVIEW": "ARCHITECTURE REVIEW", "WAITING FOR ARCHITECTURE REVIEW": "ARCHITECTURE REVIEW",
    "WAITING FOR INITIATION": "INITIATION", "INITIATED": "INITIATION",
    "IN DEVELOPMENT": "IN PROGRESS", "DEVELOPMENT": "IN PROGRESS", "DEV": "IN PROGRESS",
    "IN TESTING": "TESTING", "QA": "TESTING", "TEST": "TESTING",
    "PILOT": "PILOT IO", "PILOT I/O": "PILOT IO", "PILOT-IO": "PILOT IO",
    "DONE ": "DONE", "RESOLVED": "DONE", "CLOSED": "DONE", "COMPLETED": "DONE",
}

# AI / ARIA
ARIA_PROVIDER = "ollama"        # ollama | llama | qwen | deepseek
ARIA_MODEL = "llama3.1"
OLLAMA_URL = "http://localhost:11434"
