import importlib.util
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from concurrent.futures import ThreadPoolExecutor

ROOT = Path(__file__).resolve().parents[1]

def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

class ObserverTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.module = load("lot_map_test", ROOT / "__init__.py")
        self.home = patch.object(self.module, "get_hermes_home", return_value=self.tmp.name)
        self.home.start()
        self.addCleanup(self.home.stop)

    def rows(self):
        return [json.loads(line) for line in self.module._event_file().read_text(encoding="utf8").splitlines()]

    def test_registration(self):
        hooks = {}
        class Context:
            def register_hook(self, name, callback): hooks[name] = callback
        self.module.register(Context())
        self.assertEqual(set(hooks), {"pre_tool_call", "post_tool_call"})

    def test_no_content_and_correlated_identifiers(self):
        m = self.module
        self.assertIsNone(m._start("terminal", args={"secret": "PRIVATE_CONTENT"}, session_id="PRIVATE_SESSION", tool_call_id="PRIVATE_CALL"))
        self.assertIsNone(m._complete("terminal", result='{"error":"PRIVATE_CONTENT"}', session_id="PRIVATE_SESSION", tool_call_id="PRIVATE_CALL", is_error=True))
        rows = self.rows()
        self.assertEqual(rows[0]["session"], rows[1]["session"])
        self.assertEqual(rows[0]["call"], rows[1]["call"])
        self.assertEqual(len(rows[0]["call"]), 24)
        self.assertTrue(rows[1]["error"])
        self.assertEqual(set(rows[1]), {"t", "kind", "tool", "session", "call", "error"})
        self.assertNotIn("PRIVATE", json.dumps(rows))

    def test_result_statuses(self):
        for value in ({"success": False}, '{"error":"secret"}', {"success": True}, 'ok', '[1,2]'):
            self.module._complete("tool", result=value)
        self.assertEqual([r["error"] for r in self.rows()], [True, True, False, False, False])
        self.module._complete("tool", status="blocked")
        self.assertTrue(self.rows()[-1]["error"])

    def test_rotation_and_thread_safety(self):
        with patch.object(self.module, "_MAX_BYTES", 1200):
            with ThreadPoolExecutor(max_workers=4) as pool:
                list(pool.map(lambda i: self.module._start("tool", tool_call_id=str(i)), range(100)))
            self.assertLess(self.module._event_file().stat().st_size, 1800)
            self.assertTrue(self.rows())

    def test_io_failure_does_not_block_tool(self):
        with patch.object(self.module, "_event_file", side_effect=OSError("readonly")):
            self.assertIsNone(self.module._start("terminal"))

    def test_profile_is_resolved_each_call(self):
        self.module._start("tool")
        second = Path(self.tmp.name) / "profile-two"
        with patch.object(self.module, "get_hermes_home", return_value=second):
            self.module._start("tool")
            self.assertTrue((second / "lot-map/events.jsonl").is_file())

if __name__ == "__main__": unittest.main()
