import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { recently_viewed_track_api } from "api-manage/ApiRoutes";
import {
  addGuestRecentlyViewed,
  RECENTLY_VIEWED_UPDATED_EVENT,
} from "helper-functions/recentlyViewedGuest";

const trackRecentlyViewed = async ({ module, entity_id, viewed_at, token }) => {
  const payload = {
    module,
    entity_id: Number(entity_id),
    viewed_at: viewed_at || new Date().toISOString(),
  };
  if (token) {
    const { data } = await MainApi.post(recently_viewed_track_api, payload);
    return data;
  }
  addGuestRecentlyViewed(payload);
  return payload;
};

export default function useTrackRecentlyViewed() {
  return useMutation("track-recently-viewed", trackRecentlyViewed, {
    onSuccess: () => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(RECENTLY_VIEWED_UPDATED_EVENT));
      }
    },
  });
}
