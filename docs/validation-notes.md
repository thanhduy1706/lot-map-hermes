# Validation notes

`hermes plugins validate . --install-deps` passes on Hermes 0.23.3.

The security scanner reports **caution**, not a clean verdict:
- `invisible_unicode`: upstream `clean()` preserves U+200C/U+200D for legitimate scripts/emoji. Those literals occur in the vendored source and readable renderer bundles. Other format/control characters are removed by that function.
- `sudo_usage`: upstream classification source recognizes command wrapper names and includes explanatory examples. It does not execute commands; this port uses only the pure renderer/formatting exports.

These findings are retained and disclosed rather than suppressed. Reviewers should inspect the pinned source and reproduce validation. Version 0.2.0 adds native account-limit RPCs (Hermes may contact the provider) and an explicit opt-in fixed quota-cache CLI RPC. No direct credential reads, arbitrary shell commands, core overrides, injected scripts or self-updating code are used. Quota routes are exact connection/profile matches and results are isolated by session as well. Native text is not parsed into invented percentages.

New settings and provider mapping use validated data, bounded provider IDs and exact connection/profile/session metadata queries. TUI settings only write the selected profile’s plugin data; the classic status command is read-only. Clock updates reuse stable SVG markup; activity changes redraw.

The feature UI was also mounted with real React in an isolated browser and a synthetic SDK: settings/manual theme, collapsed quota, SMIL off, and SVG DOM identity across clock ticks were exercised. The terminal card was rendered with the actual Hermes Ink renderer in scratch, with a minimal border wrapper; this is not a full live TUI shell hot-load test.

Tests cover mocked Desktop SDK behavior and a real Python plugin loader in an isolated home; they do not certify every live Desktop/TUI platform or gateway combination.
