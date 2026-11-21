# Validation notes

`hermes plugins validate . --install-deps` passes on Hermes 0.23.3.

The security scanner reports **caution**, not a clean verdict:
- `invisible_unicode`: upstream `clean()` preserves U+200C/U+200D for legitimate scripts/emoji. Those literals occur in the vendored source and readable renderer bundles. Other format/control characters are removed by that function.
- `sudo_usage`: upstream classification source recognizes command wrapper names and includes explanatory examples. It does not execute commands; this port uses only the pure renderer/formatting exports.

These findings are retained and disclosed rather than suppressed. Reviewers should inspect the pinned source and reproduce validation. No plugin runtime network calls, shell commands, credential reads, core overrides, injected scripts or self-updating code are used.

Tests cover mocked Desktop SDK behavior and a real Python plugin loader in an isolated home; they do not certify every live Desktop/TUI platform or gateway combination.
