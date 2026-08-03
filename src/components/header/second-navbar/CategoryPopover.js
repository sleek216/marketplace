import React, { useEffect, useMemo, useState } from "react";
import { Box, Divider, Skeleton, Stack, Typography } from "@mui/material";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedModule } from "redux/slices/utils";
import { getModuleId } from "helper-functions/getModuleId";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { useTranslation } from "react-i18next";
import { fetchForModule } from "api-manage/fetchForModule";

const MAX_SUB = 5;
const categoryCache = {};
const categoryRequestCache = {};

const getVisibleModules = (modules = []) =>
  modules.filter((m) => !["rental", "parcel"].includes(m?.module_type?.toLowerCase()));

const getCategoryStateForModule = (moduleId) =>
  categoryCache[moduleId] ?? { loading: true, data: [] };

const loadCategoryForModule = (mod) => {
  const moduleId = mod?.id;
  if (!moduleId) return Promise.resolve({ loading: false, data: [] });

  const cached = categoryCache[moduleId];
  if (cached && !cached.loading && cached.data?.length >= 0) {
    return Promise.resolve(cached);
  }

  if (categoryRequestCache[moduleId]) {
    return categoryRequestCache[moduleId];
  }

  categoryCache[moduleId] = {
    loading: true,
    data: cached?.data ?? [],
  };

  categoryRequestCache[moduleId] = fetchForModule("/api/v1/categories", moduleId)
    .then((res) => {
      const cats = res?.data ?? res ?? [];
      categoryCache[moduleId] = { loading: false, data: cats };
      return categoryCache[moduleId];
    })
    .catch(() => {
      categoryCache[moduleId] = { loading: false, data: [] };
      return categoryCache[moduleId];
    })
    .finally(() => {
      delete categoryRequestCache[moduleId];
    });

  return categoryRequestCache[moduleId];
};

export const prefetchCategoryPopoverData = (modules = []) => {
  const visible = getVisibleModules(modules);
  if (!visible.length) return Promise.resolve([]);
  return Promise.allSettled(visible.map((mod) => loadCategoryForModule(mod)));
};

/* ─── shimmer placeholder ─── */
const Shimmer = () => (
  <Stack spacing={1.2}>
    {[...Array(4)].map((_, i) => (
      <Skeleton key={i} width={`${50 + i * 12}%`} height={14} />
    ))}
  </Stack>
);

/* ─── single "See all" footer link ─── */
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
const ModuleColumn = ({
  module,
  categories,
  loading,
  onCategoryClick,
  onSubClick,
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
        sx={{ mb: 1.5 }}
        noWrap
      >
        {module?.module_name ?? module?.module_type}
      </Typography>

      {loading ? (
        <Shimmer />
      ) : (
        <Stack spacing={0} flex={1}>
          {categories?.slice(0, 8).map((cat, i) => (
            <Box key={cat?.id ?? i}>
              {/* Category name — bold */}
              <Typography
                onClick={() => onCategoryClick(cat, module)}
                fontWeight={600}
                fontSize="13px"
                sx={{
                  mt: i === 0 ? 0 : 1.5,
                  mb: 0.6,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  "&:hover": { color: "primary.main" },
                }}
              >
                {cat?.name}
              </Typography>

              {/* Sub-categories — gray */}
              {cat?.childes?.slice(0, MAX_SUB).map((sub, j) => (
                <Typography
                  key={j}
                  onClick={() => onSubClick(sub, module)}
                  fontSize="12px"
                  sx={{
                    mb: 0.4,
                    cursor: "pointer",
                    color: "text.secondary",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    transition: "color 0.15s",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  {sub?.name}
                </Typography>
              ))}
            </Box>
          ))}
        </Stack>
      )}

      <SeeAllLink
        label={`${t("See all")} ${module?.module_name ?? module?.module_type}`}
        onClick={() => onSeeAll(module)}
      />
    </Stack>
  );
};

/* ─── main component ─── */
const CategoryPopover = ({ onClose }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const { modules } = useSelector((state) => state.configData);

  const visibleModules = useMemo(() => getVisibleModules(modules ?? []), [modules]);
  const [moduleCategories, setModuleCategories] = useState(() =>
    Object.fromEntries(
      visibleModules.map((mod) => [mod.id, getCategoryStateForModule(mod.id)])
    )
  );

  useEffect(() => {
    if (!visibleModules.length) return;
    let active = true;

    setModuleCategories((prev) => {
      const next = { ...prev };
      visibleModules.forEach((mod) => {
        next[mod.id] = getCategoryStateForModule(mod.id);
      });
      return next;
    });

    visibleModules.forEach((mod) => {
      loadCategoryForModule(mod).then((state) => {
        if (!active) return;
        setModuleCategories((prev) => ({
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

  const handleCategoryClick = (cat, module) => {
    switchAndGo(module, "/home", {
      search: "category",
      id: cat?.id,
      module_id: module?.id,
      name: cat?.name,
      data_type: "category",
      from: "nav",
    });
  };

  const handleSubClick = (sub, module) => {
    switchAndGo(module, "/home", {
      search: "category",
      id: sub?.id,
      module_id: module?.id,
      name: sub?.name,
      data_type: "category",
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
          <ModuleColumn
            key={mod.id}
            module={mod}
            categories={moduleCategories[mod.id]?.data ?? []}
            loading={moduleCategories[mod.id]?.loading ?? true}
            onCategoryClick={handleCategoryClick}
            onSubClick={handleSubClick}
            onSeeAll={handleSeeAll}
            isLast={i === visibleModules.length - 1}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default CategoryPopover;
