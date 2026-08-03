import { Box, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";

const PULL_THRESHOLD = 72;
const MAX_PULL = 110;
const RESISTANCE = 0.45;

const PullToRefresh = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const queryClient = useQueryClient();
  const router = useRouter();
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const startYRef = useRef(0);
  const pullingRef = useRef(false);
  const pullDistanceRef = useRef(0);
  const refreshingRef = useRef(false);

  const page = router.query?.page;
  const isDisabled =
    !isMobile ||
    page === "inbox" ||
    router.pathname === "/checkout";

  const setPull = useCallback((distance) => {
    pullDistanceRef.current = distance;
    setPullDistance(distance);
  }, []);

  const handleRefresh = useCallback(async () => {
    if (refreshingRef.current) return;

    refreshingRef.current = true;
    setRefreshing(true);
    setPull(MAX_PULL);

    try {
      await queryClient.invalidateQueries();
    } finally {
      refreshingRef.current = false;
      setRefreshing(false);
      setPull(0);
    }
  }, [queryClient, setPull]);

  useEffect(() => {
    if (isDisabled) return;

    const canStartPull = () =>
      !refreshingRef.current &&
      (window.scrollY <= 0 || document.documentElement.scrollTop <= 0);

    const onTouchStart = (event) => {
      if (!canStartPull()) return;
      startYRef.current = event.touches[0].clientY;
      pullingRef.current = true;
    };

    const onTouchMove = (event) => {
      if (!pullingRef.current || refreshingRef.current) return;

      const currentY = event.touches[0].clientY;
      const delta = currentY - startYRef.current;

      if (delta > 0 && canStartPull()) {
        event.preventDefault();
        setPull(Math.min(delta * RESISTANCE, MAX_PULL));
        return;
      }

      pullingRef.current = false;
      setPull(0);
    };

    const onTouchEnd = () => {
      if (!pullingRef.current) return;

      pullingRef.current = false;

      if (pullDistanceRef.current >= PULL_THRESHOLD) {
        handleRefresh();
        return;
      }

      setPull(0);
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [handleRefresh, isDisabled, setPull]);

  const showIndicator = pullDistance > 0 || refreshing;
  const progress = Math.min(pullDistance / PULL_THRESHOLD, 1);

  return (
    <>
      {showIndicator && (
        <Box
          aria-hidden
          sx={{
            position: "fixed",
            top: { xs: "56px", sm: "64px" },
            left: 0,
            right: 0,
            zIndex: theme.zIndex.appBar + 1,
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
            transform: `translateY(${refreshing ? 8 : pullDistance - 28}px)`,
            opacity: refreshing ? 1 : 0.35 + progress * 0.65,
            transition: refreshing
              ? "transform 0.2s ease, opacity 0.2s ease"
              : "opacity 0.15s ease",
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.palette.background.paper,
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.12)",
            }}
          >
            <CircularProgress
              size={22}
              thickness={5}
              variant={refreshing ? "indeterminate" : "determinate"}
              value={refreshing ? undefined : progress * 100}
              sx={{ color: theme.palette.primary.main }}
            />
          </Box>
        </Box>
      )}
      {children}
    </>
  );
};

export default PullToRefresh;
