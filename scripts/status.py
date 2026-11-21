"""Read-only Lot Map metadata snapshot for the classic CLI (not an interactive UI)."""
import argparse
import json
import os
from pathlib import Path
import time
import re
import math

def snapshot(home):
    path = Path(home) / "lot-map/events.jsonl"
    events = []
    try:
        with path.open("rb") as stream:
            size = path.stat().st_size
            if size > 512000:
                stream.seek(size - 512000)
                stream.readline()
            lines = stream.read(512000).decode("utf-8", errors="replace").splitlines()[-300:]
    except OSError:
        lines = []
    for line in lines:
        try:
            row = json.loads(line)
            if isinstance(row, dict) and row.get("kind") in ("start", "complete") and isinstance(row.get("tool"), str) and isinstance(row.get("t"), (int, float)) and not isinstance(row["t"], bool) and math.isfinite(row["t"]):
                events.append(row)
        except (ValueError, TypeError):
            continue
    session = events[-1].get("session") if events else None
    active, complete = {}, []
    for event in events:
        if event.get("session") != session:
            continue
        key = event.get("call") if isinstance(event.get("call"), str) else event["tool"]
        if event["kind"] == "start":
            active[key] = event
        elif key in active:
            start = active.pop(key)
            complete.append({"tool": start["tool"], "status": "error" if event.get("error") else "ok", "elapsed_ms": max(0, event["t"] - start["t"])})
    now = time.time() * 1000
    rows = complete[-8:] + [{"tool": value["tool"], "status": "unmatched/running", "elapsed_ms": max(0, now - value["t"])} for value in list(active.values())[-8:]]
    return {"quota": None, "quota_status": "unavailable", "completed": len(complete), "failed": sum(r["status"] == "error" for r in complete), "unmatched": len(active), "rows": rows[-8:]}

def render(data, width=76):
    def clean(value):
        return re.sub(r"[^ -~]", "?", str(value))
    lines = ["LOT MAP | local metadata snapshot", f"Completed {data['completed']} | Failed {data['failed']} | Unmatched {data['unmatched']}", "Quota: unavailable (not inferred from tool calls)", "STATUS               TOOL                              TIME"]
    for row in data["rows"]:
        lines.append(f"{clean(row['status']):20.20} {clean(row['tool']):32.32} {row['elapsed_ms']/1000:8.1f}s")
    if not data["rows"]:
        lines.append("No activity recorded.")
    return "\n".join(line[:width] for line in lines)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    default = os.environ.get("HERMES_HOME") or (str(Path(os.environ.get("LOCALAPPDATA", Path.home()/"AppData/Local"))/"hermes") if os.name == "nt" else str(Path.home()/".hermes"))
    parser.add_argument("--home", default=default, type=Path)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    data = snapshot(args.home)
    print(json.dumps(data, ensure_ascii=True) if args.json else render(data))
