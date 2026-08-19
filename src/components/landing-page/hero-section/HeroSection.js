import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  Fade,
  useTheme,
  alpha,
  IconButton,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useGetAllModulesCategories } from "api-manage/hooks/react-query/all-category/all-categorys";
import CustomContainer from "../../container";
import LandingCategoryTile from "../../home/LandingCategoryTile";
import {
  categorySectionHeaderRowSx,
  headerToCategoryBandSx,
} from "components/home/homeSectionRhythm";
import {
  CategoryScrollItem,
  CategoryScrollStrip,
  scrollCategoryStrip,
  useCategoryAutoScroll,
} from "components/home/CategoryHorizontalStrip";

const HeroSection = ({
  landingPageData,
  landingPageDataheroSection,
  promotionalBanner,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const scrollRef = useRef(null);

  // Dynamic Admin Panel Controls for Categories Section
  const isCategorySectionEnabled =
    landingPageData?.categories_section?.status !== 0 &&
    landingPageData?.categories_section?.status !== false;
  const categorySectionTitle =
    landingPageData?.categories_section?.title || "Featured Categories";
  const categorySectionSubtitle =
    landingPageData?.categories_section?.subtitle;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract all banners configured by Admin (No static / placeholder fallbacks)
  const bannerSectionEnabled =
    landingPageData?.banner_section?.banner_section_status !== 0 &&
    landingPageData?.banner_section?.banner_section_status !== false;
  const mainBannerUrl =
    bannerSectionEnabled && landingPageData?.banner_section?.banner_iamge_full_url
      ? landingPageData.banner_section.banner_iamge_full_url
      : null;

  const promoSectionEnabled =
    landingPageData?.promotional_banner_section?.promotion_banner_section_status !== 0 &&
    landingPageData?.promotional_banner_section?.promotion_banner_section_status !== false;

  const rawPromoBanners = promoSectionEnabled
    ? landingPageData?.promotional_banner_section?.promotion_banners_full_url || promotionalBanner || []
    : promotionalBanner || [];

  const promoBannersList = Array.isArray(rawPromoBanners)
    ? rawPromoBanners
        .map((item) =>
          typeof item === "string" ? item : item?.img || item?.image_full_url || item?.image
        )
        .filter(Boolean)
    : [];

  const adminBanners = [];
  if (mainBannerUrl && !adminBanners.includes(mainBannerUrl)) {
    adminBanners.push(mainBannerUrl);
  }
  promoBannersList.forEach((url) => {
    if (url && !adminBanners.includes(url)) {
      adminBanners.push(url);
    }
  });

  const totalBanners = adminBanners.length;
  const leftSlides =
    totalBanners >= 4
      ? [adminBanners[0], ...adminBanners.slice(3)]
      : totalBanners > 0
      ? [adminBanners[0]]
      : [];

  useEffect(() => {
    if (leftSlides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % leftSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [leftSlides.length]);

  const [activeCategoryBtn, setActiveCategoryBtn] = useState("right");
  const isDarkMode = theme.palette.mode === "dark";

  const handleCategoryScroll = (direction) => {
    setActiveCategoryBtn(direction);
    if (scrollRef.current) {
      const amount = direction === "left" ? -260 : 260;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const trustItems = [
    { icon: <VerifiedOutlinedIcon fontSize="small" />, label: "Verified Sellers" },
    { icon: <LocalShippingOutlinedIcon fontSize="small" />, label: "Fast Delivery" },
    { icon: <PaymentOutlinedIcon fontSize="small" />, label: "Secure Payment" },
    { icon: <SupportAgentOutlinedIcon fontSize="small" />, label: "24/7 Support" },
  ];

  // All categories across every module, straight from the backend — no static fallback.
  const { data: categoriesResponse } = useGetAllModulesCategories();
  const featuredCategories = categoriesResponse?.data || [];

  useCategoryAutoScroll(scrollRef, {
    enabled: featuredCategories.length > 1,
    intervalMs: 3000,
    pauseOnHover: true,
  });

  return (
    <Fade in={mounted} timeout={600}>
      <Box sx={{ width: "100%" }}>
        {/* ═══════════════════════════════════════════
            BOX 1: FEATURED CATEGORIES (TOP LEVEL)
        ═══════════════════════════════════════════ */}
        {isCategorySectionEnabled && featuredCategories.length > 0 && (
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
              {/* Header Row with Theme Blue Title & Circular Navigation Arrows */}
              <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
                mb={{ xs: 2.5, sm: 3, md: 3.5 }}
              >
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
                    {categorySectionTitle}
                  </Typography>

                  {Boolean(categorySectionSubtitle) && (
                    <Typography
                      variant="body1"
                      sx={{
                        mt: 0.5,
                        fontSize: { xs: "0.85rem", md: "0.95rem" },
                        color: (theme) => alpha(theme.palette.neutral[500], 0.85),
                        fontWeight: 400,
                      }}
                    >
                      {categorySectionSubtitle}
                    </Typography>
                  )}
                </Box>

                <Stack direction="row" spacing={1.2} alignItems="center">
                  {/* Prev Button */}
                  <IconButton
                    aria-label="Previous categories"
                    onClick={() => handleCategoryScroll("left")}
                    sx={{
                      width: { xs: 34, sm: 38 },
                      height: { xs: 34, sm: 38 },
                      borderRadius: "50%",
                      backgroundColor:
                        activeCategoryBtn === "left"
                          ? theme.palette.primary.main
                          : isDarkMode
                          ? "#334155"
                          : "#F1F5F9",
                      color:
                        activeCategoryBtn === "left"
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
                    <ArrowBackIosIcon sx={{ fontSize: { xs: 13, sm: 15 }, pl: "4px" }} />
                  </IconButton>

                  {/* Next Button */}
                  <IconButton
                    aria-label="Next categories"
                    onClick={() => handleCategoryScroll("right")}
                    sx={{
                      width: { xs: 34, sm: 38 },
                      height: { xs: 34, sm: 38 },
                      borderRadius: "50%",
                      backgroundColor:
                        activeCategoryBtn === "right"
                          ? theme.palette.primary.main
                          : isDarkMode
                          ? "#334155"
                          : "#F1F5F9",
                      color:
                        activeCategoryBtn === "right"
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
                    <ArrowForwardIosIcon sx={{ fontSize: { xs: 13, sm: 15 }, pl: "2px" }} />
                  </IconButton>
                </Stack>
              </Stack>

              {/* Horizontal Scroll Strip matching Shop by Brands UI */}
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
                {featuredCategories.map((cat, i) => (
                  <LandingCategoryTile
                    key={cat.id || cat.name || i}
                    category={cat}
                  />
                ))}
              </Box>
            </CustomContainer>
          </Box>
        )}

        {/* ═══════════════════════════════════════════
            HERO SECTION BANNERS (ADMIN UPLOADED ONLY)
        ═══════════════════════════════════════════ */}
        {totalBanners > 0 && (
          <Box
            sx={{
              background: theme.palette.background.paper,
              pt: isCategorySectionEnabled && featuredCategories.length > 0
                ? { xs: "12px", sm: "16px", md: "20px" }
                : { xs: "32px", sm: "44px", md: "52px" },
              pb: { xs: "12px", sm: "16px", md: "20px" },
              position: "relative",
              overflow: "hidden",
            }}
          >
            <CustomContainer>
              {totalBanners === 1 && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Paper
                      elevation={0}
                      sx={{
                        borderRadius: "8px",
                        overflow: "hidden",
                        position: "relative",
                        width: "100%",
                        height: { xs: "180px", sm: "240px", md: "300px", lg: "340px" },
                        border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
                        boxShadow: "0 6px 25px rgba(0,0,0,0.12)",
                      }}
                    >
                      <Box
                        component="img"
                        src={adminBanners[0]}
                        alt="Hero Promotional Banner"
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Paper>
                  </Grid>
                </Grid>
              )}

              {totalBanners === 2 && (
                <Grid container spacing={{ xs: 1.5, md: 2 }} alignItems="stretch">
                  {adminBanners.map((bannerUrl, idx) => (
                    <Grid item xs={12} sm={6} key={idx} sx={{ display: "flex" }}>
                      <Paper
                        elevation={0}
                        sx={{
                          borderRadius: "8px",
                          overflow: "hidden",
                          position: "relative",
                          width: "100%",
                          minHeight: { xs: "160px", sm: "190px", md: "230px", lg: "250px" },
                          height: "100%",
                          border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
                          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                        }}
                      >
                        <Box
                          component="img"
                          src={bannerUrl}
                          alt={`Hero Banner ${idx + 1}`}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}

              {totalBanners >= 3 && (
                <Grid container spacing={{ xs: 1.5, md: 2 }} alignItems="stretch">
                  {/* Left Column: Large Hero Banner Carousel */}
                  <Grid item xs={12} md={8} lg={8.5} sx={{ display: "flex" }}>
                    <Paper
                      elevation={0}
                      sx={{
                        borderRadius: "8px",
                        overflow: "hidden",
                        position: "relative",
                        width: "100%",
                        minHeight: { xs: "160px", sm: "210px", md: "240px", lg: "260px" },
                        height: "100%",
                        border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
                        boxShadow: "0 6px 25px rgba(0,0,0,0.12)",
                        "&:hover .carousel-arrow": {
                          opacity: 1,
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={leftSlides[activeBannerIndex % leftSlides.length]}
                        alt="Hero Promotional Banner"
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "opacity 0.5s ease-in-out, transform 0.5s ease",
                        }}
                      />

                      {leftSlides.length > 1 && (
                        <>
                          <IconButton
                            className="carousel-arrow"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveBannerIndex((prev) => (prev - 1 + leftSlides.length) % leftSlides.length);
                            }}
                            sx={{
                              position: "absolute",
                              left: 12,
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "rgba(0, 0, 0, 0.4)",
                              color: "#fff",
                              width: 36,
                              height: 36,
                              opacity: 0,
                              transition: "all 0.25s ease",
                              "&:hover": { background: "rgba(0, 0, 0, 0.75)" },
                            }}
                          >
                            <ArrowBackIosIcon sx={{ fontSize: 16, ml: 0.5 }} />
                          </IconButton>

                          <IconButton
                            className="carousel-arrow"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveBannerIndex((prev) => (prev + 1) % leftSlides.length);
                            }}
                            sx={{
                              position: "absolute",
                              right: 12,
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "rgba(0, 0, 0, 0.4)",
                              color: "#fff",
                              width: 36,
                              height: 36,
                              opacity: 0,
                              transition: "all 0.25s ease",
                              "&:hover": { background: "rgba(0, 0, 0, 0.75)" },
                            }}
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
                            {leftSlides.map((_, idx) => (
                              <Box
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveBannerIndex(idx);
                                }}
                                sx={{
                                  width: idx === activeBannerIndex % leftSlides.length ? 24 : 8,
                                  height: 8,
                                  borderRadius: 4,
                                  background: idx === activeBannerIndex % leftSlides.length ? theme.palette.primary.main : "rgba(255, 255, 255, 0.65)",
                                  boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
                                  cursor: "pointer",
                                  transition: "all 0.3s ease",
                                }}
                              />
                            ))}
                          </Stack>
                        </>
                      )}
                    </Paper>
                  </Grid>

                  {/* Right Column: Two Stacked Admin Banners */}
                  <Grid item xs={12} md={4} lg={3.5}>
                    <Stack spacing={{ xs: 1.5, md: 1.5 }} sx={{ height: "100%", justifyContent: "space-between" }}>
                      {/* Top Right Admin Banner */}
                      <Paper
                        elevation={0}
                        sx={{
                          borderRadius: "8px",
                          overflow: "hidden",
                          position: "relative",
                          flex: 1,
                          minHeight: { xs: "75px", sm: "100px", md: "115px", lg: "123px" },
                          height: "calc(50% - 6px)",
                          border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
                          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                        }}
                      >
                        <Box
                          component="img"
                          className="right-banner-1"
                          src={adminBanners[1]}
                          alt="Right Top Banner"
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Paper>

                      {/* Bottom Right Admin Banner */}
                      <Paper
                        elevation={0}
                        sx={{
                          borderRadius: "8px",
                          overflow: "hidden",
                          position: "relative",
                          flex: 1,
                          minHeight: { xs: "75px", sm: "100px", md: "115px", lg: "123px" },
                          height: "calc(50% - 6px)",
                          border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
                          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                        }}
                      >
                        <Box
                          component="img"
                          className="right-banner-2"
                          src={adminBanners[2]}
                          alt="Right Bottom Banner"
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Paper>
                    </Stack>
                  </Grid>
                </Grid>
              )}
            </CustomContainer>
          </Box>
        )}

        {/* ═══════════════════════════════════════════
            TRUST STRIP
        ═══════════════════════════════════════════ */}
        <Box
          sx={{
            background: "#fff",
            borderBottom: `1px solid ${theme.palette.divider}`,
            py: { xs: 1.5, md: 2 },
          }}
        >
          <CustomContainer>
            <Stack
              direction="row"
              justifyContent={{ xs: "flex-start", sm: "center" }}
              gap={{ xs: 2, sm: 4, md: 6 }}
              flexWrap="wrap"
            >
              {trustItems.map((item) => (
                <Stack
                  key={item.label}
                  direction="row"
                  alignItems="center"
                  gap={1}
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: { xs: "12px", sm: "13px" },
                    fontWeight: 500,
                    "& svg": { color: theme.palette.primary.main },
                  }}
                >
                  {item.icon}
                  {item.label}
                </Stack>
              ))}
            </Stack>
          </CustomContainer>
        </Box>
      </Box>
    </Fade>
  );
};

export default HeroSection;
