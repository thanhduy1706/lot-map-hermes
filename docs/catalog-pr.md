# Proposed catalog submission (not submitted)

## Summary
Add Lot Map, an independent community Hermes port of alexeyw/lot-map, using the original MIT SVG and braille renderers. Desktop side pane/page/nav and optional TUI widget. Not official Nous software; no claim of full upstream parity.

## Surfaces and disclosure
- Python hooks: pre_tool_call, post_tool_call. No tools, middleware or required secrets.
- Desktop: public SDK atoms, gateway events, pane, route, sidebar nav, palette, scoped theme storage; unload removes subscriptions and clears transient state.
- Optional installer copies the TUI widget to the explicitly selected profile and backs up an existing widget only with --force.
- Observer writes bounded local metadata (names, times, lifecycle, status and hashed correlation identifiers) under the active Hermes home. Arguments/results/prompts/credentials are not persisted.
- No runtime third-party network, subprocesses, credentials, core overrides, self-updates or telemetry.
- Scanner caution is disclosed in docs/validation-notes.md: upstream Unicode-aware sanitizer and command-wrapper recognition source. No command execution.
- Screenshot docs/preview.png is explicitly synthetic, with no real chat/session content.

## Verification before opening
- Replace all repository/owner/SHA placeholders in the catalog entry with real, verified public values.
- Ensure plugin-catalog/lot-map.yaml is not already listed and no competing lineage exists.
- Run build, Node smoke tests, Python unittest and hermes plugins validate . --install-deps at the exact commit to pin.
- Add only plugin-catalog/lot-map.yaml to the Hermes catalog PR. Use community tier and full 40-character SHA, version 0.1.0, category desktop, requires_hermes >=0.23.3.
- Capabilities: provides_tools [], provides_hooks [pre_tool_call, post_tool_call], provides_middleware [], requires_env [].
- Set maintainer to the authenticated repository owner, and screenshot to the immutable raw URL at that SHA.

Public repo creation, Git commits/push and catalog PR are pending authenticated account confirmation and permission to commit the reviewed source. Nothing in this file is a submitted listing or a valid installation URL.
