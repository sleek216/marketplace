import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import {
  item_details_api,
  popular_items,
  recently_viewed_list_api,
} from "api-manage/ApiRoutes";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { getAllGuestRecentlyViewed } from "helper-functions/recentlyViewedGuest";

const fetchProductDetails = async (histories = []) => {
  if (!histories?.length) return [];
  const details = await Promise.all(
    histories.map(async (history) => {
      try {
        const { data } = await MainApi.get(
          `${item_details_api}/${history?.entity_id}`
        );
        return data;
      } catch {
        return null;
      }
    })
  );
  return details.filter(Boolean);
};

const fetchRecentlyViewedHistories = async (limit = 20) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (token) {
    try {
      const { data } = await MainApi.get(
        `${recently_viewed_list_api}?limit=${limit}&offset=1`,
        { omitModuleId: true }
      );
      const histories = Array.isArray(data) ? data : data?.histories || [];
      if (histories.length) return histories;
    } catch {
      // Fall through to guest history when cross-module API is unavailable.
    }
  }

  return getAllGuestRecentlyViewed(limit);
};

const fetchLandingPopularProducts = async (limit = 20) => {
  const { data } = await MainApi.get(
    `${popular_items}?limit=${limit}&offset=1&type=all`,
    { omitModuleId: true }
  );
  return Array.isArray(data?.products) ? data.products : [];
};

const getLandingProductsSection = async (limit = 20) => {
  const histories = await fetchRecentlyViewedHistories(limit);
  if (histories.length) {
    const products = await fetchProductDetails(histories);
    if (products.length) {
      return { products, source: "recently-viewed" };
    }
  }

  const products = await fetchLandingPopularProducts(limit);
  return { products, source: products.length ? "popular" : "empty" };
};

export const fetchAllLandingProducts = () => getLandingProductsSection(100);

export default function useLandingProductsSection(enabled = true) {
  return useQuery(["landing-products-section"], getLandingProductsSection, {
    enabled,
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 5,
    onError: onErrorResponse,
  });
};
