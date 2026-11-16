# dsh-provider-label

Show **which provider a model comes from** in the DeepSeek Harness composer model chip:

    collapsed: [icon] OpenCode Go · DeepSeek V4.1 Flash  High ⌄

## Why not a slot plugin

The official `conversation.input.model.label` seat is a **single** slot — the first
registration wins. When another plugin (e.g. `dsh-connect-workbuddy`) registers it first, a
later registration lands in `entriesOfSlot` but never renders.

This plugin does **not** register the slot. It reads the `data-provider-id` attribute the host
already puts on the label wrapper and prepends "Provider · " with one scoped `::before` rule:

- works no matter who owns the label slot;
- inserts no DOM nodes — React reconciliation is untouched;
- degrades silently when a future host drops the attribute (no errors, no broken UI);
- skips labels that already show a provider, so it never duplicates.

## Install

From npm (after release):

```sh
dsh plugin --profile web add @qiuxy/dsh-provider-label
```

From GitHub source (works before the npm release):

```sh
dsh plugin --profile web add github:tanqvv/dsh-provider-label
```

From a local tarball:

```sh
dsh plugin --profile web add file:/absolute/path/qiuxy-dsh-provider-label-1.0.2.tgz
```

After installing, make sure `"@qiuxy/dsh-provider-label"` is listed in the profile's
`dsh.profile.bundles` (the GUI plugin manager does this for you; with the CLI add it manually
if missing), then restart the host.

Then reload the host (desktop: Ctrl+R; `dsh web`: restart the process).

## Display names

Built-in DeepSeek account → `DeepSeek 账号`, DeepSeek official API → `DeepSeek 官方`,
Opencode Go → `OpenCode Go`; any other provider shows its id. Extend `DISPLAY_NAMES` in
`lib/client.js`.

## License

MIT
