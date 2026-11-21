"""Assemble reviewable bundles without downloading or executing dependencies."""
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
HEADER = "// Renderer from alexeyw/lot-map v0.13.0 (MIT); see LICENSE.upstream and NOTICE.md.\n"

def assemble(adapter, renderer, target):
    source = (ROOT / adapter).read_text(encoding="utf-8")
    lines = source.splitlines()
    imports = [line for line in lines if line.startswith("import ")]
    body = "\n".join(line for line in lines if not line.startswith("import "))
    content = "\n".join(imports) + "\n\n" + HEADER + (ROOT / renderer).read_text(encoding="utf-8") + "\n" + body + "\n"
    output = ROOT / target
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(content, encoding="utf-8", newline="\n")
    print(target)

if __name__ == "__main__":
    assemble("src/desktop-adapter.js", "src/svg-renderer.js", "desktop/plugin.js")
    assemble("src/tui-adapter.mjs", "src/braille-renderer.js", "tui/lot-map.mjs")
