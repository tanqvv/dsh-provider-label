/**
 * dsh-provider-label — host half.
 *
 * Pure UI plugin: the browser half ships through package.json's dsh.client
 * declaration, so nothing mounts in the host process. The empty apply keeps the
 * plugin row valid in the composed cordis tree.
 */
export const name = '@qiuxy/dsh-provider-label'

/** No host-side service is required. */
export const inject = []

/** Nothing to mount. */
export function apply() {}
