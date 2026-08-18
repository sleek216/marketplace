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
import {
  useGetFeaturedCategories,
} from "api-manage/hooks/react-query/all-category/all-categorys";
import CustomContainer from "../../container";
import LandingCategoryTile from "../LandingCategoryTile";
import { getCurrentModuleId, getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { useSelector } from "react-redux";

const CategoryStripShimmer = () => (
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

/** Featured Categories component matching Shop by Brands section UI 100% & Admin Config Ready */
const FeaturedCategories = ({ landingPageData }) => {
  const theme = useTheme();
  const scrollRef = useRef(null);
  const { selectedModule } = useSelector((state) => state.utilsData);
  const { data: featuredData, isLoading: featuredLoading } =
    useGetFeaturedCategories();
  const [activeBtn, setActiveBtn] = useState("right");

  const moduleId = selectedModule?.id || getCurrentModuleId();
  const moduleType = selectedModule?.module_type || getCurrentModuleType();

  // Dynamic admin config checks
  const isEnabled =
    landingPageData?.categories_section?.status !== 0 &&
    landingPageData?.categories_section?.status !== false;
  const sectionTitle =
    landingPageData?.categories_section?.title || "Featured Categories";
  const sectionSubtitle = landingPageData?.categories_section?.subtitle;

  const categories = React.useMemo(() => {
    const raw = Array.isArray(featuredData?.data) ? featuredData.data : [];
    const moduleScoped = raw.filter((cat) => {
      const catModuleId = cat?.module_id || cat?.module?.id;
      const catModuleType = cat?.module_type || cat?.module?.module_type;
      if (moduleId && catModuleId) return String(catModuleId) === String(moduleId);
      if (moduleType && catModuleType) return catModuleType === moduleType;
      return true;
    });
    const featuredOnly = moduleScoped.filter(
      (cat) => cat?.featured === 1 || cat?.featured === true
    );
    return featuredOnly.length > 0 ? featuredOnly : moduleScoped;
  }, [featuredData, moduleId, moduleType]);
  const isLoading = featuredLoading && categories.length === 0;

  const isDarkMode = theme.palette.mode === "dark";

  // Auto-scroll loop with pause on mouse hover
  useEffect(() => {
    if (!categories || categories.length <= 1) return undefined;
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
  }, [categories]);

  const handleScroll = (direction) => {
    setActiveBtn(direction);
    if (scrollRef.current) {
      const amount = direction === "left" ? -260 : 260;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  if (!isEnabled || (!isLoading && categories.length === 0)) {
    return null;
  }

  return (
    <Box
      sx={{
        pt: { xs: 5, sm: 6.5, md: 7.5 },
        pb: { xs: 3.5, sm: 4.5, md: 5 },
        mt: { xs: 1.5, sm: 2, md: 2.5 },
        width: "100%",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? theme.palette.background.paper
            : "#FFFFFF",
      }}
    >
      <CustomContainer>
        {/* Section Header with Blue Title & Arrow Controls */}
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
                fontSize: { xs: "1.15rem", sm: "1.3rem", md: "1.45rem" },
                fontWeight: 700,
                color: theme.palette.primary.main,
                letterSpacing: "-0.2px",
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

          {/* Navigation Circular Arrow Buttons in Theme Blue */}
          {!isLoading && categories.length > 0 && (
            <Stack direction="row" spacing={1.2} alignItems="center">
              {/* Prev Button */}
              <IconButton
                aria-label="Previous categories"
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
                    backgroundColor:
                      theme.palette.primary.dark || theme.palette.primary.main,
                    color: "#FFFFFF",
                  },
                }}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: { xs: 13, sm: 15 } }} />
              </IconButton>

              {/* Next Button */}
              <IconButton
                aria-label="Next categories"
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
                    backgroundColor:
                      theme.palette.primary.dark || theme.palette.primary.main,
                    color: "#FFFFFF",
                  },
                }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: { xs: 13, sm: 15 } }} />
              </IconButton>
            </Stack>
          )}
        </Stack>

        {/* Horizontal Category Circles Carousel */}
        {isLoading ? (
          <CategoryStripShimmer />
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
            {categories.map((cat, index) => (
              <LandingCategoryTile
                key={cat?.id || cat?.name || index}
                category={cat}
              />
            ))}
          </Box>
        )}
      </CustomContainer>
    </Box>
  );
};

export default FeaturedCategories;
