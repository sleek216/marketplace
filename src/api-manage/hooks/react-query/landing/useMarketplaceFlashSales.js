import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { marketplace_flash_sales_items_api } from "api-manage/ApiRoutes";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";

const PAGE_LIMIT = 20;

/**
 * Flatten marketplace flash-sale rows into a product shape
 * LandingProductCard can render (price, discount, module, stock).
 */
export const normalizeMarketplaceFlashProduct = (row) => {
  if (!row) return null;
  const nested = row?.item && typeof row.item === "object" ? row.item : {};
  const moduleId = row?.module_id ?? nested?.module_id ?? nested?.module?.id;
  const moduleType =
    row?.module_type ?? nested?.module_type ?? nested?.module?.module_type;
  const moduleName =
    row?.module_name ?? nested?.module_name ?? nested?.module?.module_name;

  return {
    ...nested,
    id: nested?.id ?? row?.id,
    name: nested?.name ?? row?.name,
    price: nested?.price ?? row?.price,
    discount: row?.discount ?? nested?.discount,
    discount_type: row?.discount_type ?? nested?.discount_type,
    stock: row?.available_stock ?? nested?.stock,
    available_stock: row?.available_stock,
    discounted_price: row?.discounted_price,
    image_full_url: nested?.image_full_url ?? row?.image_full_url,
    store_name: nested?.store_name ?? nested?.store?.name,
    store: nested?.store,
    avg_rating: nested?.avg_rating ?? nested?.avgRating,
    rating_count: nested?.rating_count ?? nested?.review_count,
    order_count: nested?.order_count ?? nested?.sold,
    free_delivery: nested?.free_delivery ?? nested?.store?.free_delivery,
    variations: nested?.variations,
    food_variations: nested?.food_variations,
    has_variant: nested?.has_variant,
    available_time_starts: nested?.available_time_starts,
    available_time_ends: nested?.available_time_ends,
    schedule_order: nested?.schedule_order,
    available_date_starts: nested?.available_date_starts,
    unit_type: nested?.unit_type,
    unit: nested?.unit,
    module_id: moduleId,
    module_name: moduleName,
    module_type: moduleType,
    module: nested?.module || {
      id: moduleId,
      module_type: moduleType,
      module_name: moduleName,
    },
    flash_sale: 1,
    flash_sale_id: row?.flash_sale_id,
    flash_sale_title: row?.flash_sale_title,
    flash_sale_item_id: row?.id,
  };
};

export const fetchMarketplaceFlashSalesItems = async ({
  limit = PAGE_LIMIT,
  offset = 1,
  module_ids,
} = {}) => {
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
    `${marketplace_flash_sales_items_api}?${params.toString()}`,
    { omitModuleId: true }
  );

  // Support common payload shapes from marketplace / flash-sale APIs.
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

  return {
    products: raw.map(normalizeMarketplaceFlashProduct).filter(Boolean),
    total_size: Number(data?.total_size ?? data?.data?.total_size ?? raw.length) || 0,
    limit: Number(data?.limit) || limit,
    offset: Number(data?.offset) || offset,
  };
};

export default function useMarketplaceFlashSales({
  enabled = true,
  limit = PAGE_LIMIT,
  zoneKey = "",
} = {}) {
  return useQuery(
    ["marketplace-flash-sales-items", zoneKey, limit],
    () => fetchMarketplaceFlashSalesItems({ limit, offset: 1 }),
    {
      enabled: Boolean(enabled && zoneKey),
      staleTime: 1000 * 60,
      cacheTime: 1000 * 60 * 5,
      onError: onErrorResponse,
    }
  );
}

export { PAGE_LIMIT };
