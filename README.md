# dsh-provider-label

在 DeepSeek Harness 输入框的模型按钮上显示**当前模型来自哪个供应商**：

    收起态：[图标] OpenCode Go · DeepSeek V4.1 Flash  High ⌄

## 为什么需要它

同一个模型 id 常常由多个 provider 提供（DeepSeek 官方账号、Opencode Go、各家中转）。
收起态只显示模型名时，你无法判断这条请求实际走的是哪条链路。

## 与同类插件的区别：不抢 slot

官方 slot `conversation.input.model.label` 是 **single 槽**——谁先注册谁生效。本机实测
`dsh-connect-workbuddy` 抢先注册后，其它插件再注册虽然能进 `entriesOfSlot`，渲染出口
始终取不到，标签不会出现。

本插件**完全不注册 slot**：它读取宿主本来就写在标签容器上的
`data-provider-id` 属性，用一条作用域内的 `::before` 规则把「供应商 · 」补在前面。
因此：

- 无论 slot 被哪个插件占用都有效；
- 不插入任何 DOM 节点，不干扰 React 渲染；
- 宿主版本变化时属性还在就继续生效，属性没了就安静地什么都不做（不会报错、不会破坏界面）；
- 已经在显示供应商的标签（比如另一个标签插件或槽位贡献者）会自动跳过，不重复贴。

## 安装

npm（发布后）：

```sh
dsh plugin --profile web add @qiuxy/dsh-provider-label
# 或桌面端 profile
dsh plugin --profile desktop add @qiuxy/dsh-provider-label
```

从 GitHub 源码安装（不必等 npm）：

```sh
dsh plugin --profile web add github:tanqvv/dsh-provider-label
```

离线压缩包：

```sh
dsh plugin --profile web add file:/absolute/path/qiuxy-dsh-provider-label-1.0.2.tgz
```

安装后确认 profile 的 `package.json` → `dsh.profile.bundles` 里有 `"@qiuxy/dsh-provider-label"`
（GUI 插件管理器会自动加；CLI 装的话没有就手动补一行，然后重启宿主）。

装完重启/刷新宿主（桌面端 Ctrl+R，`dsh web` 重启进程）即可看到效果。

本地开发：

```sh
dsh plugin --profile web add link:/absolute/path/to/dsh-provider-label
```

## 显示规则

- 内置 DeepSeek 账号 → `DeepSeek 账号`
- 内置 DeepSeek 官方接口 → `DeepSeek 官方`
- Opencode Go → `OpenCode Go`
- 其它 provider → 直接显示 provider id（如 `workbuddy`、`my-relay`）

想增加映射可以改 `lib/client.js` 里的 `DISPLAY_NAMES`。

## 兼容性

- DSH 0.2.x（Web / 桌面端 / VS Code 宿主同源）；
- 与任何 provider、模型列表插件共存；
- 菜单展开后的列表项保持原样（那里本来就按 provider 分组）。

## 卸载

```sh
dsh plugin --profile web remove @qiuxy/dsh-provider-label
```
