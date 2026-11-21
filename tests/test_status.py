import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location("lot_map_status",ROOT/"scripts/status.py")
status=importlib.util.module_from_spec(spec)
spec.loader.exec_module(status)
class StatusTests(unittest.TestCase):
 def test_empty(self):
  with tempfile.TemporaryDirectory() as home:
   data=status.snapshot(home)
   self.assertIsNone(data["quota"])
   self.assertIn("No activity",status.render(data))
 def test_corrupt_and_private(self):
  with tempfile.TemporaryDirectory() as home:
   path=Path(home)/"lot-map/events.jsonl";path.parent.mkdir()
   rows=[{"t":1,"tool":"terminal"+"x"*80+"\u001b[31m","kind":"start","session":"private","call":"x"},{"t":2000,"tool":"terminal","kind":"complete","session":"private","call":"x","error":True}]
   path.write_text("bad\nnull\n"+"\n".join(json.dumps(r) for r in rows),encoding="utf8")
   data=status.snapshot(home);self.assertEqual(data["failed"],1)
   self.assertNotIn("private",json.dumps(data));self.assertNotIn("\u001b",status.render(data))
   self.assertTrue(all(len(line)<=76 for line in status.render(data).splitlines()))
