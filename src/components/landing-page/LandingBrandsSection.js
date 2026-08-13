import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { useRouter } from "next/router";
import useGetLandingBrands from "api-manage/hooks/react-query/brands/useGetLandingBrands";
import CustomContainer from "../container";

const CategoryBrandTile = ({ brand }) => {
  const theme = useTheme();
  const router = useRouter();
  const name = brand?.name;
  const id = brand?.id;
  const img = brand?.image_full_url;

  const handleClick = () => {
    router.push({
      pathname: "/search",
      query: {
        search_type: "item",
        brand_id: id,
        name: name || "",
      },
    });
  };

  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        cursor: "pointer",
        flexShrink: 0,
        width: { xs: "85px", sm: "100px", md: "110px" },
        transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          "& .circle-img-box": {
            transform: "scale(1.06)",
            boxShadow: isDarkMode
              ? "0px 8px 20px rgba(0, 0, 0, 0.4)"
              : `0px 8px 20px ${alpha(theme.palette.primary.main, 0.18)}`,
            borderColor: theme.palette.primary.main,
          },
          "& .brand-name-text": {
            color: theme.palette.primary.main,
          },
        },
      }}
    >
      {/* Slightly Compact Circular Photo Container */}
      <Box
        className="circle-img-box"
        sx={{
          width: { xs: "75px", sm: "90px", md: "100px" },
          height: { xs: "75px", sm: "90px", md: "100px" },
          borderRadius: "50%",
          backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
          border: `1.5px solid ${
            isDarkMode ? "rgba(255,255,255,0.1)" : "#E2E8F0"
          }`,
          boxShadow: isDarkMode
            ? "0px 3px 12px rgba(0, 0, 0, 0.3)"
            : "0px 3px 10px rgba(0, 0, 0, 0.04)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.25s ease-in-out",
          position: "relative",
          p: img ? 1.2 : 0,
        }}
      >
        {img ? (
          <Box
            component="img"
            src={img}
            alt={name}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
            }}
          />
        ) : (
          <StorefrontOutlinedIcon
            sx={{ fontSize: 28, color: theme.palette.text.secondary }}
          />
        )}
      </Box>

      {/* Brand Title */}
      <Typography
        className="brand-name-text"
        sx={{
          mt: 1,
          fontSize: { xs: "11px", sm: "12px", md: "13px" },
          fontWeight: 600,
          color: isDarkMode ? theme.palette.text.primary : "#1E293B",
          lineHeight: 1.25,
          textAlign: "center",
          width: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          transition: "color 0.2s ease-in-out",
        }}
      >
        {name}
      </Typography>
    </Box>
  );
};

const ShimmerLoadingStrip = () => (
  <Stack
    direction="row"
    spacing={{ xs: 2, sm: 2.5, md: 3 }}
    sx={{ overflow: "hidden" }}
  >
    {[...Array(7)].map((_, index) => (
      <Box
        key={index}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexShrink: 0,
          width: { xs: "85px", sm: "100px", md: "110px" },
        }}
      >
        <Skeleton
          variant="circular"
          sx={{
            width: { xs: "75px", sm: "90px", md: "100px" },
            height: { xs: "75px", sm: "90px", md: "100px" },
          }}
        />
        <Skeleton variant="text" width={64} sx={{ mt: 1 }} />
      </Box>
    ))}
  </Stack>
);

/** Compact Brand Carousel Component with Theme Blue Title & Adjusted Circle Size */
const LandingBrandsSection = ({ landingPageData }) => {
  const theme = useTheme();
  const scrollRef = useRef(null);
  const { data: brands = [], isLoading } = useGetLandingBrands();
  const [activeBtn, setActiveBtn] = useState("right");

  const isEnabled =
    landingPageData?.brands_section?.status !== 0 &&
    landingPageData?.brands_section?.status !== false;
  const sectionTitle =
    landingPageData?.brands_section?.title || "Shop By Category";
  const sectionSubtitle = landingPageData?.brands_section?.subtitle;

  const isDarkMode = theme.palette.mode === "dark";

  // Auto-scroll loop
  useEffect(() => {
    if (!brands || brands.length <= 1) return undefined;
    const el = scrollRef.current;
    if (!el) return undefined;

    let isPaused = false;
    const pause = () => {
      isPaused = true;
    };
    const resume = () => {
      isPaused = false;
    };

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);

    const interval = setInterval(() => {
      if (isPaused) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 4) return;

      const step = 130;
      if (el.scrollLeft >= maxScroll - 4) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 3800);

    return () => {
      clearInterval(interval);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
    };
  }, [brands]);

  const handleScroll = (direction) => {
    setActiveBtn(direction);
    if (scrollRef.current) {
      const amount = direction === "left" ? -260 : 260;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  if (!isEnabled || (!isLoading && brands.length === 0)) {
    return null;
  }

  return (
    <Box
      sx={{
        py: { xs: 3.5, sm: 4.5, md: 5 },
        width: "100%",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? theme.palette.background.paper
            : "#FFFFFF",
      }}
    >
      <CustomContainer>
        {/* Section Header with Blue Title */}
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          mb={{ xs: 2.5, sm: 3, md: 3.5 }}
        >
          {/* Title & Subtitle */}
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: "1.4rem", sm: "1.75rem", md: "2rem" },
                fontWeight: 700,
                color: theme.palette.primary.main,
                letterSpacing: "-0.3px",
                fontFamily: "inherit",
              }}
            >
              {sectionTitle}
            </Typography>

            {Boolean(sectionSubtitle) && (
              <Typography
                variant="body1"
                sx={{
                  mt: 0.5,
                  fontSize: { xs: "0.85rem", md: "0.95rem" },
                  color: (theme) => alpha(theme.palette.neutral[500], 0.85),
                  fontWeight: 400,
                }}
              >
                {sectionSubtitle}
              </Typography>
            )}
          </Box>

          {/* Arrow Buttons in Theme Blue */}
          {!isLoading && brands.length > 0 && (
            <Stack direction="row" spacing={1.2} alignItems="center">
              {/* Prev Button */}
              <IconButton
                aria-label="Previous items"
                onClick={() => handleScroll("left")}
                sx={{
                  width: { xs: 34, sm: 38 },
                  height: { xs: 34, sm: 38 },
                  borderRadius: "50%",
                  backgroundColor:
                    activeBtn === "left"
                      ? theme.palette.primary.main
                      : isDarkMode
                      ? "#334155"
                      : "#F1F5F9",
                  color:
                    activeBtn === "left"
                      ? "#FFFFFF"
                      : isDarkMode
                      ? "#94A3B8"
                      : "#475569",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark || theme.palette.primary.main,
                    color: "#FFFFFF",
                  },
                }}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: { xs: 13, sm: 15 } }} />
              </IconButton>

              {/* Next Button */}
              <IconButton
                aria-label="Next items"
                onClick={() => handleScroll("right")}
                sx={{
                  width: { xs: 34, sm: 38 },
                  height: { xs: 34, sm: 38 },
                  borderRadius: "50%",
                  backgroundColor:
                    activeBtn === "right"
                      ? theme.palette.primary.main
                      : isDarkMode
                      ? "#334155"
                      : "#F1F5F9",
                  color:
                    activeBtn === "right"
                      ? "#FFFFFF"
                      : isDarkMode
                      ? "#94A3B8"
                      : "#475569",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark || theme.palette.primary.main,
                    color: "#FFFFFF",
                  },
                }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: { xs: 13, sm: 15 } }} />
              </IconButton>
            </Stack>
          )}
        </Stack>

        {/* Horizontal Circle Strip with Compact Sizes */}
        {isLoading ? (
          <ShimmerLoadingStrip />
        ) : (
          <Box
            ref={scrollRef}
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: { xs: 2, sm: 2.5, md: 3 },
              overflowX: "auto",
              scrollBehavior: "smooth",
              py: 0.8,
              px: 0.4,
              width: "100%",
              "&::-webkit-scrollbar": { display: "none" },
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {brands.map((brand, index) => (
              <CategoryBrandTile key={brand?.id || index} brand={brand} />
            ))}
          </Box>
        )}
      </CustomContainer>
    </Box>
  );
};

export default LandingBrandsSection;
