"""Explicit TUI widget install/remove; never overwrites unrelated widgets."""
import argparse
import hashlib
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MARKER = "// Lot Map for Hermes community widget; see NOTICE.md.\n"

def default_home():
    if os.environ.get("HERMES_HOME"):
        return Path(os.environ["HERMES_HOME"])
    if os.name == "nt":
        return Path(os.environ.get("LOCALAPPDATA", Path.home() / "AppData" / "Local")) / "hermes"
    return Path.home() / ".hermes"

def install(home, remove=False, force=False):
    target = Path(home) / "tui-widgets" / "lot-map.mjs"
    source = ROOT / "tui" / "lot-map.mjs"
    content = MARKER + source.read_text(encoding="utf-8")
    if target.exists():
        previous = target.read_text(encoding="utf-8")
        if remove:
            if not previous.startswith(MARKER):
                raise ValueError("Refusing to remove an unowned widget")
            target.unlink()
            return "removed", target
        if previous == content:
            return "unchanged", target
        if not force:
            raise ValueError("Widget exists; inspect it before passing --force")
        backup = target.with_name(target.name + "." + hashlib.sha256(previous.encode()).hexdigest()[:12] + ".bak")
        if not backup.exists():
            backup.write_text(previous, encoding="utf-8")
    elif remove:
        return "absent", target
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding="utf-8", newline="\n")
    return "installed", target

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--home", type=Path, default=default_home(), help="Explicit Hermes profile home")
    parser.add_argument("--remove", action="store_true")
    parser.add_argument("--force", action="store_true", help="Back up and replace an existing widget")
    args = parser.parse_args()
    try:
        action, target = install(args.home, args.remove, args.force)
    except (OSError, ValueError) as exc:
        parser.exit(1, str(exc) + "\n")
    print(f"{action}: {target}")
