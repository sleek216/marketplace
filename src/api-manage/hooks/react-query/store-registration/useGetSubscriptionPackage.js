import MainApi from "../../../MainApi";
import { subscription_package } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getModuleId } from "helper-functions/getModuleId";

const pickPackageList = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.packages)) return payload.packages;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.packages?.data)) return payload.packages.data;
  if (Array.isArray(payload.data?.packages)) return payload.data.packages;
  if (Array.isArray(payload.data?.data)) return payload.data.data;
  return [];
};

const getData = async (moduleId) => {
  const params = new URLSearchParams();
  if (moduleId) params.set("module_id", String(moduleId));
  params.set("limit", "100");
  params.set("offset", "1");
  const query = params.toString();
  const { data } = await MainApi.get(
    `${subscription_package}${query ? `?${query}` : ""}`,
    {
      ...(moduleId
        ? { moduleIdOverride: moduleId }
        : { omitModuleId: true }),
    }
  );
  return data;
};

export const normalizeSubscriptionPackages = (payload) => {
  const seen = new Set();
  return pickPackageList(payload).filter((pkg) => {
    if (!pkg || typeof pkg !== "object") return false;
    const key = pkg.id != null ? String(pkg.id) : null;
    if (!key) return true;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export default function useGetSubscriptionPackage(_selectedPlan, moduleId) {
  const resolvedModuleId = moduleId || getModuleId();
  return useQuery(
    ["vendor-packages", resolvedModuleId],
    () => getData(resolvedModuleId),
    {
      // Fetch as soon as module is known so subscription cards
      // are ready immediately when user selects the plan.
      enabled: Boolean(resolvedModuleId),
      onError: onSingleErrorResponse,
    }
  );
}
