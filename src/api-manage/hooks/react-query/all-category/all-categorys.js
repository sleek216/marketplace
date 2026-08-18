import { useQuery } from "react-query";

import { categories_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";
import {
  getCurrentModuleId,
  getCurrentModuleType,
} from "helper-functions/getCurrentModuleType";

const getData = async (searchKey) => {
  if (searchKey && searchKey !== "") {
    return await MainApi.get(`${categories_api}/${searchKey}`);
  } else {
    return await MainApi.get(`${categories_api}`);
  }
};
export const useGetCategories = (
  searchKey,
  handleRequestOnSuccess,
  queryKey
) => {
  return useQuery(
    queryKey ? queryKey : "catogories-list",
    () => getData(searchKey),
    {
      enabled: false,
      onSuccess: handleRequestOnSuccess,
      onError: onErrorResponse,
      cacheTime: 300000,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );
};

const getFeaturedData = async (moduleId) => {
  return await MainApi.get(`${categories_api}`, {
    ...(moduleId ? { moduleIdOverride: moduleId } : {}),
  });
};
export const useGetFeaturedCategories = (handleSuccess) => {
  const moduleId = getCurrentModuleId();
  const moduleType = getCurrentModuleType();
  return useQuery(
    ["featured-categories-lists", moduleId || moduleType || "none"],
    () => getFeaturedData(moduleId),
    {
      enabled: Boolean(moduleId || moduleType),
      cacheTime: 1000 * 60,
      staleTime: 1000 * 30,
      onError: onErrorResponse,
      onSuccess: (data) => {
        if (handleSuccess) {
          handleSuccess(data);
        }
      },
    }
  );
};

// Landing page: all categories across every module (no moduleId header).
const getAllModulesData = async () => {
  return await MainApi.get(`${categories_api}`, { omitModuleId: true });
};
export const useGetAllModulesCategories = () => {
  return useQuery("all-modules-categories-list", getAllModulesData, {
    enabled: true,
    cacheTime: 1000 * 60 * 5,
    staleTime: 1000 * 60 * 2,
    onError: onErrorResponse,
  });
};
