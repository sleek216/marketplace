/**
 * Avoid Next.js 15 invariant: "attempted to hard navigate to the same URL".
 * Only push when the target path differs from the current pathname.
 */
export const safeRouterPush = (router, href, as, options) => {
  if (!router) return Promise.resolve(false);

  const target =
    typeof href === "string"
      ? href.split("?")[0].split("#")[0]
      : href?.pathname;

  if (!target) {
    return router.push(href, as, options);
  }

  const current = (router.pathname || "").split("?")[0].split("#")[0];
  if (current === target) {
    return Promise.resolve(false);
  }

  return router.push(href, as, options);
};
