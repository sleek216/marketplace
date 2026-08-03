import { Box } from "@mui/material";
import { forwardRef, useEffect } from "react";

export const CATEGORY_ITEM_WIDTH = { xs: "90px", sm: "110px", md: "130px" };

export const CategoryScrollStrip = forwardRef(function CategoryScrollStrip(
  { children, sx = {} },
  ref
) {
  return (
    <Box
      ref={ref}
      sx={{
        display: "flex",
        flexDirection: "row",
        overflowX: "auto",
        scrollBehavior: "smooth",
        border: "1px solid",
        borderColor: "divider",
        width: "100%",
        "&::-webkit-scrollbar": { display: "none" },
        msOverflowStyle: "none",
        scrollbarWidth: "none",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
});

export const CategoryScrollItem = ({ children, sx = {} }) => (
  <Box
    sx={{
      flexShrink: 0,
      width: CATEGORY_ITEM_WIDTH,
      borderRight: "1px solid",
      borderColor: "divider",
      ...sx,
    }}
  >
    {children}
  </Box>
);

export const scrollCategoryStrip = (ref, direction, amount = 250) => {
  ref?.current?.scrollBy({
    left: direction === "left" ? -amount : amount,
    behavior: "smooth",
  });
};

/** Banner-style autoplay for the horizontal category strip. */
export const useCategoryAutoScroll = (
  ref,
  { enabled = true, intervalMs = 3000, pauseOnHover = true } = {}
) => {
  useEffect(() => {
    if (!enabled) return undefined;

    const el = ref?.current;
    if (!el) return undefined;

    let paused = false;

    const pause = () => {
      paused = true;
    };
    const resume = () => {
      paused = false;
    };

    if (pauseOnHover) {
      el.addEventListener("mouseenter", pause);
      el.addEventListener("mouseleave", resume);
    }

    const tick = () => {
      if (paused) return;

      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 4) return;

      const step = el.firstElementChild?.offsetWidth || 110;
      const atEnd = el.scrollLeft >= maxScroll - 4;

      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    };

    const id = setInterval(tick, intervalMs);

    return () => {
      clearInterval(id);
      if (pauseOnHover) {
        el.removeEventListener("mouseenter", pause);
        el.removeEventListener("mouseleave", resume);
      }
    };
  }, [enabled, intervalMs, pauseOnHover, ref]);
};
