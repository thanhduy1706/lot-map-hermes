import hashlib
import importlib.util
import os
import re
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]

def installer():
    spec = importlib.util.spec_from_file_location("widget_install", ROOT / "scripts/install-tui.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

class PackageTests(unittest.TestCase):
    def test_required_files_and_attribution(self):
        for file in ["plugin.yaml", "__init__.py", "desktop/plugin.js", "tui/lot-map.mjs", "LICENSE", "LICENSE.upstream", "NOTICE.md", "README.md"]:
            self.assertTrue((ROOT / file).is_file(), file)
        self.assertIn("Aleksei Volodin", (ROOT / "LICENSE.upstream").read_text())
        self.assertIn("5c5833d7380976fda671975d32fcec9c1bc3ef79", (ROOT / "NOTICE.md").read_text())

    def test_no_private_paths_or_credentials_in_distribution(self):
        forbidden = [b"PRIVATE_CONTENT", b"ghp_", b"gho_"]
        for folder in ["desktop", "tui", "src", "vendor"]:
            for file in (ROOT / folder).rglob("*"):
                if file.is_file():
                    data = file.read_bytes()
                    for token in forbidden:
                        self.assertNotIn(token, data, str(file.relative_to(ROOT)))
                    self.assertIsNone(re.search(rb"[A-Za-z]:[/\\]+Users[/\\]+", data), str(file.relative_to(ROOT)))

    def test_build_is_reproducible(self):
        files = [ROOT / "desktop/plugin.js", ROOT / "tui/lot-map.mjs"]
        before = [hashlib.sha256(p.read_bytes()).hexdigest() for p in files]
        subprocess.run([sys.executable, str(ROOT / "scripts/build.py")], check=True, capture_output=True)
        self.assertEqual(before, [hashlib.sha256(p.read_bytes()).hexdigest() for p in files])

    def test_widget_install_idempotent_remove_and_conflict(self):
        m = installer()
        with tempfile.TemporaryDirectory() as d:
            self.assertEqual(m.install(d)[0], "installed")
            self.assertEqual(m.install(d)[0], "unchanged")
            target = Path(d) / "tui-widgets/lot-map.mjs"
            self.assertEqual(m.install(d, remove=True)[0], "removed")
            target.write_text("unrelated", encoding="utf8")
            with self.assertRaises(ValueError): m.install(d)
            with self.assertRaises(ValueError): m.install(d, remove=True)
            m.install(d, force=True)
            self.assertEqual(len(list(target.parent.glob("*.bak"))), 1)
            self.assertEqual(m.install(d, remove=True)[0], "removed")

    def test_explicit_profile_home(self):
        m = installer()
        with patch.dict(os.environ, {"HERMES_HOME": "profile-test"}):
            self.assertEqual(m.default_home(), Path("profile-test"))

if __name__ == "__main__": unittest.main()
