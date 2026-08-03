import React, { useEffect, useMemo, useState } from "react";
import { Box, Divider, Skeleton, Stack, Typography } from "@mui/material";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedModule } from "redux/slices/utils";
import { fetchForModule } from "api-manage/fetchForModule";

const MAX_STORES = 7;
const storeCache = {};
const storeRequestCache = {};

const getVisibleModules = (modules = []) =>
  modules.filter((m) => !["rental", "parcel"].includes(m?.module_type?.toLowerCase()));

const getStoreStateForModule = (moduleId) =>
  storeCache[moduleId] ?? { loading: true, data: [] };

const loadStoresForModule = (mod) => {
  const moduleId = mod?.id;
  if (!moduleId) return Promise.resolve({ loading: false, data: [] });

  const cached = storeCache[moduleId];
  if (cached && !cached.loading && cached.data?.length >= 0) {
    return Promise.resolve(cached);
  }

  if (storeRequestCache[moduleId]) {
    return storeRequestCache[moduleId];
  }

  storeCache[moduleId] = {
    loading: true,
    data: cached?.data ?? [],
  };

  storeRequestCache[moduleId] = fetchForModule(
    `/api/v1/stores/popular?type=all&offset=1&limit=10`,
    moduleId
  )
    .then((res) => {
      const stores = res?.stores ?? res?.data?.stores ?? [];
      storeCache[moduleId] = { loading: false, data: stores };
      return storeCache[moduleId];
    })
    .catch(() => {
      storeCache[moduleId] = { loading: false, data: [] };
      return storeCache[moduleId];
    })
    .finally(() => {
      delete storeRequestCache[moduleId];
    });

  return storeRequestCache[moduleId];
};

export const prefetchStorePopoverData = (modules = []) => {
  const visible = getVisibleModules(modules);
  if (!visible.length) return Promise.resolve([]);
  return Promise.allSettled(visible.map((mod) => loadStoresForModule(mod)));
};

/* ─── shimmer ─── */
const Shimmer = () => (
  <Stack spacing={1.2}>
    {[...Array(5)].map((_, i) => (
      <Skeleton key={i} width={`${55 + i * 10}%`} height={14} />
    ))}
  </Stack>
);

/* ─── "See all" footer ─── */
const SeeAllLink = ({ label, onClick }) => (
  <Box mt={2}>
    <Divider sx={{ mb: 1.2 }} />
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.4}
      onClick={onClick}
      sx={{ cursor: "pointer", width: "fit-content" }}
    >
      <Typography
        fontSize="11.5px"
        fontWeight={600}
        color="primary.main"
        sx={{ "&:hover": { textDecoration: "underline" } }}
      >
        {label}
      </Typography>
      <ArrowRight size={13} />
    </Stack>
  </Box>
);

/* ─── one module column ─── */
const ModuleStoreColumn = ({
  module,
  stores,
  loading,
  onStoreClick,
  onSeeAll,
  isLast,
}) => {
  const { t } = useTranslation();
  return (
    <Stack
      flex="1 1 0"
      minWidth={0}
      sx={{
        px: 3,
        py: "26px",
        borderRight: isLast ? "none" : "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Module heading */}
      <Typography
        fontWeight={700}
        fontSize="13.5px"
        letterSpacing="0.03em"
        textTransform="uppercase"
        color="primary.main"
        sx={{ mb: 1.8 }}
        noWrap
      >
        {module?.module_name ?? module?.module_type}
      </Typography>

      <Stack spacing={1.4} flex={1}>
        {loading ? (
          <Shimmer />
        ) : stores?.length > 0 ? (
          stores.slice(0, MAX_STORES).map((store) => (
            <Typography
              key={store.id}
              onClick={() => onStoreClick(store, module)}
              fontSize="13px"
              sx={{
                cursor: "pointer",
                color: "text.secondary",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                transition: "color 0.15s",
                "&:hover": { color: "primary.main" },
              }}
            >
              {store.name}
            </Typography>
          ))
        ) : (
          <Typography fontSize="12px" color="text.disabled" fontStyle="italic">
            {t("No stores")}
          </Typography>
        )}
      </Stack>

      <SeeAllLink
        label={`${t("See all")} ${module?.module_name ?? module?.module_type}`}
        onClick={() => onSeeAll(module)}
      />
    </Stack>
  );
};

/* ─── main component ─── */
const NavStorePopover = ({ onClose }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const { modules } = useSelector((state) => state.configData);

  const visibleModules = useMemo(() => getVisibleModules(modules ?? []), [modules]);
  const [moduleStores, setModuleStores] = useState(() =>
    Object.fromEntries(
      visibleModules.map((mod) => [mod.id, getStoreStateForModule(mod.id)])
    )
  );

  useEffect(() => {
    if (!visibleModules.length) return;
    let active = true;

    setModuleStores((prev) => {
      const next = { ...prev };
      visibleModules.forEach((mod) => {
        next[mod.id] = getStoreStateForModule(mod.id);
      });
      return next;
    });

    visibleModules.forEach((mod) => {
      loadStoresForModule(mod).then((state) => {
        if (!active) return;
        setModuleStores((prev) => ({
          ...prev,
          [mod.id]: state,
        }));
      });
    });

    return () => {
      active = false;
    };
  }, [visibleModules]);

  /* ── switch module + navigate ── */
  const switchAndGo = (module, path, query) => {
    localStorage.setItem("module", JSON.stringify(module));
    dispatch(setSelectedModule(module));
    router.push({ pathname: path, query });
    onClose?.();
  };

  const handleStoreClick = (store, module) => {
    switchAndGo(module, "/store/[id]", {
      id: `${store?.slug ?? store?.id}`,
      module_id: module?.id,
      module_type: module?.module_type,
      store_zone_id: `${store?.zone_id}`,
    });
  };

  const handleSeeAll = (module) => {
    switchAndGo(module, "/home", {});
  };

  if (!visibleModules.length) return null;

  return (
    <Box sx={{ maxWidth: "1300px", mx: "auto", px: { md: 2, lg: 4 } }}>
      <Stack direction="row" alignItems="stretch" sx={{ minHeight: "240px" }}>
        {visibleModules.map((mod, i) => (
          <ModuleStoreColumn
            key={mod.id}
            module={mod}
            stores={moduleStores[mod.id]?.data ?? []}
            loading={moduleStores[mod.id]?.loading ?? true}
            onStoreClick={handleStoreClick}
            onSeeAll={handleSeeAll}
            isLast={i === visibleModules.length - 1}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default NavStorePopover;
