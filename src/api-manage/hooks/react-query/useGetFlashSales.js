import { useQuery } from "react-query";
import { onErrorResponse } from "../../api-error-response/ErrorResponses";
import MainApi from "../../MainApi";
import { flash_sales, flash_sales_items } from "../../ApiRoutes";
import { getModuleId } from "helper-functions/getModuleId";
import { useInfiniteQuery } from "react-query";

const getFlashSales = async (pageParams) => {
  const { limit = 20, offset = 1 } = pageParams || {};
  const { data } = await MainApi.get(
    `${flash_sales}?limit=${limit}&offset=${offset}`
  );
  return data;
};

export function useGetFlashSales(pageParams) {
  const moduleId = getModuleId();
  return useQuery(
    ["flash-sales", moduleId, pageParams?.limit, pageParams?.offset],
    () => getFlashSales(pageParams),
    {
      enabled: false,
      onError: onErrorResponse,
    }
  );
}

const getFlashSalesInfinity = async (pageParams) => {
  const { limit, offset, id } = pageParams;
  const { data } = await MainApi.get(
    `${flash_sales_items}?limit=${limit}&offset=${offset}&flash_sale_id=${id}`
  );
  return data;
};

export function useGetFlashSalesInfinityScroll(pageParams) {
  return useInfiniteQuery(
    ["flash-sales-items", pageParams?.id],
    ({ pageParam = 1 }) =>
      getFlashSalesInfinity({ ...pageParams, offset: pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage?.products?.length > 0 ? nextPage : undefined;
      },
      getPreviousPageParam: (firstPage) => firstPage.prevCursor,
      enabled: false,
      onError: onErrorResponse,
      cacheTime: 0,
    }
  );
}
