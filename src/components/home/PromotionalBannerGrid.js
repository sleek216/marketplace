import React, { useEffect, useState } from "react";
import {
  alpha,
  Box,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  useTheme,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CustomContainer from "../container";
import {
  bannerMainHeightSx,
  bannerSectionPySx,
  bannerSideTileMinSx,
  BANNER_SIDE_STACK_GAP_PX,
} from "./homeSectionRhythm";

const fillImageSx = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

/**
 * Landing-style promotional banner grid: main carousel + 2 side tiles.
 * Fixed heights match landing HeroSection at every breakpoint.
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

  const carouselSlides = slides;
  const slideCount = carouselSlides.length;

  const resolveSideSlides = () => {
    if (loading) return [null, null];
    return [0, 1].map(
      (offset) =>
        slides[offset + 1] ||
        fallbackSideSlides?.[offset] ||
        slides[0] ||
        fallbackSideSlides?.[0] ||
        null
    );
  };

  const sideSlides = resolveSideSlides();
  const showSideColumn =
    alwaysShowSideColumn && (loading || sideSlides.some(Boolean));

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

  if (!loading && slideCount === 0) {
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

  const currentSlide = carouselSlides[activeIndex % Math.max(slideCount, 1)];

  const mainPaperSx = {
    borderRadius: "2px",
    overflow: "hidden",
    position: "relative",
    width: "100%",
    height: bannerMainHeightSx,
    minHeight: bannerMainHeightSx,
    border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    "&:hover .carousel-arrow": {
      opacity: 1,
    },
  };

  const sidePaperSx = (imageClass) => ({
    borderRadius: "2px",
    overflow: "hidden",
    position: "relative",
    cursor: loading || !onSlideClick ? "default" : "pointer",
    flex: "1 1 0",
    minHeight: { xs: bannerSideTileMinSx.xs, sm: bannerSideTileMinSx.sm },
    border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    ...(!loading &&
      onSlideClick && {
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
          [`& .${imageClass}`]: { transform: "scale(1.03)" },
        },
      }),
  });

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

  const renderMainContent = () => {
    if (loading) {
      return (
        <Skeleton
          variant="rectangular"
          sx={{ ...fillImageSx, position: "absolute" }}
        />
      );
    }

    return (
      <>
        <Box
          component="img"
          src={currentSlide?.src}
          alt={currentSlide?.alt || "Promotional banner"}
          onClick={() => handleSlideActivate(currentSlide, activeIndex)}
          sx={{
            ...fillImageSx,
            transition: "opacity 0.5s ease-in-out, transform 0.5s ease",
            cursor: onSlideClick ? "pointer" : "default",
          }}
        />

        {slideCount > 1 && (
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
              {carouselSlides.map((_, idx) => (
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
      </>
    );
  };

  const grid = (
    <Grid container spacing={{ xs: 2, md: 2 }} alignItems="stretch">
      <Grid
        item
        xs={12}
        md={showSideColumn ? 8 : 12}
        lg={showSideColumn ? 8.5 : 12}
        sx={{ display: "flex" }}
      >
        <Paper elevation={0} sx={mainPaperSx}>
          {renderMainContent()}
        </Paper>
      </Grid>

      {showSideColumn && (
        <Grid item xs={12} md={4} lg={3.5} sx={{ display: "flex" }}>
          <Stack
            direction="column"
            spacing={`${BANNER_SIDE_STACK_GAP_PX}px`}
            sx={{
              width: "100%",
              height: { xs: "auto", md: bannerMainHeightSx },
              minHeight: { xs: "auto", md: bannerMainHeightSx },
            }}
          >
            {(loading ? [0, 1] : [0, 1]).map((slot, index) => {
              const slide = loading ? null : sideSlides[index];
              const imageClass = `side-banner-${index + 1}`;
              const slideIndex = index + 1;

              return (
                <Paper
                  key={loading ? index : slide?.id || index}
                  elevation={0}
                  onClick={
                    loading || !slide || !onSlideClick
                      ? undefined
                      : () => handleSlideActivate(slide, slideIndex)
                  }
                  sx={sidePaperSx(imageClass)}
                >
                  {loading || !slide?.src ? (
                    <Skeleton
                      variant="rectangular"
                      sx={{ ...fillImageSx, position: "absolute" }}
                    />
                  ) : (
                    <Box
                      component="img"
                      className={imageClass}
                      src={slide.src}
                      alt={slide.alt || "Side banner"}
                      sx={{
                        ...fillImageSx,
                        transition: "transform 0.5s ease",
                      }}
                    />
                  )}
                </Paper>
              );
            })}
          </Stack>
        </Grid>
      )}
    </Grid>
  );

  if (!wrapSection) {
    return grid;
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
      <CustomContainer>{grid}</CustomContainer>
    </Box>
  );
};

export default PromotionalBannerGrid;
