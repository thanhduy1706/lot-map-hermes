"""Passive, profile-local Lot Map metadata observer; never stores tool content."""
import hashlib
import json
import os
import threading
import time
from pathlib import Path
from hermes_constants import get_hermes_home

_LOCK = threading.RLock()
_MAX_BYTES = 512_000

def _event_file():
    return Path(get_hermes_home()) / "lot-map" / "events.jsonl"

def _opaque(value):
    return hashlib.sha256(str(value or "").encode("utf-8")).hexdigest()[:24]

def _record(kind, tool_name, task_id=None, **metadata):
    try:
        row = {"t": round(time.time() * 1000), "kind": kind,
               "tool": str(tool_name or "tool")[:80],
               "session": _opaque(metadata.get("session_id") or task_id),
               "call": _opaque(metadata.get("tool_call_id") or tool_name)}
        if kind == "complete":
            row["error"] = bool(metadata.get("is_error", False))
        data = (json.dumps(row, ensure_ascii=False) + "\n").encode("utf-8")
        path = _event_file()
        with _LOCK:
            path.parent.mkdir(parents=True, exist_ok=True)
            if path.exists() and path.stat().st_size > _MAX_BYTES:
                with path.open("rb") as stream:
                    stream.seek(-min(path.stat().st_size, _MAX_BYTES // 2), os.SEEK_END)
                    tail = stream.read().split(b"\n", 1)[-1]
                path.write_bytes(tail)
            with path.open("ab") as stream:
                stream.write(data)
    except Exception:
        # Observability must not alter approvals, arguments, results or execution.
        return None
    return None

def _start(tool_name=None, task_id=None, **kwargs):
    _record("start", tool_name, task_id, **kwargs)

def _complete(tool_name=None, result=None, task_id=None, **kwargs):
    status = str(kwargs.get("status") or "").lower()
    failed = bool(kwargs.get("is_error")) or status in {"error", "failed", "blocked", "cancelled"}
    payload = result if isinstance(result, dict) else None
    if isinstance(result, str) and len(result) <= 1_000_000 and result.lstrip().startswith("{"):
        try:
            payload = json.loads(result)
        except (ValueError, TypeError):
            pass
    if isinstance(payload, dict):
        failed = failed or payload.get("success") is False or payload.get("error") is not None
    metadata = {key: kwargs[key] for key in ("session_id", "tool_call_id") if key in kwargs}
    _record("complete", tool_name, task_id, is_error=failed, **metadata)

def register(ctx):
    ctx.register_hook("pre_tool_call", _start)
    ctx.register_hook("post_tool_call", _complete)
