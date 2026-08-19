import React, { useEffect, useState } from "react";
import {
  alpha,
  Box,
  IconButton,
  Skeleton,
  Stack,
  useTheme,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CustomContainer from "../container";
import {
  BANNER_GRID_GAP_PX,
  bannerBoardHeightSx,
  bannerMobileSlotHeightSx,
  bannerSectionPySx,
} from "./homeSectionRhythm";

const fillImageSx = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center center",
  display: "block",
  maxWidth: "none",
  transform: "none",
};

const slotSx = (theme) => ({
  position: "relative",
  overflow: "hidden",
  minWidth: 0,
  minHeight: 0,
  width: "100%",
  height: "100%",
  borderRadius: "2px",
  bgcolor: alpha(theme.palette.neutral[200], 0.45),
  border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
});

/**
 * Always 3 fixed slots: large left + 2 stacked right.
 * Extra banners rotate only inside the left slot — board size never changes.
 */
const PromotionalBannerGrid = ({
  slides = [],
  loading = false,
  onSlideClick,
  autoplayMs = 4000,
  wrapSection = true,
  alwaysShowSideColumn = true,
  fallbackSideSlides = [],
}) => {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const showSideColumn = alwaysShowSideColumn;

  // 1 banner = 1 slot. Extra banners stay in the LEFT slot only.
  const sideTopSlide = loading
    ? null
    : slides[1] || fallbackSideSlides?.[0] || null;
  const sideBottomSlide = loading
    ? null
    : slides[2] || fallbackSideSlides?.[1] || fallbackSideSlides?.[0] || null;
  const sideSlides = [sideTopSlide, sideBottomSlide];

  const mainSlides =
    slides.length > 3 ? [slides[0], ...slides.slice(3)] : slides.slice(0, 1);
  const slideCount = mainSlides.length;

  useEffect(() => {
    setActiveIndex(0);
  }, [slideCount]);

  useEffect(() => {
    if (loading || slideCount <= 1) return undefined;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slideCount);
    }, autoplayMs);
    return () => clearInterval(interval);
  }, [loading, slideCount, autoplayMs]);

  if (!loading && slideCount === 0 && !fallbackSideSlides?.length) {
    return null;
  }

  const handlePrev = (event) => {
    event.stopPropagation();
    if (slideCount <= 1) return;
    setActiveIndex((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const handleNext = (event) => {
    event.stopPropagation();
    if (slideCount <= 1) return;
    setActiveIndex((prev) => (prev + 1) % slideCount);
  };

  const handleSlideActivate = (slide, index) => {
    if (!slide || loading) return;
    onSlideClick?.(slide, index);
  };

  const currentSlide =
    slideCount > 0
      ? mainSlides[activeIndex % slideCount]
      : fallbackSideSlides?.[0] || null;

  const arrowSx = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(0, 0, 0, 0.4)",
    color: "#fff",
    width: 36,
    height: 36,
    opacity: 0,
    transition: "all 0.25s ease",
    zIndex: 2,
    "&:hover": { background: "rgba(0, 0, 0, 0.75)" },
  };

  const renderImage = (slide, alt) => {
    if (loading || !slide?.src) {
      return (
        <Skeleton
          variant="rectangular"
          sx={{ ...fillImageSx, position: "absolute" }}
        />
      );
    }
    return (
      <Box
        component="img"
        src={slide.src}
        alt={slide.alt || alt}
        sx={fillImageSx}
      />
    );
  };

  const board = (
    <Box
      sx={{
        display: "grid",
        width: "100%",
        height: bannerBoardHeightSx,
        gap: `${BANNER_GRID_GAP_PX}px`,
        gridTemplateColumns: {
          xs: "1fr",
          md: showSideColumn ? "minmax(0, 2fr) minmax(0, 1fr)" : "1fr",
        },
        gridTemplateRows: {
          xs: showSideColumn
            ? `${bannerMobileSlotHeightSx.xs} ${bannerMobileSlotHeightSx.xs} ${bannerMobileSlotHeightSx.xs}`
            : bannerMobileSlotHeightSx.xs,
          sm: showSideColumn
            ? `${bannerMobileSlotHeightSx.sm} ${bannerMobileSlotHeightSx.sm} ${bannerMobileSlotHeightSx.sm}`
            : bannerMobileSlotHeightSx.sm,
          md: showSideColumn ? "1fr 1fr" : "1fr",
        },
      }}
    >
      <Box
        onClick={() => handleSlideActivate(currentSlide, activeIndex)}
        sx={{
          ...slotSx(theme),
          gridColumn: { xs: "1", md: "1" },
          gridRow: { xs: "1", md: showSideColumn ? "1 / 3" : "1" },
          cursor: !loading && onSlideClick && currentSlide ? "pointer" : "default",
          "&:hover .carousel-arrow": { opacity: 1 },
        }}
      >
        {renderImage(currentSlide, "Promotional banner")}

        {!loading && slideCount > 1 && (
          <>
            <IconButton
              className="carousel-arrow"
              aria-label="Previous banner"
              onClick={handlePrev}
              sx={{ ...arrowSx, left: 12 }}
            >
              <ArrowBackIosIcon sx={{ fontSize: 16, ml: 0.5 }} />
            </IconButton>
            <IconButton
              className="carousel-arrow"
              aria-label="Next banner"
              onClick={handleNext}
              sx={{ ...arrowSx, right: 12 }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                position: "absolute",
                bottom: 16,
                right: { xs: "50%", md: 24 },
                transform: { xs: "translateX(50%)", md: "none" },
                zIndex: 2,
              }}
            >
              {mainSlides.map((_, idx) => (
                <Box
                  key={idx}
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveIndex(idx);
                  }}
                  sx={{
                    width: idx === activeIndex ? 24 : 8,
                    height: 8,
                    borderRadius: "2px",
                    background:
                      idx === activeIndex
                        ? theme.palette.primary.main
                        : "rgba(255, 255, 255, 0.65)",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </Stack>
          </>
        )}
      </Box>

      {showSideColumn &&
        [0, 1].map((index) => {
          const slide = sideSlides[index];
          return (
            <Box
              key={`side-slot-${index}`}
              onClick={
                loading || !slide || !onSlideClick
                  ? undefined
                  : () => handleSlideActivate(slide, index + 1)
              }
              sx={{
                ...slotSx(theme),
                gridColumn: { xs: "1", md: "2" },
                gridRow: { xs: String(index + 2), md: String(index + 1) },
                cursor: loading || !slide || !onSlideClick ? "default" : "pointer",
              }}
            >
              {renderImage(slide, "Side banner")}
            </Box>
          );
        })}
    </Box>
  );

  if (!wrapSection) {
    return board;
  }

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        ...bannerSectionPySx,
        position: "relative",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <CustomContainer>{board}</CustomContainer>
    </Box>
  );
};

export default PromotionalBannerGrid;
