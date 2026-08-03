import React, { useEffect, useMemo, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Skeleton } from "@mui/material";
import MainLayout from "../../../src/components/layout/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { setConfigData } from "redux/slices/configData";
import StoreDetails from "../../../src/components/store-details";
import SEO from "../../../src/components/seo";
import useScrollToTop from "api-manage/hooks/custom-hooks/useScrollToTop";
import useGetStoreDetails, {
  getStoreDetailsQueryKey,
} from "api-manage/hooks/react-query/store/useGetStoreDetails";
import { useGetConfigData } from "api-manage/hooks/useGetConfigData";
import {
  getCachedStorePreview,
  getStoreIdFromPath,
} from "helper-functions/storeNavigation";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";

const StorePageSkeleton = () => (
  <CustomStackFullWidth spacing={2} sx={{ p: { xs: 1, md: 0 }, mt: "1rem" }}>
    <Skeleton variant="rectangular" height={220} sx={{ borderRadius: "2px" }} />
    <Skeleton variant="rectangular" height={140} sx={{ borderRadius: "2px" }} />
    <Skeleton variant="rectangular" height={360} sx={{ borderRadius: "2px" }} />
  </CustomStackFullWidth>
);

const StorePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { configData: reduxConfig } = useSelector((state) => state.configData);
  const { id, distance } = router.query;
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const storeId = useMemo(() => {
    const fromQuery = Array.isArray(id) ? id[0] : id;
    if (fromQuery) return fromQuery;
    return hasMounted ? getStoreIdFromPath() : null;
  }, [id, hasMounted]);

  useScrollToTop();

  const instantStore = useMemo(() => {
    if (!hasMounted || !storeId) return null;
    const cachedStore = getCachedStorePreview(storeId);
    const queryCachedStore = queryClient.getQueryData(
      getStoreDetailsQueryKey(storeId)
    );
    return cachedStore || queryCachedStore || null;
  }, [hasMounted, queryClient, storeId]);

  const { data: fetchedConfig, refetch: refetchConfig } = useGetConfigData();
  const { data: storeDetails, isLoading } = useGetStoreDetails(storeId, {
    enabled: !!storeId,
    initialData: instantStore ?? undefined,
    placeholderData: instantStore ?? undefined,
  });

  const configData = reduxConfig || fetchedConfig;
  const activeStore = storeDetails || instantStore;
  // Keep SSR and first client paint identical; then allow loading UI after mount.
  const showSkeleton = !activeStore && (!hasMounted || isLoading);

  const manageVisitedStores = () => {
    if (!activeStore?.id) return;
    const key = "visitedStores";
    try {
      const stored = localStorage.getItem(key);
      const visitedStores = stored ? JSON.parse(stored) : [];
      const alreadyVisited = visitedStores.some(
        (store) => store?.id === activeStore?.id
      );
      if (!alreadyVisited) {
        visitedStores.push({ ...activeStore, distance: distance || null });
        localStorage.setItem(key, JSON.stringify(visitedStores));
      }
    } catch {
      // ignore storage errors
    }
  };

  useEffect(() => {
    if (!reduxConfig) {
      refetchConfig();
    }
  }, [reduxConfig, refetchConfig]);

  useEffect(() => {
    if (fetchedConfig) {
      dispatch(setConfigData(fetchedConfig));
    }
  }, [fetchedConfig, dispatch]);

  useEffect(() => {
    if (activeStore) {
      manageVisitedStores();
    }
  }, [activeStore?.id]);

  const metaTitle = activeStore
    ? `${activeStore?.meta_title || activeStore?.name} - ${configData?.business_name || ""}`
    : configData?.business_name;
  const metaImage =
    activeStore?.meta_image_full_url || activeStore?.cover_photo_full_url;

  return (
    <>
      <CssBaseline />
      <SEO
        title={metaTitle}
        image={metaImage}
        businessName={configData?.business_name}
        description={activeStore?.meta_description}
        configData={configData}
      />
      <MainLayout configData={configData}>
        {showSkeleton ? (
          <StorePageSkeleton />
        ) : (
          <StoreDetails storeDetails={activeStore} configData={configData} />
        )}
      </MainLayout>
    </>
  );
};

export default StorePage;
