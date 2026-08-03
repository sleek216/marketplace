import { useInfiniteQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { marketplace_items_api } from "api-manage/ApiRoutes";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";

const PAGE_LIMIT = 24;

/**
 * All products across modules for the marketplace landing catalog.
 * Requires zoneId (via MainApi interceptor). Never sends moduleId.
 */
export const fetchMarketplaceItems = async ({
  pageParam = 1,
  limit = PAGE_LIMIT,
  sort = "latest",
  type = "all",
  search,
  min_price,
  max_price,
  rating_count,
  filter,
  module_ids,
} = {}) => {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  params.set("offset", String(pageParam));
  params.set("sort", sort || "latest");
  params.set("type", type || "all");
  if (search) params.set("search", search);
  if (min_price != null && min_price !== "") params.set("min_price", String(min_price));
  if (max_price != null && max_price !== "") params.set("max_price", String(max_price));
  if (rating_count) params.set("rating_count", String(rating_count));
  if (filter) params.set("filter", filter);
  if (module_ids) {
    params.set(
      "module_ids",
      Array.isArray(module_ids) ? JSON.stringify(module_ids) : String(module_ids)
    );
  }

  const { data } = await MainApi.get(
    `${marketplace_items_api}?${params.toString()}`,
    { omitModuleId: true }
  );

  return {
    products: Array.isArray(data?.products) ? data.products : [],
    total_size: Number(data?.total_size) || 0,
    limit: Number(data?.limit) || limit,
    offset: Number(data?.offset) || pageParam,
  };
};

export default function useMarketplaceItems({
  enabled = true,
  sort = "latest",
  type = "all",
  search = "",
  limit = PAGE_LIMIT,
  zoneKey = "",
} = {}) {
  return useInfiniteQuery(
    ["marketplace-items", zoneKey, sort, type, search, limit],
    ({ pageParam = 1 }) =>
      fetchMarketplaceItems({
        pageParam,
        limit,
        sort,
        type,
        search: search || undefined,
      }),
    {
      enabled: Boolean(enabled && zoneKey),
      staleTime: 1000 * 60,
      cacheTime: 1000 * 60 * 5,
      getNextPageParam: (lastPage, allPages) => {
        const loaded = allPages.reduce(
          (sum, page) => sum + (page?.products?.length || 0),
          0
        );
        if (!lastPage?.products?.length) return undefined;
        if (loaded >= (lastPage?.total_size || 0)) return undefined;
        return allPages.length + 1;
      },
      onError: onErrorResponse,
    }
  );
}

export { PAGE_LIMIT };
