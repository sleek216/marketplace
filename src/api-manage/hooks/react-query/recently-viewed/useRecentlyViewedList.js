import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { recently_viewed_list_api } from "api-manage/ApiRoutes";
import { getGuestRecentlyViewedByModule } from "helper-functions/recentlyViewedGuest";

const getRecentlyViewedList = async ({ module, limit, offset, token }) => {
  if (!module) return [];
  if (!token) {
    return getGuestRecentlyViewedByModule(module, limit);
  }
  const query = `${recently_viewed_list_api}?module=${module}&limit=${limit}&offset=${offset}`;
  const { data } = await MainApi.get(query);
  return Array.isArray(data) ? data : data?.histories || [];
};

export default function useRecentlyViewedList({ module, limit = 20, offset = 1, token }) {
  return useQuery(
    ["recently-viewed-list", module, limit, offset, !!token],
    () => getRecentlyViewedList({ module, limit, offset, token }),
    { enabled: false, retry: false }
  );
}
