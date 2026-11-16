/**
 * dsh-provider-label — browser half.
 *
 * Shows which provider a model comes from in the composer's model chip.
 *
 * Why CSS instead of the official slot: \`conversation.input.model.label\` is a
 * single-seat slot. Any other plugin that registered it first wins, and a later
 * registration never renders. This plugin therefore does not compete for the
 * slot at all: it reads the stable \`data-provider-id\` attribute the host already
 * puts on the label wrapper and prepends "Provider · " with a scoped ::before
 * rule. No DOM nodes are inserted, so React reconciliation is never disturbed,
 * and the feature survives both other plugins owning the slot and future host
 * versions (a missing attribute simply renders nothing).
 */
window.__ModuleLoader__.load({
  id: '@qiuxy/dsh-provider-label',
  factory: (require) => {
    const module = { exports: {} }
    const exports = module.exports

    const STYLE_ID = 'dsh-provider-label-style'
    const SCOPE = 'button[aria-haspopup="menu"]'
    // Display names for well-known providers; anything else falls back to its id.
    const DISPLAY_NAMES = {
      'deepseek-account': 'DeepSeek 账号',
      deepseek: 'DeepSeek 官方',
      'opencode-go': 'OpenCode Go',
    }

    let observer = null
    let scheduled = false
    let disposed = false
    let renderedIds = ''

    const escapeCss = (value) => String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
    const escapeContent = (value) => String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')

    function displayName(id) {
      return DISPLAY_NAMES[id] || id
    }

    /** True when the trigger already shows this provider (another label plugin). */
    function alreadyLabelled(el, id) {
      const label = el.parentElement
      if (label === null) return false
      const text = label.textContent || ''
      return text.indexOf(id) !== -1 || text.indexOf(displayName(id)) !== -1
    }

    function collectIds() {
      const ids = new Set()
      if (typeof document === 'undefined') return ids
      const nodes = document.querySelectorAll(SCOPE + ' [data-provider-id]')
      for (const el of nodes) {
        const id = el.getAttribute('data-provider-id')
        if (id && !alreadyLabelled(el, id)) ids.add(id)
      }
      return ids
    }

    function rulesFor(ids) {
      const lines = []
      for (const id of ids) {
        lines.push(SCOPE + ' [data-provider-id="' + escapeCss(id) + '"]::before{'
          + 'content:"' + escapeContent(displayName(id)) + ' · ";'
          + 'color:var(--dsw-alias-label-caption);'
          + 'white-space:pre;'
          + '}'
        )
      }
      return lines.join('\n')
    }

    function ensureStyle() {
      if (disposed) return
      if (typeof document === 'undefined' || document.head === null) return
      const ids = collectIds()
      const key = [...ids].sort().join('\u0000')
      if (key === renderedIds) return
      renderedIds = key
      let style = document.getElementById(STYLE_ID)
      if (style === null) {
        style = document.createElement('style')
        style.id = STYLE_ID
        style.dataset.plugin = 'dsh-provider-label'
        document.head.appendChild(style)
      }
      style.textContent = ids.size === 0 ? '' : rulesFor(ids)
    }

    function schedule() {
      if (scheduled) return
      scheduled = true
      const run = () => { scheduled = false; if (disposed) return; try { ensureStyle() } catch (error) { console.warn('[dsh-provider-label]', error) } }
      if (typeof requestAnimationFrame === 'function') requestAnimationFrame(run)
      else setTimeout(run, 16)
    }

    function dispose() {
      disposed = true
      if (observer !== null) { observer.disconnect(); observer = null }
      if (typeof document !== 'undefined') {
        const style = document.getElementById(STYLE_ID)
        if (style !== null) style.remove()
      }
      renderedIds = ''
    }

    function apply(ctx) {
      if (typeof document === 'undefined' || typeof MutationObserver !== 'function') return
      disposed = false
      ensureStyle()
      observer = new MutationObserver(schedule)
      observer.observe(document.body, { childList: true, subtree: true, characterData: true })
      if (ctx !== undefined && ctx !== null && typeof ctx.effect === 'function') {
        ctx.effect(() => dispose, 'dsh-provider-label: style')
      }
    }

    exports.inject = []
    exports.apply = apply
    exports.name = '@qiuxy/dsh-provider-label'
    // Exported for the bundled test harness; harmless in the host.
    exports.__test = { ensureStyle, dispose, displayName }
    return module.exports
  },
})
