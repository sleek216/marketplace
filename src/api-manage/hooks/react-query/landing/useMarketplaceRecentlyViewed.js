import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import {
  item_details_api,
  marketplace_recently_viewed_api,
} from "api-manage/ApiRoutes";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { getToken, hasValidAuthToken } from "helper-functions/getToken";
import { getAllGuestRecentlyViewed } from "helper-functions/recentlyViewedGuest";

const PAGE_LIMIT = 20;

/**
 * Normalize marketplace recently-viewed product for LandingProductCard.
 */
export const normalizeMarketplaceRecentlyViewedProduct = (row, historyMeta = {}) => {
  if (!row) return null;

  const moduleTypeRaw = row?.module_type ?? row?.module ?? historyMeta?.module;
  const moduleType =
    typeof moduleTypeRaw === "string"
      ? moduleTypeRaw
      : moduleTypeRaw?.module_type;
  const moduleName =
    row?.module_name ??
    (typeof moduleTypeRaw === "object" ? moduleTypeRaw?.module_name : null);
  const moduleId =
    row?.module_id ??
    historyMeta?.module_id ??
    (typeof moduleTypeRaw === "object" ? moduleTypeRaw?.id : null);

  return {
    ...row,
    id: row?.id,
    name: row?.name,
    price: row?.price,
    store_id: row?.store_id,
    store_name: row?.store_name,
    store: row?.store || (row?.store_name ? { name: row.store_name } : undefined),
    module_id: moduleId,
    module_name: moduleName,
    module_type: moduleType,
    module:
      typeof row?.module === "object" && row?.module
        ? row.module
        : {
            id: moduleId,
            module_type: moduleType,
            module_name: moduleName,
          },
    viewed_at: row?.viewed_at || historyMeta?.viewed_at,
    image_full_url: row?.image_full_url,
  };
};

const resolveModuleIdFromType = (moduleType) => {
  if (typeof window === "undefined" || !moduleType) return undefined;
  try {
    const stored = JSON.parse(localStorage.getItem("module") || "null");
    if (stored?.module_type === moduleType && stored?.id) return stored.id;
  } catch {
    // ignore
  }
  return undefined;
};

const fetchGuestRecentlyViewedProducts = async (limit = PAGE_LIMIT) => {
  const histories = getAllGuestRecentlyViewed(limit);
  if (!histories.length) {
    return { products: [], total_size: 0, limit, offset: 1 };
  }

  const details = await Promise.all(
    histories.map(async (history) => {
      try {
        const moduleId = resolveModuleIdFromType(history?.module);
        const { data } = await MainApi.get(
          `${item_details_api}/${history?.entity_id}`,
          {
            omitModuleId: !moduleId,
            ...(moduleId ? { moduleIdOverride: moduleId } : {}),
          }
        );
        return normalizeMarketplaceRecentlyViewedProduct(data, {
          module: history?.module,
          module_id: moduleId,
          viewed_at: history?.viewed_at,
        });
      } catch {
        return null;
      }
    })
  );

  const products = details.filter(Boolean);
  return {
    products,
    total_size: products.length,
    limit,
    offset: 1,
  };
};

export const fetchMarketplaceRecentlyViewed = async ({
  limit = PAGE_LIMIT,
  offset = 1,
  module_ids,
} = {}) => {
  const token =
    typeof window !== "undefined"
      ? getToken() || localStorage.getItem("token")
      : null;
  const isAuthed = hasValidAuthToken(token);

  if (isAuthed) {
    try {
      const params = new URLSearchParams();
      params.set("limit", String(limit));
      params.set("offset", String(offset));
      if (module_ids) {
        params.set(
          "module_ids",
          Array.isArray(module_ids) ? JSON.stringify(module_ids) : String(module_ids)
        );
      }

      const { data } = await MainApi.get(
        `${marketplace_recently_viewed_api}?${params.toString()}`,
        { omitModuleId: true }
      );

      const raw = Array.isArray(data?.products)
        ? data.products
        : Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.data?.products)
            ? data.data.products
            : Array.isArray(data?.data)
              ? data.data
              : Array.isArray(data)
                ? data
                : [];

      const products = raw
        .map((row) => normalizeMarketplaceRecentlyViewedProduct(row))
        .filter(Boolean);

      if (products.length) {
        return {
          products,
          total_size:
            Number(data?.total_size ?? data?.data?.total_size ?? products.length) ||
            0,
          limit: Number(data?.limit) || limit,
          offset: Number(data?.offset) || offset,
        };
      }
    } catch {
      // Fall through to guest local history when marketplace API fails/empty.
    }
  }

  return fetchGuestRecentlyViewedProducts(limit);
};

export default function useMarketplaceRecentlyViewed({
  enabled = true,
  limit = PAGE_LIMIT,
  zoneKey = "",
} = {}) {
  const token =
    typeof window !== "undefined"
      ? getToken() || localStorage.getItem("token")
      : null;
  const isAuthed = hasValidAuthToken(token);

  return useQuery(
    ["marketplace-recently-viewed", zoneKey, limit, Boolean(isAuthed)],
    () => fetchMarketplaceRecentlyViewed({ limit, offset: 1 }),
    {
      // Zone preferred, but guest local history can still render without it.
      enabled: Boolean(enabled),
      staleTime: 1000 * 30,
      cacheTime: 1000 * 60 * 5,
      onError: onErrorResponse,
    }
  );
}

export { PAGE_LIMIT };
