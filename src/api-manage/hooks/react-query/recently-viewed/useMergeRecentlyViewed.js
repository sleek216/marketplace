import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { recently_viewed_merge_api } from "api-manage/ApiRoutes";
import {
  clearGuestRecentlyViewed,
  getGuestRecentlyViewed,
  RECENTLY_VIEWED_UPDATED_EVENT,
} from "helper-functions/recentlyViewedGuest";

const mergeRecentlyViewed = async () => {
  const histories = getGuestRecentlyViewed();
  if (!histories?.length) return { merged: false };
  const { data } = await MainApi.post(recently_viewed_merge_api, { histories });
  clearGuestRecentlyViewed();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(RECENTLY_VIEWED_UPDATED_EVENT));
  }
  return data;
};

export default function useMergeRecentlyViewed() {
  return useMutation("merge-recently-viewed", mergeRecentlyViewed);
}
