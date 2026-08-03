/**
 * Normalizes Next/webpack static imports and plain URL strings for <img src>.
 * Passing a module object through to the DOM produces requests to "/[object Object]".
 */
export const resolveImageSrc = (value) => {
  if (value == null || value === false) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    if (typeof value.src === "string") return value.src;
    if (typeof value.url === "string") return value.url;
    if (typeof value.href === "string") return value.href;
    if (typeof value.default === "string") return value.default;
    if (value.default && typeof value.default.src === "string") {
      return value.default.src;
    }
    if (value.default && typeof value.default.url === "string") {
      return value.default.url;
    }
  }
  return null;
};
