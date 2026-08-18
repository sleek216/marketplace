import { alpha, Skeleton, styled, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useRef, useState } from "react";
import { setSelectedModule } from "redux/slices/utils";
import CustomImageContainer from "../CustomImageContainer";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { setFeaturedCategories, setRecommendedStores, setResetStoredData } from "redux/slices/storedData";
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from "lucide-react";
import useGetModule from "api-manage/hooks/react-query/useGetModule";

const SidebarWrapper = styled(Box)(({ theme }) => ({
  position: "fixed",
  zIndex: 1200,
  top: "50%",
  transform: "translateY(-50%)",
  right: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
  [theme.breakpoints.down("sm")]: {
    top: "50%",
    transform: "translateY(-50%)",
    right: 0,
    alignItems: "center",
  },
}));

const Sidebar = styled(Stack)(({ theme, isopen }) => ({
  "--sidebar-open-width": "88px",
  boxShadow: isopen
    ? theme.palette.mode === "dark"
      ? "0px 0px 29.7006px rgba(0, 0, 0, 0.5)"
      : "0px 0px 29.7006px rgba(71, 71, 71, 0.1)"
    : "none",
  background: isopen ? theme.palette.background.paper : "transparent",
  borderTopLeftRadius: isopen ? "29px" : "0px",
  borderBottomLeftRadius: isopen ? "29px" : "0px",
  maxHeight: "calc(100vh - 300px)",
  overflowY: "auto",
  overflowX: "hidden",
  width: isopen ? "var(--sidebar-open-width)" : "0px",
  minWidth: isopen ? "var(--sidebar-open-width)" : "0px",
  minHeight: "360px",
  transformOrigin: "right center",
  transition:
    "opacity 0.24s cubic-bezier(0.4, 0, 0.2, 1), transform 0.34s cubic-bezier(0.22, 1, 0.36, 1), width 0.34s cubic-bezier(0.22, 1, 0.36, 1), min-width 0.34s cubic-bezier(0.22, 1, 0.36, 1), clip-path 0.34s cubic-bezier(0.22, 1, 0.36, 1)",
  opacity: isopen ? 1 : 0,
  transform: isopen ? "translateX(0) scale(1)" : "translateX(18px) scale(0.96)",
  clipPath: isopen
    ? "inset(0 0 0 0 round 29px 0 0 29px)"
    : "inset(0 0 0 100% round 29px 0 0 29px)",
  pointerEvents: isopen ? "auto" : "none",
  alignItems: isopen ? "center" : "flex-end",
  justifyContent: "center",
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    "--sidebar-open-width": "68px",
    borderTopLeftRadius: isopen ? "20px" : "0px",
    borderBottomLeftRadius: isopen ? "20px" : "0px",
    maxHeight: "calc(100vh - 230px)",
    minHeight: "250px",
    clipPath: isopen
      ? "inset(0 0 0 0 round 20px 0 0 20px)"
      : "inset(0 0 0 100% round 20px 0 0 20px)",
  },
}));

const ToggleStrip = styled(Box)(({ theme, isopen }) => ({
  width: isopen ? "34px" : "26px",
  minHeight: isopen ? "92px" : "62px",
  position: isopen ? "absolute" : "relative",
  left: isopen ? "-42px" : "0px",
  top: isopen ? "50%" : "auto",
  transform: isopen ? "translateY(-50%)" : "none",
  borderRadius: isopen ? "18px" : "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.neutral[200], 0.2)
      : theme.palette.common.white,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0px 3px 12px rgba(0, 0, 0, 0.4)"
      : "0px 3px 12px rgba(71, 71, 71, 0.12)",
  zIndex: 1002,
  transition:
    "all 0.28s cubic-bezier(0.4, 0, 0.2, 1), transform 0.32s cubic-bezier(0.34, 1.2, 0.64, 1)",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? alpha(theme.palette.neutral[200], 0.3)
        : theme.palette.common.white,
  },
  [theme.breakpoints.down("sm")]: {
    width: isopen ? "28px" : "22px",
    minHeight: isopen ? "72px" : "52px",
    left: isopen ? "-34px" : "0px",
    borderRadius: isopen ? "14px" : "12px",
  },
}));
const ClosedRow = styled(Stack)(({ isopen }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: "8px",
  transition:
    "opacity 0.22s cubic-bezier(0.4, 0, 0.2, 1), transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)",
  opacity: isopen ? 0 : 1,
  transform: isopen ? "translateX(18px) scale(0.96)" : "translateX(0) scale(1)",
  pointerEvents: isopen ? "none" : "auto",
  position: "absolute",
  right: 0,
}));
const ModuleContainer = styled(Box)(({ theme, selected }) => {
  const isDark = theme.palette.mode === "dark";
  return {
    zIndex: 1000,
    cursor: "pointer",
    width: "62px",
    minHeight: "62px",
    borderRadius: "11px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: alpha(
      isDark ? theme.palette.neutral[200] : theme.palette.neutral[300],
      isDark ? 0.15 : 0.2
    ),
    border: "2px solid",
    transition: "all ease 0.5s",
    borderColor: selected
      ? theme.palette.primary.main
      : isDark 
        ? alpha(theme.palette.neutral[400], 0.3)
        : theme.palette.background.paper,
    background: selected
      ? theme.palette.gradients?.modulePanel || `radial-gradient(50% 50% at 50% 50%, ${alpha(theme.palette.primary.main, 0)} 0%, ${alpha(theme.palette.primary.main, isDark ? 0.3 : 0.15)} 100%)`
      : "none",
    "&:hover": {
      borderColor: theme.palette.primary.main,
      background: theme.palette.gradients?.modulePanelHover || `radial-gradient(50% 50% at 50% 50%, ${alpha(theme.palette.primary.main, 0)} 0%, ${alpha(theme.palette.primary.main, isDark ? 0.45 : 0.25)} 100%)`,
      "img, svg": {
        transform: "scale(1.1)",
      },
    },
    [theme.breakpoints.down("sm")]: {
      width: "50px",
      minHeight: "50px",
      borderRadius: "9px",
      gap: "3px",
    },
  };
});

const CollapsedModuleContainer = styled(Box)(({ theme }) => ({
  width: "58px",
  minHeight: "66px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  gap: "3px",
  padding: "6px 4px",
  border: `2px solid ${theme.palette.primary.main}`,
  background:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.neutral[200], 0.2)
      : theme.palette.common.white,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0px 3px 12px rgba(0, 0, 0, 0.35)"
      : "0px 3px 10px rgba(71, 71, 71, 0.12)",
  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
  [theme.breakpoints.down("sm")]: {
    width: "46px",
    minHeight: "54px",
    borderRadius: "9px",
    padding: "5px 3px",
  },
}));

export const zoneWiseModule = (data) => {
  let currentZoneIds = undefined;
  if (typeof window !== "undefined") {
    try {
      currentZoneIds = JSON.parse(localStorage.getItem("zoneid"));
    } catch (e) {
      currentZoneIds = undefined;
    }
  }
  // No zone selected yet (e.g. landing page): show all modules.
  if (!Array.isArray(currentZoneIds) || currentZoneIds.length === 0) {
    return data;
  }
  const filtered = data.filter((moduleItem) => {
    const zoneIds = moduleItem?.zones?.map((zone) => zone.id);
    return currentZoneIds?.some((id) => zoneIds?.includes(id));
  });
  return filtered.length > 0 ? filtered : data;
};

const ModuleSelect = ({
  moduleSelectHandler: propModuleSelectHandler,
  selectedModule: propSelectedModule,
  data: propData,
  dispatch: propDispatch,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  // Track in-flight navigation to prevent double clicks
  const navigating = useRef(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  
  const { data: apiData } = useGetModule();
  const reduxDispatch = useDispatch();
  const dispatch = propDispatch || reduxDispatch;
  const data = propData || apiData;

  const { interestId, existingModuleId } = useSelector(
    (state) => state.categoryIds
  );
  const { selectedModule: reduxSelectedModule } = useSelector(
    (state) => state.utilsData || {}
  );
  const selectedModule = propSelectedModule || reduxSelectedModule;

  // Landing page: no module highlight. Highlight only after entering a module (/home).
  const isOnModuleHome = router.pathname === "/home";
  const activeModule = isOnModuleHome ? selectedModule : null;

  const handleModuleSelect = (item) => {
    // Prevent double-fire while navigation is in progress
    if (navigating.current) return;
    navigating.current = true;

    // ── 1. Instant Redux update (0 ms — UI reacts before network) ──
    if (dispatch) {
      dispatch(setResetStoredData());
      dispatch(setSelectedModule(item));
    }

    // ── 2. Persist to localStorage synchronously ──
    if (typeof window !== "undefined") {
      const moduleZoneIds = item?.zones?.map((zone) => zone.id) || [];
      let currentZone = null;
      try {
        currentZone = JSON.parse(localStorage.getItem("zoneid"));
      } catch (e) {
        currentZone = null;
      }
      const zoneServesModule =
        Array.isArray(currentZone) &&
        currentZone.length > 0 &&
        (moduleZoneIds.length === 0 ||
          currentZone.some((id) => moduleZoneIds.includes(id)));
      if (!zoneServesModule) {
        localStorage.setItem(
          "zoneid",
          JSON.stringify(moduleZoneIds.length > 0 ? moduleZoneIds : [1])
        );
      }
      // Do NOT set a fake "Default Location" — let the user choose via "Select Location" in header
      localStorage.setItem("module", JSON.stringify(item));
    }

    // ── 3. Navigate (fire-and-forget — no await so UI isn't blocked) ──
    const navigate = () => {
      const isModuleExist = existingModuleId?.includes(item?.id);
      const doInterest =
        interestId?.length > 0 &&
        !isModuleExist &&
        item.module_type !== "parcel" &&
        item?.module !== "rental";

      if (propModuleSelectHandler) {
        propModuleSelectHandler(item);
        navigating.current = false;
      } else if (router.query.search) {
        router.replace("/home").then(() => {
          navigating.current = false;
          if (doInterest) router.push("/interest", undefined, { shallow: true });
        });
      } else if (router.pathname !== "/home") {
        router.push("/home").then(() => {
          navigating.current = false;
          if (doInterest) router.push("/interest", undefined, { shallow: true });
        });
      } else {
        // Already on /home — just a shallow state update, resolve immediately
        navigating.current = false;
        if (doInterest) router.push("/interest", undefined, { shallow: true });
      }
    };

    navigate();
  };

  /** Prefetch /home on hover so the page bundle is ready before the click. */
  const handleModuleHover = (item) => {
    if (router.pathname !== "/home") {
      router.prefetch("/home");
    }
  };

  const allModules = data || [];
  const rawItems = allModules.length > 0 ? (zoneWiseModule?.(allModules) || allModules) : allModules;

  // Only real modules from the API — no placeholder/fallback icons.
  // Preferred display order; anything else from the API goes at the end.
  const preferredOrder = ["grocery", "food", "pharmacy", "ecommerce"];
  const moduleItems = [...rawItems].sort((a, b) => {
    const ia = preferredOrder.indexOf(a?.module_type?.toLowerCase());
    const ib = preferredOrder.indexOf(b?.module_type?.toLowerCase());
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  // Nothing to show until the module list arrives.
  if (moduleItems.length === 0) {
    return null;
  }

  const sidebarMinHeight = Math.max(
    moduleItems.length * (isMobile ? 56 : 70) + 20,
    isMobile ? 250 : 300
  );

  return (
    <SidebarWrapper>
      <Sidebar
        p={isOpen ? ".8rem" : "0"}
        spacing={1.2}
        isopen={isOpen ? "true" : ""}
        sx={{ minHeight: `${sidebarMinHeight}px` }}
      >
        {moduleItems.map((item, index) => {
          return (
            <Tooltip
              title={item?.module_name}
              key={index}
              placement="left-start"
            >
              <ModuleContainer
                selected={
                  Boolean(activeModule) &&
                  item?.module_type === activeModule?.module_type &&
                  item?.id === activeModule?.id
                }
                id={item?.id}
                onClick={() => handleModuleSelect(item)}
                onMouseEnter={() => handleModuleHover(item)}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: isMobile ? "28px" : "36px",
                    height: isMobile ? "28px" : "36px",
                  }}
                >
                  {item?.icon_full_url && (
                    <Box
                      component="img"
                      src={item.icon_full_url}
                      alt={item?.module_name}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  )}
                </Box>
                <Typography
                  sx={{
                    fontSize: isMobile ? "7px" : "8px",
                    fontWeight: 600,
                    lineHeight: 1.1,
                    maxWidth: isMobile ? "44px" : "52px",
                    textAlign: "center",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    textTransform: "capitalize",
                  }}
                >
                  {item?.module_name}
                </Typography>
              </ModuleContainer>
            </Tooltip>
          );
        })}
      </Sidebar>

      {isOpen ? (
        <ToggleStrip
          isopen="true"
          onClick={() => setIsOpen(false)}
          sx={{
            opacity: 1,
            pointerEvents: "auto",
          }}
        >
          <ChevronRightIcon size={isMobile ? 14 : 16} />
        </ToggleStrip>
      ) : (
        <ClosedRow isopen="">
          <ToggleStrip onClick={() => setIsOpen(true)}>
            <ChevronLeftIcon size={isMobile ? 14 : 16} />
          </ToggleStrip>
        </ClosedRow>
      )}
    </SidebarWrapper>
  );
};

export default ModuleSelect;
