# Lot Map for Hermes

An independent community port of [alexeyw/lot-map](https://github.com/alexeyw/lot-map) to Hermes Agent. Original SVG and braille renderers; Hermes-native events. Not affiliated with or endorsed by Nous Research or the upstream author.

![Synthetic demonstration, not a real conversation](docs/preview.png)

## Features
- Desktop side pane, full-page map, sidebar navigation and **Open Lot Map** command.
- Original circular stations, tool paths, motion, error markers and recent activity.
- Light/dark palette saved locally; respects reduced-motion preference.
- Optional original braille TUI widget, with a passive profile-local event observer.

## Status and requirements
Community preview **0.1.0**. Requires Hermes **0.23.3 or later** with the Desktop Plugin SDK; the optional widget requires the Ink TUI widget SDK. Python runtime uses only the standard library. No npm install or build step for users.

The original upstream plugin targets Claude Code. This port does **not** reproduce Claude hooks, all upstream options, per-station token accounting or terminal image protocols. Desktop starts collecting on load and follows the focused runtime session. TUI shows the latest session in its profile's local event file, not necessarily the focused Desktop chat. A tool blocked before execution may show an unmatched start if Hermes does not emit completion.

## Install
This project is **not listed in the Hermes catalog yet**. Install from the public community repository:

```sh
hermes plugins install thanhduy1706/lot-map-hermes --enable
```

Review the source and scanner disclosures before confirming installation. For reproducible installations, use `--ref` with the reviewed full commit SHA. In Desktop, enable **Lot Map for Hermes** under **Capabilities → Plugins** as well (the packaged Desktop surface is opt-in). Do not install a second standalone Desktop copy of the same plugin ID. Existing local prototypes must be backed up and removed deliberately before migration; this project never replaces them automatically.

### Optional TUI widget
From the installed plugin directory:

```sh
python scripts/install-tui.py
```

Set `HERMES_HOME` or pass `--home /path/to/profile` to target a named profile. Restart the TUI after copying; open/toggle using `/lot-map`. Existing different widgets are refused by default; `--force` creates a content-addressed backup first. Rerun after updating the package to refresh this separately copied widget.

### Uninstall
From the plugin checkout, remove the widget **before** removing the package:

```sh
python scripts/install-tui.py --remove
hermes plugins remove lot-map
```

The widget remover refuses to delete files without this package's ownership marker. Runtime event data under `<HERMES_HOME>/lot-map/` is retained; remove that directory manually if no longer wanted. Disable the agent plugin to stop new event recording; disable its Desktop surface to stop the view.

## Privacy and behavior disclosure
- No telemetry, outbound network calls, subprocesses, credential access or self-updater at runtime.
- Desktop subscribes only through the public SDK; transient tool names/timing/status and runtime session IDs stay in renderer memory (up to 24 sessions, 80 recent rows each). It displays the host's current model and context percentage when available. Theme choice is stored in plugin-scoped storage.
- The Python observer receives hook arguments/results from Hermes, but never persists their contents. It inspects structural result markers for failures; arguments are ignored.
- TUI metadata is stored at `<HERMES_HOME>/lot-map/events.jsonl`: timestamp, tool name, lifecycle kind, failure flag, and truncated SHA-256 session/call identifiers. Hashes are correlation IDs, **not** a guarantee of anonymity. Rotation keeps approximately 512 KB (it can exceed that by one row). Retention is size-based, not age-based.
- The TUI reads only that file, polling once a second. No prompts, commands, file paths, URLs, raw tool arguments/results or credentials are intentionally stored. Tool names themselves can reveal which integrations you use. Do not share your event file.
- The explicit widget installer writes to `tui-widgets/` in the selected profile. `--force` also writes a backup beside the widget. No installer changes core code or configuration directly.
- Observer I/O failures are ignored so visualization does not change tool arguments, results or approvals. File rotation is thread-safe within one process; multiple independent gateways sharing a profile are not a supported configuration.

## Development and verification
```sh
python scripts/build.py
node --check desktop/plugin.js
node --check tui/lot-map.mjs
node tests/smoke.mjs
python -m unittest discover -s tests -p 'test_*.py'
hermes plugins validate . --install-deps
```
The build is offline and combines readable renderer bundles with adapters. See [NOTICE.md](NOTICE.md) for source provenance and renderer regeneration. Tests use synthetic events, temporary profile directories and mocked SDKs; they are not a claim of live cross-platform UI certification. The README image is generated from synthetic data and explicitly labelled.

## License
MIT. Upstream copyright and license retained in [LICENSE.upstream](LICENSE.upstream); attribution and pinned source in [NOTICE.md](NOTICE.md).
