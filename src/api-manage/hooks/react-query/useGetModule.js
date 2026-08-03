import MainApi from "../../MainApi";
import { useQuery } from "react-query";
import { moduleList } from "../../ApiRoutes";
import { onErrorResponse } from "../../api-error-response/ErrorResponses";

const getModule = async () => {
  const { data } = await MainApi.get(moduleList);
  return data;
};

export default function useGetModule(enabled = true) {
  return useQuery("module-list", getModule, {
    enabled: enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
    onError: (error) => {
      console.error("Error fetching modules:", error);
      onErrorResponse(error);
    },
  });
}
