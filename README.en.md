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

```sh
dsh plugin --profile web add @qiuxy/dsh-provider-label
```

Then reload the host (desktop: Ctrl+R; `dsh web`: restart the process).

## Display names

Built-in DeepSeek account → `DeepSeek 账号`, DeepSeek official API → `DeepSeek 官方`,
Opencode Go → `OpenCode Go`; any other provider shows its id. Extend `DISPLAY_NAMES` in
`lib/client.js`.

## License

MIT
