import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";

/** Fetch all active brands across modules so landing page always displays all brands */
const fetchLandingBrands = async () => {
  try {
    const moduleIds = [1, 2, 3, 4, 5, 6];
    const allBrandsMap = new Map();

    await Promise.all(
      moduleIds.map(async (mId) => {
        try {
          const { data } = await MainApi.get("/api/v1/brand/all", {
            headers: {
              moduleId: mId,
            },
            moduleIdOverride: mId,
          });

          if (Array.isArray(data)) {
            data.forEach((brand) => {
              if (brand && brand.id && !allBrandsMap.has(brand.id)) {
                allBrandsMap.set(brand.id, brand);
              }
            });
          }
        } catch (err) {
          // Ignore module-specific 404/not found errors
        }
      })
    );

    return Array.from(allBrandsMap.values());
  } catch (error) {
    console.error("Error fetching landing brands:", error);
    return [];
  }
};

export default function useGetLandingBrands() {
  return useQuery("landing-brands-all-aggregated", fetchLandingBrands, {
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
