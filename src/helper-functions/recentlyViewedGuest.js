export const RECENTLY_VIEWED_GUEST_KEY = "recently_viewed_guest_history";
export const RECENTLY_VIEWED_MAX_ITEMS = 30;
export const RECENTLY_VIEWED_UPDATED_EVENT = "recently-viewed-updated";

const canUseWindow = () => typeof window !== "undefined";

export const getGuestRecentlyViewed = () => {
  if (!canUseWindow()) return [];
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_GUEST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

export const setGuestRecentlyViewed = (records) => {
  if (!canUseWindow()) return;
  localStorage.setItem(RECENTLY_VIEWED_GUEST_KEY, JSON.stringify(records));
};

export const clearGuestRecentlyViewed = () => {
  if (!canUseWindow()) return;
  localStorage.removeItem(RECENTLY_VIEWED_GUEST_KEY);
};

export const addGuestRecentlyViewed = ({ module, entity_id, viewed_at }) => {
  if (!module || !entity_id) return;
  const current = getGuestRecentlyViewed();
  const nextEntry = {
    module,
    entity_id: Number(entity_id),
    viewed_at: viewed_at || new Date().toISOString(),
  };

  const filtered = current.filter(
    (item) =>
      !(item?.module === nextEntry.module && Number(item?.entity_id) === nextEntry.entity_id)
  );
  const next = [nextEntry, ...filtered].slice(0, RECENTLY_VIEWED_MAX_ITEMS);
  setGuestRecentlyViewed(next);
  window.dispatchEvent(new Event(RECENTLY_VIEWED_UPDATED_EVENT));
};

export const getGuestRecentlyViewedByModule = (module, limit = 20) => {
  const list = getGuestRecentlyViewed().filter((item) => item?.module === module);
  return list.slice(0, limit);
};

/** Landing page: all modules combined, newest first. */
export const getAllGuestRecentlyViewed = (limit = 20) => {
  return [...getGuestRecentlyViewed()]
    .sort(
      (a, b) =>
        new Date(b?.viewed_at || 0).getTime() -
        new Date(a?.viewed_at || 0).getTime()
    )
    .slice(0, limit);
};
