export const instantScrollToTop = () => {
  if (typeof window === "undefined") return;
  const hasHash = Boolean(window.location.hash);
  if (hasHash) return;
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

export const disableBrowserScrollRestoration = () => {
  if (typeof window === "undefined") return;
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
};
