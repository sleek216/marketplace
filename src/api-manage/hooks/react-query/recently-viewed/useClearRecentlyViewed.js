import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { recently_viewed_clear_api } from "api-manage/ApiRoutes";
import {
  RECENTLY_VIEWED_UPDATED_EVENT,
  clearGuestRecentlyViewed,
  getGuestRecentlyViewed,
  setGuestRecentlyViewed,
} from "helper-functions/recentlyViewedGuest";

const clearRecentlyViewed = async ({ module, token }) => {
  if (token) {
    const url = module
      ? `${recently_viewed_clear_api}?module=${module}`
      : recently_viewed_clear_api;
    const { data } = await MainApi.delete(url);
    return data;
  }

  if (module) {
    const current = getGuestRecentlyViewed();
    const next = current.filter((item) => item?.module !== module);
    setGuestRecentlyViewed(next);
  } else {
    clearGuestRecentlyViewed();
  }
  return { message: "Cleared" };
};

export default function useClearRecentlyViewed() {
  return useMutation("clear-recently-viewed", clearRecentlyViewed, {
    onSuccess: () => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(RECENTLY_VIEWED_UPDATED_EVENT));
      }
    },
  });
}
